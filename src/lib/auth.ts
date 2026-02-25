import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/resend";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleEnabled = Boolean(googleClientId && googleClientSecret);
const requireEmailVerification =
  process.env.DISABLE_EMAIL_VERIFICATION !== "true";

export const auth = betterAuth({
  trustedOrigins: [appUrl],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  ...(googleEnabled
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
          },
        },
      }
    : {}),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification,
    sendResetPassword: async ({ user, url, token }) => {
      const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
      sendPasswordResetEmail(user.email, resetUrl, user.name).catch((err) => {
        console.error("[Auth] Failed to send password reset email:", err);
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendVerificationEmail(user.email, url, user.name).catch((err) => {
        console.error("[Auth] Failed to send verification email:", err);
      });
    },
    autoSignInAfterVerification: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [openAPI()],
});
