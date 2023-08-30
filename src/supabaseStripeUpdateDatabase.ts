import { SupabaseManagement, Supabase } from "@trigger.dev/supabase";
import { Stripe } from "@trigger.dev/stripe";
import { TriggerClient } from "@trigger.dev/sdk";

const client = new TriggerClient({ id: "jobs-showcase" });

export const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_API_KEY!,
});

const supabase = new Supabase({
  id: "supabase",
  supabaseUrl: process.env.SUPABASE_PUBLIC_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

// Use OAuth to authenticate with Supabase Management API
const supabaseManagement = new SupabaseManagement({
  id: "supabase-management",
});

// Update a Supabase table when a Stripe account is updated
client.defineJob({
  id: "supabase-stripe-update-database",
  name: "Supabase: update database when Stripe account is updated",
  version: "1.0.0",
  integrations: {
    stripe,
    supabase,
  },
  trigger: stripe.onAccountUpdated({ connect: true }),
  run: async (payload, io, ctx) => {
    const stripeAccountId = payload.id;
    const { payouts_enabled, charges_enabled, details_submitted } = payload;

    const updatedAt = new Date().toISOString();

    await io.supabase.runTask("update-stripe-account", async (database) => {
      const { data, error } = await database
        .from("accounts")
        .update({
          payouts_enabled,
          charges_enabled,
          details_submitted,
          updated_at: updatedAt,
        })
        .eq("stripe_account_id", stripeAccountId);

      if (error) throw error;

      return data;
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
