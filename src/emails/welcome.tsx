import {
    Body,
    Button,
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
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    username?: string;
    verifyUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const WelcomeEmail = ({
    username = "there",
    verifyUrl = "https://sentinel.com/verify",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#000000",
                                offwhite: "#fafafa",
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
                <Preview>Welcome to Sentinel - The uptime monitoring platform.</Preview>
                <Body className="bg-white my-auto mx-auto font-sans antialiased">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${baseUrl}/static/sentinel-logo.png`}
                                width="40"
                                height="40"
                                alt="Sentinel"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to <strong>Sentinel</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {username},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We're excited to have you on board. Sentinel helps you keep track
                            of your services with reliable uptime monitoring and instant
                            alerts.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={verifyUrl}
                            >
                                Get Started
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            or copy and paste this URL into your browser:{" "}
                            <Link href={verifyUrl} className="text-blue-600 no-underline">
                                {verifyUrl}
                            </Link>
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This invitation was intended for{" "}
                            <span className="text-black">{username}</span>. If you were not
                            expecting this invitation, you can ignore this email. If you are
                            concerned about your account's safety, please reply to this email
                            to get in touch with us.
                        </Text>
                    </Container>
                    <Text className="text-[#666666] text-[12px] text-center mt-[20px]">
                        © 2026 Sentinel Inc. • 123 Monitor Way, Cloud City
                    </Text>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
