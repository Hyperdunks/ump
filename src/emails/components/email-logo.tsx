import { Img } from "@react-email/components";
import { appUrl } from "@/lib/app-url";

interface EmailLogoProps {
  width: string | number;
  height: string | number;
  alt: string;
  className?: string;
}

export function EmailLogoStyles() {
  return null;
}

export function EmailLogo({ width, height, alt, className }: EmailLogoProps) {
  return (
    <Img
      src={`${appUrl}/logo-dark.png`}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  );
}
