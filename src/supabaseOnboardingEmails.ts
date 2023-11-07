import { SupabaseManagement } from "@trigger.dev/supabase";
import { Database } from "./mocks/supabase-types";
import { Resend } from "@trigger.dev/resend";
import { TriggerClient } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

// Use OAuth to authenticate with Supabase Management API
const supabaseManagement = new SupabaseManagement({
  id: "supabase-management",
});

const db = supabaseManagement.db<Database>(
  // process.env.NEXT_PUBLIC_SUPABASE_URL! // Use if using standard Supabase domain
  process.env.SUPABASE_REFERENCE_ID! // Use if using a Supabase custom domain
);

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

// This job triggers when a Supabase user confirms their email address
client.defineJob({
  id: "welcome-email-campaign",
  name: "Welcome Email Campaign",
  version: "1.0.0",
  trigger: db.onUpdated({
    // This job triggers when there is an update in the 'users' table of the 'auth' schema.
    // Specifically, it watches for a change in the 'email_confirmed_at' field from null (unconfirmed email)
    // to a timestamp (confirmed email).
    schema: "auth",
    table: "users",
    filter: {
      old_record: {
        email_confirmed_at: [{ $isNull: true }],
      },
      record: {
        email_confirmed_at: [{ $isNull: false }],
      },
    },
  }),
  integrations: {
    resend,
  },
  run: async (payload, io, ctx) => {
    if (!payload.record.email) {
      return;
    }

    const isTestOrDev =
      ctx.run.isTest || ctx.environment.type === "DEVELOPMENT";

    // Only wait for 10 seconds when running as a test or in the development environment
    await io.wait("wait-1", isTestOrDev ? 10 : 60 * 60); // 1 hour

    const email1 = await io.resend.sendEmail("email-1", {
      to: payload.record.email,
      subject: `Thanks for joining Acme Inc`,
      text: `Hi there, welcome to our community! This is the first email we send you to help you get started.`,
      from: process.env.RESEND_FROM_EMAIL!,
    });

    await io.wait("wait-2", isTestOrDev ? 10 : 60 * 60 * 12); // 12 hours

    const email2 = await io.resend.sendEmail("email-2", {
      to: payload.record.email,
      subject: `Here are some tips to get started`,
      text: `Hi there, welcome to our community! This is the second email we send you to help you get started.`,
      from: process.env.RESEND_FROM_EMAIL!,
    });

    await io.wait("wait-3", isTestOrDev ? 10 : 60 * 60 * 24); // 24 hours

    const email3 = await io.resend.sendEmail("email-3", {
      to: payload.record.email,
      subject: "Do you have any questions?",
      text: `Hi there, welcome to our community! This is the third email we send you to help you get started.`,
      from: process.env.RESEND_FROM_EMAIL!,
    });

    return {
      email1,
      email2,
      email3,
    };
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
