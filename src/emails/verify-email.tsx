import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface VerifyEmailProps {
    verificationUrl: string;
}

export function VerifyEmail({
    verificationUrl = "https://example.com/verify",
}: VerifyEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={title}>Verify Your Email</Heading>
                    </Section>

                    <Section style={content}>
                        <Text style={paragraph}>
                            Thanks for signing up! Please verify your email address by
                            clicking the button below.
                        </Text>

                        <Section style={buttonContainer}>
                            <Button style={button} href={verificationUrl}>
                                Verify Email Address
                            </Button>
                        </Section>

                        <Text style={paragraph}>
                            If you didn't create an account, you can safely ignore this email.
                        </Text>

                        <Text style={smallText}>
                            If the button doesn't work, copy and paste this link into your
                            browser:
                        </Text>
                        <Text style={linkText}>{verificationUrl}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        This link will expire in 24 hours for security reasons.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default VerifyEmail;

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

const header = {
    backgroundColor: "#6366f1",
    borderRadius: "8px 8px 0 0",
    padding: "32px 24px",
    textAlign: "center" as const,
};

const title = {
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

const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px 0",
};

const buttonContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#6366f1",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "12px 32px",
    display: "inline-block",
};

const smallText = {
    color: "#6b7280",
    fontSize: "12px",
    margin: "16px 0 4px 0",
};

const linkText = {
    color: "#6366f1",
    fontSize: "12px",
    wordBreak: "break-all" as const,
    margin: "0",
};

const hr = {
    borderColor: "#e5e5e5",
    margin: "24px 0",
};

const footer = {
    color: "#9ca3af",
    fontSize: "12px",
    textAlign: "center" as const,
};
