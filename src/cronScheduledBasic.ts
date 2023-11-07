import { TriggerClient, cronTrigger } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

// This Job runs at 2.30pm every Monday using a cron schedule expression.
client.defineJob({
  id: "cron-scheduled-basic",
  name: "CRON scheduled basic",
  version: "1.0.0",
  trigger: cronTrigger({
    // Note that the time is in UTC.
    // Converted to cron schedule expression using https://crontab.guru/
    cron: "30 14 * * 1",
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Received the scheduled event", {
      payload,
    });

    return { foo: "bar" };
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
