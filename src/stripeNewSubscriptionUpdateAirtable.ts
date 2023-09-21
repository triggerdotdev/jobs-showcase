import { TriggerClient } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Airtable } from "@trigger.dev/airtable";

const client = new TriggerClient({ id: "jobs-showcase" });

const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_API_KEY!,
});

//this will use the passed in token (defined in your environment variables)
const airtable = new Airtable({
  id: "airtable",
  token: process.env.AIRTABLE_TOKEN!,
});

//this is the type definition for the table
type SubscribedUsers = {
  id: string;
  interval: string;
  currency: string;
  unitAmount?: number;
};

// This job populates an Airtable table when a new customer subscription is created in Stripe
client.defineJob({
  id: "stripe-new-subscription-update-airtable",
  name: "On new Stripe subscription update Airtable",
  version: "1.0.0",
  integrations: {
    stripe,
    airtable,
  },
  trigger: stripe.onCustomerSubscription(),
  run: async (payload, io, ctx) => {
    // Adding the type to table<YourTableType>("<your table name>")
    // gives you nice type inference and errors.
    // You can leave it out as well table("<your table name>")
    const table = io.airtable
      .base("<your base id>")
      .table<SubscribedUsers>("<your table name>");

    //create a new record
    const newRecords = await table.createRecords("create records", [
      {
        // Check the Stripe documents for object info: https://stripe.com/docs/api/subscriptions/object
        fields: {
          id: payload.id,
          interval: payload.items.data[0].price.recurring?.interval,
          currency: payload.items.data[0].price.currency,
          // The unit amount in pence to be charged, represented as a whole integer if possible.
          unitAmount: payload.items.data[0].price.unit_amount ?? undefined,
        },
      },
    ]);

    await io.logger.info("A new subscription was created.");
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
