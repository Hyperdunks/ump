import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/resend";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Don't await to prevent timing attacks
      void sendPasswordResetEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Don't await to prevent timing attacks
      void sendVerificationEmail(user.email, url);
    },
    autoSignInAfterVerification: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [openAPI()],
});
