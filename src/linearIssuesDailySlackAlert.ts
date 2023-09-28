import { TriggerClient, cronTrigger } from "@trigger.dev/sdk";
import { Linear } from "@trigger.dev/linear";
import { Slack } from "@trigger.dev/slack";

const linear = new Linear({
  id: "linear",
  apiKey: process.env.LINEAR_API_KEY!,
});

const slack = new Slack({ id: "slack" });

const client = new TriggerClient({ id: "jobs-showcase" });

client.defineJob({
  id: "linear-issues-daily-slack-alert",
  name: "Daily Slack alert for Linear issues",
  version: "1.0.0",
  integrations: {
    linear,
    slack,
  },
  trigger: cronTrigger({
    // Note that the time is in UTC.
    // Converted to cron schedule expression using https://crontab.guru/
    cron: "0 9 * * 1,2,3,4,5",
  }),

  run: async (payload, io, ctx) => {
    const inProgressIssues = await io.linear.issues("get-in-progress-issues", {
      //  Only get the first 20 issues
      first: 20,
      filter: {
        team: {
          id: {
            // To get your Team id from within Linear, hit CMD+K and "Copy model UUID"
            eq: "<your-team-uuid>",
          },
        },
        assignee: {
          email: {
            eq: "<assignee-email-address>",
          },
        },
        state: {
          name: {
            eq: "In Progress",
          },
        },
      },
    });

    await io.slack.postMessage("post message", {
      channel: process.env.SLACK_CHANNEL_ID!,
      // Include text for notifications and blocks to get a rich Slack message in the channel
      text: `You have ${inProgressIssues.nodes.length} 'In Progress' issues in Linear!`,
      // Create rich Slack messages with the Block Kit builder https://app.slack.com/block-kit-builder/
      blocks: inProgressIssues.nodes.flatMap((issue) => [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `⏳ *${issue.title}*`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "View issue",
              emoji: true,
            },
            value: "click_me_123",
            url: issue.url,
            action_id: "button-action",
          },
        },
        {
          type: "divider",
        },
      ]),
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
import { get } from "http";
createExpressServer(client);
