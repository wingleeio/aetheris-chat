import React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

interface EmailVerificationProps {
    code: string;
}

export const EmailVerification = ({ code }: Readonly<EmailVerificationProps>) => {
    return (
        <Html>
            <Head />
            <Preview>Use this verification code to verify your email</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Verify your email</Heading>
                    <Text style={{ ...text, marginBottom: "14px" }}>
                        Copy and paste this temporary verifcation code:
                    </Text>
                    <code style={codeContainer}>{code}</code>
                    <Text
                        style={{
                            ...text,
                            color: "#ababab",
                            marginTop: "14px",
                            marginBottom: "16px",
                        }}
                    >
                        If you didn&apos;t try to join, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: "#ffffff",
};

const container = {
    paddingLeft: "12px",
    paddingRight: "12px",
    margin: "0 auto",
};

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
};

const link = {
    color: "#2754C5",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    textDecoration: "underline",
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0",
};

const codeContainer = {
    display: "inline-block",
    padding: "16px 4.5%",
    width: "90.5%",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    border: "1px solid #eee",
    color: "#333",
};
