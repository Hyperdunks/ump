"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/sign-in");
    } else {
      router.replace("/dashboard/settings");
    }
  }, [isPending, session, router]);

  return null;
}
