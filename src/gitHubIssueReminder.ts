import { TriggerClient } from "@trigger.dev/sdk";
import { Github, events } from "@trigger.dev/github";
import { Slack } from "@trigger.dev/slack";

const client = new TriggerClient({ id: "jobs-showcase" });

const github = new Github({ id: "github" });
const slack = new Slack({ id: "slack" });

client.defineJob({
  id: "new-github-issue-reminder",
  name: "GitHub: new issue reminder",
  version: "1.0.0",
  trigger: github.triggers.repo({
    event: events.onIssueOpened,
    owner: "triggerdotdev",
    repo: "empty",
  }),
  integrations: {
    github,
    slack,
  },
  run: async (payload, io, ctx) => {
    const delayDuration =
      ctx.environment.type === "DEVELOPMENT" ? 3 : 60 * 60 * 24;
    await io.wait("wait 24 hours", delayDuration);

    const issue = await io.github.getIssue("get issue", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issueNumber: payload.issue.number,
    });

    if (issue.updated_at === payload.issue.updated_at) {
      const assigneeResult = await io.github.addIssueAssignees("add assignee", {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issueNumber: payload.issue.number,
        assignees: [payload.sender.login],
      });

      await io.slack.postMessage("send reminder", {
        channel: process.env.SLACK_CHANNEL_ID!,
        text: `Issue ${payload.issue.title} is still open. I've assigned it to ${payload.sender.login}.\n${issue.html_url}`,
      });
    }
  },
});
