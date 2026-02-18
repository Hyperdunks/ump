import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  Column,
  Row,
  Button,
} from "@react-email/components";
import * as React from "react";

interface AlertSummaryEmailProps {
  alerts?: {
    monitorName: string;
    status: "down" | "degraded";
    timestamp: string;
    incidentId: string;
  }[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const AlertSummaryEmail = ({
  alerts = [
    {
      monitorName: "Production API",
      status: "down",
      timestamp: "10:23 AM UTC",
      incidentId: "inc_123",
    },
    {
      monitorName: "Payment Gateway",
      status: "degraded",
      timestamp: "10:21 AM UTC",
      incidentId: "inc_124",
    },
  ],
}: AlertSummaryEmailProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#000000",
                alert: "#e11d48", // Rose-600
                warning: "#d97706", // Amber-600
              },
              fontFamily: {
                sans: [
                  "-apple-system",
                  "BlinkMacSystemFont",
                  "Segoe UI",
                  "Roboto",
                  "Helvetica Neue",
                  "Ubuntu",
                  "sans-serif",
                ],
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Alert: Services require attention</Preview>
        <Body className="bg-white my-auto mx-auto font-sans antialiased">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[16px]">
              <Row>
                <Column>
                  <Img
                    src={`${baseUrl}/static/sentinel-logo.png`}
                    width="32"
                    height="32"
                    alt="Sentinel"
                  />
                </Column>
                <Column align="right">
                  <Text className="text-[#666666] text-[12px]">
                    Alert Summary
                  </Text>
                </Column>
              </Row>
            </Section>

            <Heading className="text-black text-[20px] font-medium p-0 my-[24px] mx-0">
              {alerts.length} Service(s) Reported Issues
            </Heading>

            <Section>
              {alerts.map((alert, index) => (
                <Row
                  key={index}
                  className="border-b border-solid border-[#eaeaea] py-[12px]"
                >
                  <Column width="20" align="left" className="align-middle">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${alert.status === "down" ? "bg-[#e11d48]" : "bg-[#d97706]"}`}
                    />
                  </Column>
                  <Column align="left">
                    <Text className="text-black text-[14px] font-medium m-0">
                      {alert.monitorName}
                    </Text>
                    <Text className="text-[#666666] text-[12px] m-0">
                      {alert.timestamp}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Button
                      href={`https://sentinel.com/incidents/${alert.incidentId}`}
                      className="text-[12px] font-medium text-black no-underline bg-[#f3f4f6] px-3 py-1.5 rounded border border-solid border-[#e5e7eb]"
                    >
                      View
                    </Button>
                  </Column>
                </Row>
              ))}
            </Section>

            <Section className="mt-[32px]">
              <Link
                href="https://sentinel.com/dashboard"
                className="text-blue-600 text-[14px] no-underline"
              >
                Go to Dashboard &rarr;
              </Link>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              You are receiving this email because you are subscribed to
              component alerts on Sentinel.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AlertSummaryEmail;
