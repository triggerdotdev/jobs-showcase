import { TriggerClient, cronTrigger } from "@trigger.dev/sdk";
import { Github } from "@trigger.dev/github";
import { OpenAI } from "@trigger.dev/openai";
import { Slack } from "@trigger.dev/slack";

const client = new TriggerClient({ id: "jobs-showcase" });

const github = new Github({
  id: "github",
  token: process.env.GITHUB_TOKEN!,
});

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY!,
});

const slack = new Slack({ id: "slack" });

// This Job runs at 7am every day using a cron schedule expression.
client.defineJob({
  id: "summarize-yesterday-commits-on-slack",
  name: "Summarize yesterday's commits on Slack",
  version: "1.0.0",
  trigger: cronTrigger({
    // Note that the time is in UTC.
    // Converted to cron schedule expression using https://crontab.guru/
    cron: "0 7 * * *",
  }),
  integrations: {
    github,
    openai,
    slack,
  },
  run: async (payload, io, ctx) => {
    // 1. Calculate the 'since' and 'until' timestamps for yesterday.
    const timestamps = await io.runTask("get-timestamps", async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC

      const yesterdayEnd = new Date(today);
      yesterdayEnd.setUTCDate(today.getUTCDate() - 1); // Subtract a day
      const yesterdayStart = new Date(yesterdayEnd);
      yesterdayStart.setUTCDate(yesterdayEnd.getUTCDate() - 1); // Subtract another day

      // Convert to ISO format
      const since = yesterdayStart.toISOString();
      const until = yesterdayEnd.toISOString();

      return { since, until };
    });

    // 2. Get yesterday's commits from GitHub
    const owner = "<your-org-name>";
    const repo = "<your-repo-name>";

    const { data } = await io.github.runTask(
      "get-yesterdays-commits",
      async (client) => {
        return client.rest.repos.listCommits({
          owner: owner,
          repo: repo,
          since: timestamps.since,
          until: timestamps.until,
        });
      },
      { name: "Get Yesterday's Commits" }
    );

    // 3. Turn the commit data into a shorter format for OpenAI:
    const formattedCommits = await io.runTask("format-commits", async () => {
      return data.map((commit: any) => {
        return {
          author: commit.commit.author.name,
          message: commit.commit.message,
          time: commit.commit.author.date,
          link: commit.html_url,
        };
      });
    });

    // 4. Summarize the commits with OpenAI
    const chatCompletion = await io.openai.createChatCompletion(
      "chat-completion",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a expert programmer experienced in GitHub. You are to concisely summarize the GitHub commits in one message. Reply with a heading message -- 'GitHub Commits for ${repo} yesterday' -- followed by a summary of the commits. Use bullet points in your summary list and use appropriate spacing for maximum readability.`,
          },
          {
            role: "user",
            content: `Here are all of the GitHub commits from yesterday (delimited by triple quotes below). Please summarize them like "{user} {message} ({url})".\n\n"""${JSON.stringify(
              formattedCommits,
              null,
              2
            )}"""`,
          },
        ],
      }
    );

    // 5. Post to Slack
    const response = await io.slack.postMessage("post message", {
      channel: process.env.SLACK_CHANNEL_ID!,
      text: chatCompletion.choices[0]?.message?.content || "No summary found",
    });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
