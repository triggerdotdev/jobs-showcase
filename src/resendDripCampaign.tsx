import { TriggerClient, TriggerContext, eventTrigger } from "@trigger.dev/sdk";
import {
  FirstEmail,
  MonthLaterEmail,
  SecondEmail,
  ThirdEmail,
} from "./mocks/reactEmails";
import { Resend } from "@trigger.dev/resend";
import { z } from "zod";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

// This job sends a drip campaign using Resend
client.defineJob({
  id: "resend-drip-campaign",
  name: "Resend: email drip campaign",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "send.drip.campaign",
    schema: z.object({
      to: z.string(),
      // The 'from' email address must be a verified domain in your Resend account.
      from: z.string(),
      name: z.string(),
    }),
  }),
  integrations: {
    resend,
  },
  run: async (payload, io, ctx) => {
    const email1 = {
      text: `Hi there, welcome to our community! This is the first email we send you to help you get started.`,
    };

    // Email 1, triggered by an event
    await io.resend.sendEmail("email-1", {
      to: payload.to,
      from: payload.from,
      subject: `Thanks for joining Acme Inc`,
      text: email1.text,
      react: <FirstEmail name={payload.name} text={email1.text} />,
    });

    await io.wait("wait-1-day", delay(60 * 60 * 24 * 1, ctx));

    const email2 = {
      text: `Hi there, welcome to our community! This is the second email we send you to help you get started.`,
    };

    // Email 2, triggered after a day
    await io.resend.sendEmail("email-2", {
      to: payload.to,
      from: payload.from,
      subject: `Here are some tips to get started`,
      text: email2.text,
      react: <SecondEmail name={payload.name} text={email2.text} />,
    });

    await io.wait("wait-4-days", delay(60 * 60 * 24 * 4, ctx));

    const email3 = {
      text: `Hi there, welcome to our community! This is the third email we send you to help you get started.`,
    };

    // Email 3, triggered after 5 days
    await io.resend.sendEmail("email-3", {
      to: payload.to,
      from: payload.from,
      subject: `Do you have any questions?`,
      text: email3.text,
      react: <ThirdEmail name={payload.name} text={email3.text} />,
    });

    await io.wait("wait-26-days", delay(60 * 60 * 24 * 26, ctx));

    const email4 = {
      text: `This is the fourth email designed to re-engage your users after a month.`,
    };

    // Email 4, triggered after 30 days
    await io.resend.sendEmail("email-4", {
      to: payload.to,
      from: payload.from,
      subject: `How are you getting on with Acme Inc.?`,
      text: email4.text,
      react: <MonthLaterEmail name={payload.name} text={email4.text} />,
    });
  },
});

function delay(seconds: number, context: TriggerContext) {
  if (context.environment.type === "DEVELOPMENT" || context.run.isTest) {
    return 10;
  }
  return seconds;
}

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
