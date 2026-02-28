import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
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

interface MonitorRecoveredProps {
  monitorName?: string;
  monitorUrl?: string;
  monitorId?: string;
  incidentId?: string;
  downtimeDuration?: string;
  timestamp?: string;
  viewMonitorUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const MonitorRecovered = ({
  monitorName = "Monitor",
  monitorUrl = "",
  incidentId = "",
  downtimeDuration = "",
  timestamp = "",
  viewMonitorUrl = "",
}: MonitorRecoveredProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
                success: "#059669",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>RECOVERED: {monitorName} is back online</Preview>
        <Body className="bg-white font-sans text-base antialiased text-[#24292e]">
          <Container className="my-10 mx-auto p-5 max-w-[480px]">
            <Section className="mb-8">
              <Img
                src={`${baseUrl}/static/sentinel-logo.png`}
                width="32"
                height="32"
                alt="Sentinel"
              />
            </Section>

            <Section className="bg-[#ecfdf5] rounded-lg border border-solid border-[#d1fae5] p-6 mb-6">
              <Row>
                <Column width="24" valign="middle">
                  <div className="w-3 h-3 rounded-full bg-[#059669]" />
                </Column>
                <Column>
                  <Heading className="text-[18px] font-semibold text-[#065f46] p-0 m-0">
                    Monitor Recovered
                  </Heading>
                </Column>
              </Row>
              <Text className="text-[14px] text-[#047857] mt-2 mb-0">
                <strong>{monitorName}</strong> is back online and reachable.
              </Text>
            </Section>

            <Section className="bg-[#fafafa] rounded border border-solid border-[#eaeaea] p-4 mb-6">
              <Row className="mb-2">
                <Column width="30%">
                  <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                    URL
                  </Text>
                </Column>
                <Column>
                  <Link
                    href={monitorUrl}
                    className="text-[14px] text-[#09090b] underline"
                  >
                    {monitorUrl}
                  </Link>
                </Column>
              </Row>
              <Row className="mb-2">
                <Column width="30%">
                  <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                    Total Downtime
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-[14px] text-[#09090b]">
                    {downtimeDuration}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column width="30%">
                  <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                    Recovered At
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-[14px] text-[#09090b]">
                    {timestamp}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-6 text-center">
              <Button
                className="bg-white rounded text-[#000000] text-[14px] font-medium no-underline text-center px-6 py-3 inline-block min-w-[150px] border border-solid border-[#e5e7eb] hover:bg-[#f4f4f5]"
                href={viewMonitorUrl}
              >
                View Monitor
              </Button>
            </Section>

            <Text className="text-[12px] text-[#a1a1aa] mt-8 text-center">
              © 2026 Sentinel Inc.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MonitorRecovered;
