import { TriggerClient } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_API_KEY!,
});

// This job will run when a new subscription is created in Stripe
client.defineJob({
  id: "stripe-on-subscription-created",
  name: "Stripe: on subscription created",
  version: "1.0.0",
  trigger: stripe.onCustomerSubscriptionCreated(),
  run: async (payload, io, ctx) => {
    await io.logger.info("A new subscription was created.");
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
