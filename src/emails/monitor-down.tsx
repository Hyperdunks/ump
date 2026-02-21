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

interface MonitorDownProps {
  monitorName?: string;
  monitorUrl?: string;
  incidentId?: string;
  reason?: string;
  timestamp?: string;
  viewIncidentUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const MonitorDown = ({
  monitorName = "Production API",
  monitorUrl = "https://api.sentinel.com",
  incidentId = "inc_123",
  reason = "Connection Timeout (5000ms)",
  timestamp = "Jan 08, 2026 10:45 PM UTC",
  viewIncidentUrl = "https://sentinel.com/incidents/inc_123",
}: MonitorDownProps) => {
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
            },
          },
        }}
      >
        <Head />
        <Preview>DOWN: {monitorName} is currently unreachable</Preview>
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

            <Section className="bg-[#fef2f2] rounded-lg border border-solid border-[#fee2e2] p-6 mb-6">
              <Row>
                <Column width="24" valign="middle">
                  <div className="w-3 h-3 rounded-full bg-[#e11d48]" />
                </Column>
                <Column>
                  <Heading className="text-[18px] font-semibold text-[#991b1b] p-0 m-0">
                    Monitor is DOWN
                  </Heading>
                </Column>
              </Row>
              <Text className="text-[14px] text-[#7f1d1d] mt-2 mb-0">
                Your monitor <strong>{monitorName}</strong> is not responding.
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
                    Reason
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-[14px] text-[#09090b] font-mono bg-[#f4f4f5] px-1 rounded">
                    {reason}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column width="30%">
                  <Text className="m-0 text-[12px] font-bold text-[#71717a] uppercase tracking-wide">
                    Time
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
                className="bg-[#e11d48] rounded text-white text-[14px] font-medium no-underline text-center px-6 py-3 inline-block min-w-[150px] border border-solid border-[#be123c] hover:bg-[#be123c]"
                href={viewIncidentUrl}
              >
                View Incident Details
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

export default MonitorDown;
