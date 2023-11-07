import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { Slack } from "@trigger.dev/slack";
import { z } from "zod";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const slack = new Slack({ id: "slack" });

// This job sends a basic message to a Slack channel.
client.defineJob({
  id: "post-slack-message",
  name: "Post Slack Message",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "slack.test",
    schema: z.object({
      channelID: z.string(),
      text: z.string(),
    }),
  }),
  integrations: {
    slack,
  },
  run: async (payload, io, ctx) => {
    const response = await io.slack.postMessage("post message", {
      channel: payload.channelID,
      text: payload.text,
    });
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
