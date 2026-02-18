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
  Column,
  Row,
} from "@react-email/components";
import * as React from "react";

interface AccountSecurityAlertEmailProps {
  username?: string;
  device?: string;
  location?: string;
  ipAddress?: string;
  timestamp?: string;
  secureAccountUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const AccountSecurityAlertEmail = ({
  username = "Harsh",
  device = "Chrome on Windows",
  location = "Hyderabad, India",
  ipAddress = "192.168.1.1",
  timestamp = "January 8, 2026 at 10:23 PM",
  secureAccountUrl = "https://sentinel.com/account/secure",
}: AccountSecurityAlertEmailProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
                alert: "#e11d48",
              },
              spacing: {
                0: "0px",
                20: "20px",
                40: "40px",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Security Alert: Verify your login attempt</Preview>
        <Body className="bg-white font-sans text-base antialiased text-[#24292e]">
          <Container className="my-10 mx-auto p-5 max-w-[480px]">
            <Section className="mb-6">
              <Img
                src={`${baseUrl}/static/sentinel-logo.png`}
                width="40"
                height="40"
                alt="Sentinel"
                className="mx-auto"
              />
            </Section>

            <Section className="bg-white rounded-lg border border-solid border-[#e5e7eb] overflow-hidden shadow-sm">
              <Section className="bg-[#fef2f2] px-6 py-4 border-b border-solid border-[#fee2e2]">
                <Row>
                  <Column width="30">
                    <Img
                      src="https://react.email/static/question-mark-circle.png"
                      width="24"
                      height="24"
                      alt="Alert"
                    />
                  </Column>
                  <Column>
                    <Heading className="text-[#991b1b] text-[16px] font-semibold m-0">
                      Was this login you?
                    </Heading>
                  </Column>
                </Row>
              </Section>

              <Section className="p-6">
                <Text className="m-0 mb-4 text-[#52525b] text-[14px] leading-6">
                  We noticed a new login to your Sentinel account{" "}
                  <strong>{username}</strong> from a device we don't recognize.
                </Text>

                <div className="bg-[#f4f4f5] rounded p-4 mb-6">
                  <Row className="mb-2">
                    <Column width="30%">
                      <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                        Device
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 text-[14px] text-[#09090b]">
                        {device}
                      </Text>
                    </Column>
                  </Row>
                  <Row className="mb-2">
                    <Column width="30%">
                      <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                        Location
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 text-[14px] text-[#09090b]">
                        {location}
                      </Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column width="30%">
                      <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                        IP Address
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 text-[14px] text-[#09090b]">
                        {ipAddress}
                      </Text>
                    </Column>
                  </Row>
                </div>

                <div className="text-center">
                  <Button
                    className="bg-[#000000] rounded-md text-white text-[14px] font-medium no-underline inline-block min-w-[150px] py-3 mb-3 mx-2 border border-solid border-black hover:bg-[#27272a]"
                    href={secureAccountUrl}
                  >
                    Yes, it was me
                  </Button>

                  <Button
                    className="bg-white rounded-md text-[#ef4444] text-[14px] font-medium no-underline inline-block min-w-[150px] py-3 mx-2 border border-solid border-[#fca5a5] hover:bg-[#fef2f2]"
                    href={secureAccountUrl}
                  >
                    No, secure my account
                  </Button>
                </div>
              </Section>
            </Section>

            <Text className="text-center text-[12px] text-[#a1a1aa] mt-8">
              © 2026 Sentinel Inc. 123 Monitor Way, Cloud City.
            </Text>
            <Text className="text-center text-[12px] text-[#a1a1aa] mt-2">
              <Link href="#" className="text-[#a1a1aa] underline">
                Unsubscribe
              </Link>{" "}
              •{" "}
              <Link href="#" className="text-[#a1a1aa] underline">
                Privacy Policy
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountSecurityAlertEmail;
