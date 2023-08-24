import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { Resend } from "@trigger.dev/resend";
import { z } from "zod";

const client = new TriggerClient({ id: "jobs-showcase" });

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

// This job sends a basic email to a 'to' email address, a 'subject', a 'text' field and a 'from' email address.
client.defineJob({
  id: "resend-send-basic-email",
  name: "Resend: send basic email",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "send.email",
    schema: z.object({
      to: z.union([z.string(), z.array(z.string())]),
      subject: z.string(),
      text: z.string(),
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
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
