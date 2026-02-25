"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailClient({
  initialEmail,
}: {
  initialEmail: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const sendVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error("Enter your email address first.");
      return;
    }

    setIsSending(true);
    const { error } = await authClient.sendVerificationEmail({
      email: normalizedEmail,
      callbackURL: "/dashboard",
    });
    setIsSending(false);

    if (error) {
      toast.error(error.message || "Could not send verification email.");
      return;
    }

    setHasSent(true);
    toast.success("Verification email sent. Check your inbox.");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          If your account exists and is not verified, we will send a fresh
          verification link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={sendVerification} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? "Sending..." : "Send verification link"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-between gap-2 text-sm">
        <Link href="/sign-in" className="text-muted-foreground underline">
          Back to sign in
        </Link>

        {hasSent ? (
          <span className="text-muted-foreground">Link sent</span>
        ) : null}
      </CardFooter>
    </Card>
  );
}
