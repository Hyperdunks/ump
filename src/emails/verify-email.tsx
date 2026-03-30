import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { EmailLogo, EmailLogoStyles } from "@/emails/components/email-logo";
import { appUrl } from "@/lib/app-url";

interface VerifyEmailProps {
  username?: string;
  verificationUrl?: string;
}

export const VerifyEmail = ({
  username = "there",
  verificationUrl = `${appUrl}/verify-email?token=123`,
}: VerifyEmailProps) => {
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
        <Head>
          <EmailLogoStyles />
        </Head>
        <Preview>Verify your email address for Sentinel</Preview>
        <Body className="bg-white font-sans text-base antialiased text-[#24292e]">
          <Container className="my-10 mx-auto p-5 max-w-[480px]">
            <Section className="mb-8">
              <EmailLogo width="35" height="35" alt="Sentinel" />
            </Section>

            <Heading className="text-[24px] font-semibold text-[#000000] p-0 my-6 mx-0">
              Verify your email address
            </Heading>

            <Text className="text-[14px] leading-6 text-[#52525b] mb-4">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-6 text-[#52525b] mb-6">
              Thanks for starting your new Sentinel account. We want to make
              sure it's really you. Please click the button below to verify your
              email address.
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="bg-[#000000] rounded text-white text-[14px] font-medium no-underline text-center px-6 py-3 inline-block min-w-[150px] border border-solid border-black hover:bg-[#27272a]"
                href={verificationUrl}
              >
                Verify email address
              </Button>
            </Section>

            <Text className="text-[14px] leading-6 text-[#52525b] mb-4">
              Or copy and paste this URL into your browser:{" "}
              <Link href={verificationUrl} className="text-blue-600 underline">
                {verificationUrl}
              </Link>
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

export default VerifyEmail;
