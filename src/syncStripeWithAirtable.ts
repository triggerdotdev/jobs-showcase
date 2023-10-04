import { TriggerClient } from "@trigger.dev/sdk";
import { Stripe } from "@trigger.dev/stripe";
import { Airtable } from "@trigger.dev/airtable";

const client = new TriggerClient({ id: "jobs-showcase" });

const stripe = new Stripe({
  id: "stripe",
  apiKey: process.env.STRIPE_API_KEY!,
});

const airtable = new Airtable({
  id: "airtable",
  token: process.env.AIRTABLE_TOKEN!,
});

type Customers = {
  stripe_customer_id?: string;
  Sales?: string[];
};

type Sales = {
  payment_intent_id: string;
  amount: number;
  currency: string;
  Customers?: string[];
  "stripe_customer_id (from Customers)": string;
};

client.defineJob({
  id: "stripe-new-sale-update-airtable",
  name: "On new Stripe sale update Airtable",
  version: "1.0.0",
  integrations: {
    stripe,
    airtable,
  },
  trigger: stripe.onPaymentIntentSucceeded(),
  run: async (payload, io, ctx) => {
    const customersTable = io.airtable
      .base("appDxZsujEQXpkCKr")
      .table<Customers>("Customers");

    const salesTable = io.airtable
      .base("appDxZsujEQXpkCKr")
      .table<Sales>("Sales");

    const {
      id: payment_intent_id,
      customer: stripe_customer_id,
      amount,
      currency,
    } = payload;

    // Use the filter formula to find a customer record with the given stripe_customer_id
    const records = await customersTable.getRecords(
      "Filter records by stripe_customer_id",
      {
        filterByFormula: `{stripe_customer_id} = "${stripe_customer_id}"`,
        fields: ["stripe_customer_id"],
      }
    );

    let customerRecordId;
    if (records && records.length > 0) {
      // There is an existing customer
      customerRecordId = records[0].id;
    } else {
      const newCustomerRecord = await customersTable.createRecords(
        "create new customer record",
        [
          {
            fields: { stripe_customer_id: stripe_customer_id as string },
          },
        ]
      );
      customerRecordId = newCustomerRecord[0].id;
    }

    // Add sale to the Sales table
    const newSaleRecord = await salesTable.createRecords(
      "create new sale record",
      [
        {
          fields: {
            payment_intent_id,
            amount,
            currency,
            Customers: [customerRecordId], // Link to the customer record using its ID
          },
        },
      ]
    );
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
