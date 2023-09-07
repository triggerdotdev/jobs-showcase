import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

const button = {
  fontSize: "14px",
  font: "bold",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.2em",
  textAlign: "center" as const,
};

export function FirstEmail({ name, text }: { name: string; text: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Acme Inc!</Preview>
      <Container>
        <Section>
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

export function SecondEmail({ name, text }: { name: string; text: string }) {
  return (
    <Html>
      <Head />
      <Preview>Acme Inc tips!</Preview>
      <Container>
        <Section>
          <Text>Hey {name}!</Text>
          <Text>{text}</Text>
          <Button style={button} pY={4} pX={4} href="https://acmecompany.inc/">
            Let's go!
          </Button>
        </Section>
      </Container>
    </Html>
  );
}

export function ThirdEmail({ name, text }: { name: string; text: string }) {
  return (
    <Html>
      <Head />
      <Preview>We would love your feedback!</Preview>
      <Container>
        <Section>
          <Text>Hey {name}!</Text>
          <Text>{text}</Text>
          <Button style={button} pY={4} pX={4} href="https://acmecompany.inc/">
            Let's go!
          </Button>
        </Section>
      </Container>
    </Html>
  );
}

export function MonthLaterEmail({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Is there anything we can do to improve your experience?</Preview>
      <Container>
        <Section>
          <Text>Hey {name}!</Text>
          <Text>{text}</Text>
          <Button style={button} pY={4} pX={4} href="https://acmecompany.inc/">
            Let's go!
          </Button>
        </Section>
      </Container>
    </Html>
  );
}
