import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordProps {
  username?: string;
  resetUrl?: string;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sentinel.harsh.xyz";
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ResetPassword = ({
  username = "there",
  resetUrl = `${appUrl}/api/auth/reset?token=123`,
}: ResetPasswordProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Reset your Sentinel password</Preview>
        <Body className="bg-white font-sans text-base antialiased text-[#24292e]">
          <Container className="my-10 mx-auto p-5 max-w-[480px]">
            <Section className="mb-8">
              <Img
                src={`${baseUrl}/static/sentinel-logo.png`}
                width="40"
                height="40"
                alt="Sentinel"
              />
            </Section>

            <Heading className="text-[24px] font-semibold text-[#000000] p-0 my-6 mx-0">
              Reset your password
            </Heading>

            <Text className="text-[14px] leading-6 text-[#52525b] mb-4">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-6 text-[#52525b] mb-6">
              Someone recently requested a password change for your Sentinel
              account. If this was you, you can set a new password here:
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="bg-[#000000] rounded text-white text-[14px] font-medium no-underline text-center px-6 py-3 inline-block min-w-[150px] border border-solid border-black hover:bg-[#27272a]"
                href={resetUrl}
              >
                Reset password
              </Button>
            </Section>

            <Text className="text-[14px] leading-6 text-[#52525b] mb-6">
              If you don't want to change your password or didn't request this,
              just ignore and delete this message.
            </Text>

            <Text className="text-[12px] text-[#a1a1aa] mt-8 text-center">
              © 2026 Sentinel Inc.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
