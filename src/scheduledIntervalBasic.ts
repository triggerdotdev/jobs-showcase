import { TriggerClient, intervalTrigger } from "@trigger.dev/sdk";

const client = new TriggerClient({ id: "jobs-showcase" });

// This Job will run every 60s, starting 60s after it is first indexed.
client.defineJob({
  id: "scheduled-interval-basic",
  name: "Scheduled interval basic",
  version: "1.0.0",
  trigger: intervalTrigger({
    seconds: 60,
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Received the scheduled event", {
      payload,
    });

    return { foo: "bar" };
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
