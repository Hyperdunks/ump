import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const userRouter = new Elysia({ prefix: "/user" })
  .use(betterAuthPlugin)
  // Get current user profile
  .get(
    "/me",
    async ({ user: authUser }) => {
      const [dbUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, authUser.id));

      if (!dbUser) {
        return { message: "User not found" };
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
        emailVerified: dbUser.emailVerified,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };
    },
    { auth: true },
  )

  // Upload user profile image
  .post(
    "/image",
    async ({ user: authUser, body, status }) => {
      const { file } = body;

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return status(400, {
          message: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        });
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return status(400, {
          message: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      // Get current user to check for existing image
      const [currentUser] = await db
        .select({ image: user.image })
        .from(user)
        .where(eq(user.id, authUser.id));

      // Delete old image if exists (and is a blob URL)
      if (currentUser?.image?.includes("blob.vercel-storage.com")) {
        try {
          await del(currentUser.image);
        } catch (error) {
          // Log but don't fail if deletion fails
          console.error("Failed to delete old image:", error);
        }
      }

      // Generate unique filename
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `avatars/${authUser.id}/${Date.now()}.${extension}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });

      // Update user record with new image URL
      const [updatedUser] = await db
        .update(user)
        .set({ image: blob.url })
        .where(eq(user.id, authUser.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });

      return {
        message: "Image uploaded successfully",
        data: updatedUser,
        blob: {
          url: blob.url,
          downloadUrl: blob.downloadUrl,
          pathname: blob.pathname,
        },
      };
    },
    {
      auth: true,
      body: t.Object({
        file: t.File(),
      }),
    },
  )

  // Delete user profile image
  .delete(
    "/image",
    async ({ user: authUser, status }) => {
      // Get current user image
      const [currentUser] = await db
        .select({ image: user.image })
        .from(user)
        .where(eq(user.id, authUser.id));

      if (!currentUser?.image) {
        return status(404, { message: "No image to delete" });
      }

      // Delete from Vercel Blob if it's a blob URL
      if (currentUser.image.includes("blob.vercel-storage.com")) {
        try {
          await del(currentUser.image);
        } catch (error) {
          console.error("Failed to delete image from blob storage:", error);
        }
      }

      // Clear image from user record
      const [updatedUser] = await db
        .update(user)
        .set({ image: null })
        .where(eq(user.id, authUser.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });

      return {
        message: "Image deleted successfully",
        data: updatedUser,
      };
    },
    { auth: true },
  )

  // Update user profile (name only, email changes require verification)
  .put(
    "/me",
    async ({ user: authUser, body }) => {
      const [updatedUser] = await db
        .update(user)
        .set({ name: body.name })
        .where(eq(user.id, authUser.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });

      return {
        message: "Profile updated successfully",
        data: updatedUser,
      };
    },
    {
      auth: true,
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
      }),
    },
  );
