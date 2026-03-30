"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 32, className }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/logo-dark.png"
        alt="Sentinel"
        width={size}
        height={size}
        className="block dark:hidden"
        priority
      />
      <Image
        src="/logo-light.png"
        alt="Sentinel"
        width={size}
        height={size}
        className="hidden dark:block"
        priority
      />
    </span>
  );
}
