import { Plain } from "@trigger.dev/plain";
import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

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
      // If customer isn't found they should be created
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

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
