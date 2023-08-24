import { TriggerClient } from "@trigger.dev/sdk";
import { Github, events } from "@trigger.dev/github";
import { Slack } from "@trigger.dev/slack";

const client = new TriggerClient({ id: "jobs-showcase" });

const github = new Github({ id: "github" });
const slack = new Slack({ id: "slack" });

// This Job will run when a star is added or removed from the triggerdotdev/trigger.dev repo
client.defineJob({
  id: "github-new-star-to-slack",
  name: "GitHub: new star to slack",
  version: "1.0.0",
  trigger: github.triggers.repo({
    event: events.onStar,
    owner: "triggerdotdev",
    repo: "trigger.dev",
  }),
  integrations: {
    slack,
  },
  run: async (payload, io, ctx) => {
    await io.slack.postMessage("post message", {
      channel: process.env.SLACK_CHANNEL_ID!,
      text: `New GitHub star from ${payload.sender.html_url}, ${payload.sender.name}. Your new GitHub star count is ${payload.repository.stargazers_count}.`,
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
