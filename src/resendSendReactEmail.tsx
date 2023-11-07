import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { Resend } from "@trigger.dev/resend";
import { z } from "zod";

// react-email imports
import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";
import { Section } from "@react-email/section";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

// Email styling
const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  font: "bold",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.2em",
  textAlign: "center" as const,
};

function BasicEmail({ name, text }: { name: string; text: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Acme Inc!</Preview>
      <Container style={container}>
        <Section style={section}>
          <Text>Hey {name}!</Text>
          <Text>{text}</Text>
          <Button style={button} pY={4} pX={4} href="https://acmecompany.inc/">
            Get started
          </Button>
        </Section>
      </Container>
    </Html>
  );
}

// This job sends a basic email built using React and Typescript
client.defineJob({
  id: "resend-send-react-email",
  name: "Resend: send react email",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "send.email",
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      text: z.string(),
      name: z.string(),
      // The 'from' email address must be a verified domain in your Resend account.
      from: z.string(),
    }),
  }),
  integrations: {
    resend,
  },
  run: async (payload, io, ctx) => {
    await io.resend.sendEmail("send-email", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      from: payload.from,
      // BasicEmail is the custom React component that will be used to style the email
      react: <BasicEmail name={payload.name} text={payload.text} />,
    });
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
