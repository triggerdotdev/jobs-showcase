import { TriggerClient, TriggerContext, eventTrigger } from "@trigger.dev/sdk";
import { SendGrid } from "@trigger.dev/sendgrid";
import { z } from "zod";

const client = new TriggerClient({ id: "jobs-showcase" });

const sendgrid = new SendGrid({
  id: "sendgrid",
  apiKey: process.env.SENDGRID_API_KEY!,
});

/**
 * This job handles a 4-step onboarding email sequence using SendGrid.
 *
 * Trigger Mechanism:
 * - The job is triggered by an `eventTrigger` named "sendgrid.onboarding.email.campaign".
 * - Events can be sent either from your own code using `client.sendEvent()` or from another job using `io.sendEvent()`.
 *   For further details, refer to the Trigger.dev documentation:
 *   https://trigger.dev/docs/documentation/concepts/triggers/events#sending-events
 *
 * Payload Schema:
 * - 'to': The recipient's email address. Must be a valid email.
 * - 'from': The sender's email address. Must be a valid email and a verified domain in your SendGrid account.
 * - 'name': (Optional) The name of the recipient.
 * - 'subject': The subject line for the email.
 * - 'text': The text content of the email.
 *
 * Job Flow:
 * 1. Immediately sends a welcome email after the event trigger.
 * 2. Sends a tips email 24 hours later.
 * 3. Sends a follow-up email 5 days later.
 * 4. Sends a check-in email 30 days later.
 *
 */
client.defineJob({
  id: "sendgrid-onboarding-email-campaign",
  name: "SendGrid Onboarding Email Campaign",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "sendgrid.onboarding.email.campaign",
    schema: z.object({
      to: z.string().email(),
      from: z.string().email(),
      name: z.string().optional(),
      subject: z.string(),
      text: z.string(),
    }),
  }),
  integrations: {
    sendgrid,
  },
  run: async (payload, io, ctx) => {
    const name = payload.name || "there";

    // Send the first email immediately on an eventTrigger
    const email1 = await io.sendgrid.sendEmail("send-email-1-immediately", {
      to: payload.to,
      subject: `Thanks for joining Acme Inc`,
      text: `Hi ${name}, welcome to our community! This is the first email we send you to help you get started.`,
      from: payload.from,
    });

    // Send the 2nd email 24 hours after eventTrigger
    await io.wait("wait-1-day-for-email-2", delay(60 * 60 * 24 * 1, ctx)); // 1 day

    const email2 = await io.sendgrid.sendEmail("email-2", {
      to: payload.to,
      subject: `Here are some tips to get started`,
      text: `Hi ${name}, welcome to our community! This is the second email we send you to help you get started.`,
      from: payload.from,
    });

    // Send the 3rd email 5 days after eventTrigger
    await io.wait("wait-4-days-for-email-3", delay(60 * 60 * 24 * 4, ctx)); // 4 days

    const email3 = await io.sendgrid.sendEmail("email-3", {
      to: payload.to,
      subject: "Do you have any questions?",
      text: `Hi ${name}, welcome to our community! This is the third email we send you to help you get started.`,
      from: payload.from,
    });

    // Send the 4th email 30 days after eventTrigger
    await io.wait("wait-25-days-for-email-4", delay(60 * 60 * 24 * 25, ctx)); // 25 days

    const email4 = await io.sendgrid.sendEmail("email-4", {
      to: payload.to,
      subject: "How was your first month with us?",
      text: `Hi ${name}, welcome to our community! This is the fourth email we send you to check in after 30 days.`,
      from: payload.from,
    });

    return {
      email1,
      email2,
      email3,
      email4,
    };
  },
});

// Only wait for 10 seconds when running as a test or in the development environment
function delay(seconds: number, context: TriggerContext) {
  if (context.environment.type === "DEVELOPMENT" || context.run.isTest) {
    return 10;
  }
  return seconds;
}

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
