import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface MonitorRecoveredEmailProps {
    monitorName: string;
    monitorUrl: string;
    timestamp: string;
    downtimeDuration?: string;
}

export function MonitorRecoveredEmail({
    monitorName = "Example Monitor",
    monitorUrl = "https://example.com",
    timestamp = new Date().toISOString(),
    downtimeDuration,
}: MonitorRecoveredEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>✅ {monitorName} is back UP</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={successBanner}>
                        <Text style={successEmoji}>✅</Text>
                        <Heading style={successTitle}>Monitor Recovered</Heading>
                    </Section>

                    <Section style={content}>
                        <Heading as="h2" style={monitorNameStyle}>
                            {monitorName}
                        </Heading>

                        <Text style={label}>URL</Text>
                        <Text style={value}>{monitorUrl}</Text>

                        {downtimeDuration && (
                            <>
                                <Text style={label}>Downtime Duration</Text>
                                <Text style={durationValue}>{downtimeDuration}</Text>
                            </>
                        )}

                        <Text style={label}>Recovered At</Text>
                        <Text style={value}>
                            {new Date(timestamp).toLocaleString("en-US", {
                                dateStyle: "full",
                                timeStyle: "long",
                            })}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        You're receiving this because you have alerts enabled for this
                        monitor.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default MonitorRecoveredEmail;

// Styles
const main = {
    backgroundColor: "#f6f6f6",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
};

const successBanner = {
    backgroundColor: "#16a34a",
    borderRadius: "8px 8px 0 0",
    padding: "24px",
    textAlign: "center" as const,
};

const successEmoji = {
    fontSize: "48px",
    margin: "0 0 8px 0",
};

const successTitle = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
};

const content = {
    backgroundColor: "#ffffff",
    borderRadius: "0 0 8px 8px",
    padding: "32px",
    border: "1px solid #e5e5e5",
    borderTop: "none",
};

const monitorNameStyle = {
    color: "#171717",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 24px 0",
};

const label = {
    color: "#737373",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "16px 0 4px 0",
};

const value = {
    color: "#171717",
    fontSize: "14px",
    margin: "0 0 8px 0",
};

const durationValue = {
    color: "#16a34a",
    fontSize: "14px",
    margin: "0 0 8px 0",
    backgroundColor: "#f0fdf4",
    padding: "8px 12px",
    borderRadius: "4px",
};

const hr = {
    borderColor: "#e5e5e5",
    margin: "24px 0",
};

const footer = {
    color: "#737373",
    fontSize: "12px",
    textAlign: "center" as const,
};
