import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WeeklyDigestEmailProps {
  startDate?: string;
  endDate?: string;
  stats?: {
    uptime: number;
    incidents: number;
    avgResponseTime: number;
    monitorsActive: number;
  };
}

const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const WeeklyDigestEmail = ({
  startDate = "",
  endDate = "",
  stats = {
    uptime: 0,
    incidents: 0,
    avgResponseTime: 0,
    monitorsActive: 0,
  },
}: WeeklyDigestEmailProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
                muted: "#737373",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>
          Your Weekly Sentinel Report: {stats.uptime.toString()}% Uptime
        </Preview>
        <Body className="bg-white my-auto mx-auto font-sans antialiased">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[16px] mb-[24px]">
              <Img
                src={`${appUrl}/static/sentinel-logo.png`}
                width="32"
                height="32"
                alt="Sentinel"
                className="my-0"
              />
            </Section>

            <Heading className="text-black text-[20px] font-medium p-0 m-0">
              Weekly Digest
            </Heading>
            <Text className="text-[#666666] text-[14px] mt-[4px] mb-[24px]">
              {startDate} - {endDate}
            </Text>

            <Section className="bg-[#fafafa] rounded-lg p-4 border border-solid border-[#eaeaea]">
              <Row>
                <Column align="center">
                  <Text className="text-[#666666] text-[12px] uppercase font-bold m-0 tracking-wider">
                    Uptime
                  </Text>
                  <Text className="text-black text-[24px] font-semibold m-0 mt-2">
                    {stats.uptime}%
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[12px] uppercase font-bold m-0 tracking-wider">
                    Avg Latency
                  </Text>
                  <Text className="text-black text-[24px] font-semibold m-0 mt-2">
                    {stats.avgResponseTime}ms
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-[24px]">
              <Row className="mb-[16px]">
                <Column>
                  <Text className="text-black text-[14px] font-medium m-0">
                    Total Incidents
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-black text-[14px] m-0">
                    {stats.incidents}
                  </Text>
                </Column>
              </Row>
              <Hr className="border border-solid border-[#eaeaea] my-[8px]" />
              <Row className="mb-[16px]">
                <Column>
                  <Text className="text-black text-[14px] font-medium m-0">
                    Monitors Active
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-black text-[14px] m-0">
                    {stats.monitorsActive}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-[32px] text-center">
              <Button
                className="bg-white text-black text-[12px] font-medium border border-solid border-[#eaeaea] rounded px-5 py-3 hover:bg-[#fafafa]"
                href={`${appUrl}/dashboard`}
              >
                View Full Report
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] text-center">
              © 2026 Sentinel Inc.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WeeklyDigestEmail;
