import { TriggerClient } from "@trigger.dev/sdk";
import { Github, events } from "@trigger.dev/github";
import { Linear } from "@trigger.dev/linear";
import { Slack } from "@trigger.dev/slack";

const client = new TriggerClient({ id: "jobs-showcase" });

const linear = new Linear({
  id: "linear",
  apiKey: process.env.LINEAR_API_KEY!,
});
const slack = new Slack({ id: "slack" });

const github = new Github({ id: "github" });

client.defineJob({
  id: "linear-create-issue-on-github-pr",
  name: "Create a Linear issue when a pull request is opened on a GitHub repo",
  version: "1.0.0",
  trigger: github.triggers.repo({
    event: events.onPullRequest,
    owner: "<your-org-name>",
    repo: "<your-repo-name>",
  }),
  integrations: {
    linear,
    github,
    slack,
  },
  run: async (payload, io, ctx) => {
    const pullRequestTitle = payload.pull_request.title;
    const pullRequestURL = payload.pull_request.issue_url;
    const pullRequestAuthorURL = payload.sender.html_url;
    const pullRequestDescription = payload.pull_request.body;

    const issue = await io.linear.createIssue("create issue", {
      title: pullRequestTitle,
      description: pullRequestDescription,
      // To get your Team id from within Linear, hit CMD+K and "Copy model UUID"
      teamId: "<your-team-uuid>",
    });

    await io.slack.postMessage("post message", {
      // Set the Slack channel ID (not name) in your environment variables
      channel: process.env.SLACK_CHANNEL_ID!,
      text: `⚡️ New pull request, "${pullRequestTitle}", ${pullRequestURL},
            \n created by 👨‍💻 "${pullRequestAuthorURL}"
            \n New issue has been created in Linear: ${issue?.url}.`,
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
