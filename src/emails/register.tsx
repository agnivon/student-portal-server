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
  Text,
} from "@react-email/components";
import * as React from "react";
import dotenv from "dotenv";

dotenv.config();

interface RegisterEmailProps {
  registrationCode?: string;
}

const baseUrl = process.env.BASE_URL;
const clientHost = process.env.CLIENT_HOST;

export const RegistrationEmail = ({ registrationCode }: RegisterEmailProps) => (
  <Html>
    <Head />
    <Preview>Your registration code for Student Portal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/public/images/logo.svg`}
          width="42"
          height="42"
          alt="Student Portal"
          style={logo}
        />
        <Heading style={heading}>
          Your registration code for Student Portal
        </Heading>
        <Section style={buttonContainer}>
          <Button style={button} href={`${clientHost}/register`}>
            Register on Student Portal
          </Button>
        </Section>
        <Text style={paragraph}>
          Use this registration code to register as a student on Student Portal.
        </Text>
        <code style={code}>{registrationCode}</code>
        <Hr style={hr} />
        <Link href={`${clientHost}/login`} style={reportLink}>
          Student Portal
        </Link>
      </Container>
    </Body>
  </Html>
);

RegistrationEmail.PreviewProps = {
  registrationCode: "tt226-5398x",
} as RegisterEmailProps;

export default RegistrationEmail;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
