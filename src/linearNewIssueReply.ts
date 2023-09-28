import { TriggerClient } from "@trigger.dev/sdk";
import { Linear } from "@trigger.dev/linear";

const client = new TriggerClient({ id: "jobs-showcase" });

const linear = new Linear({
  id: "linear",
  apiKey: process.env.LINEAR_API_KEY!,
});

client.defineJob({
  id: "linear-new-issue-reply",
  name: "Linear: New Issue Reply",
  version: "1.0.0",
  integrations: {
    linear,
  },
  trigger: linear.onIssueCreated(),
  run: async (payload, io, ctx) => {
    const newIssueId = payload.data.id;
    await io.linear.createComment("create-comment", {
      issueId: newIssueId,
      body: "Thanks for opening this issue!",
    });
    await io.linear.createReaction("create-reaction", {
      issueId: newIssueId,
      emoji: "+1",
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
