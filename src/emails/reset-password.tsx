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

interface ResetPasswordEmailProps {
    resetUrl: string;
}

export function ResetPasswordEmail({
    resetUrl = "https://example.com/reset-password",
}: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset your password</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={title}>Reset Your Password</Heading>
                    </Section>

                    <Section style={content}>
                        <Text style={paragraph}>
                            We received a request to reset your password. Click the button
                            below to choose a new password.
                        </Text>

                        <Section style={buttonContainer}>
                            <Button style={button} href={resetUrl}>
                                Reset Password
                            </Button>
                        </Section>

                        <Text style={paragraph}>
                            If you didn't request a password reset, you can safely ignore this
                            email. Your password will remain unchanged.
                        </Text>

                        <Text style={smallText}>
                            If the button doesn't work, copy and paste this link into your
                            browser:
                        </Text>
                        <Text style={linkText}>{resetUrl}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        This link will expire in 1 hour for security reasons.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default ResetPasswordEmail;

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
    backgroundColor: "#f59e0b",
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
    backgroundColor: "#f59e0b",
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
    color: "#f59e0b",
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
