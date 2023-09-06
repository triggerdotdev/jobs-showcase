import { Job, TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import {
  ComponentDividerSpacingSize,
  ComponentTextColor,
  ComponentTextSize,
  Plain,
} from "@trigger.dev/plain";

const client = new TriggerClient({ id: "jobs-showcase" });

export const plain = new Plain({
  id: "plain",
  apiKey: process.env.PLAIN_API_KEY!,
});

// This Job will use update a customer's information in Plain based on an identifier.
client.defineJob({
  id: "plain-update-customer",
  name: "Plain: update customer",
  version: "1.0.0",
  integrations: {
    plain,
  },
  trigger: eventTrigger({
    name: "plain.update.customer",
  }),
  run: async (payload, io, ctx) => {
    const { customer } = await io.plain.upsertCustomer("upsert-customer", {
      identifier: {
        emailAddress: "rick.astley@gmail.com",
      },
      // If customer isn't found and should be created
      // then these details will be used:
      onCreate: {
        email: {
          email: "rick.astley@gmail.com",
          isVerified: true,
        },
        fullName: "Rick Astley",
        externalId: "u_123",
      },
      // If customer is found their details will be updated
      onUpdate: {
        fullName: {
          value: "Rick Astley",
        },
        // This is the id of the customer in your own backend.
        externalId: {
          value: "u_123",
        },
      },
    });
  },
});
