import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { SendGrid } from "@trigger.dev/sendgrid";
import { z } from "zod";

export const client = new TriggerClient({ id: "jobs-showcase" });

const sendgrid = new SendGrid({
  id: "sendgrid",
  apiKey: process.env.SENDGRID_API_KEY!,
});

// This job sends a basic email to a 'to' email address, a 'subject', a 'text' field and a 'from' email address.
client.defineJob({
  id: "sendgrid-send-basic-email",
  name: "SendGrid: send basic email",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "send.email",
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      text: z.string(),
      // The 'from' email address must be a verified domain in your SendGrid account.
      from: z.string(),
    }),
  }),
  integrations: {
    sendgrid,
  },
  run: async (payload, io, ctx) => {
    await io.sendgrid.sendEmail("send-email", {
      to: payload.to,
      from: payload.from,
      subject: payload.subject,
      text: payload.text,
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
