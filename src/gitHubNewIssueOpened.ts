import { TriggerClient } from "@trigger.dev/sdk";
import { Github, events } from "@trigger.dev/github";

const client = new TriggerClient({ id: "jobs-showcase" });

const github = new Github({ id: "github" });

// This Job will run when a new issue is opened on a repo you have admin rights to
// Once created, it will add a 'Bug' label to the issue
client.defineJob({
  id: "github-new-issue-opened",
  name: "GitHub: new issue opened",
  version: "1.0.0",
  integrations: { github: github },
  trigger: github.triggers.repo({
    event: events.onIssueOpened,
    owner: "<your-org-name>",
    repo: "<your-repo-name>",
  }),
  run: async (payload, io, ctx) => {
    await io.github.addIssueLabels("add label", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issueNumber: payload.issue.number,
      labels: ["bug"],
    });
    return { payload, ctx };
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
