# Trigger.dev Jobs Showcase

This repository contains a collection of code-only Jobs that can be run using Trigger.dev. It is a great place to start if you want to see how to use Trigger.dev and our integrations in your own projects.

For full project examples using Trigger.dev, check out our [Examples repo](https://github.com/triggerdotdev/examples).

## About Trigger.dev

Trigger.dev is a framework for creating long-running Jobs directly in your Next.js app with API integrations, webhooks, scheduling and delays. You can reliably run Jobs that wouldn’t normally work in serverless environments (like Vercel) because of timeouts.

## Jobs in this repo:

The Jobs can be run locally using the `@trigger.dev/cli` and `@trigger.dev/express` packages.

| Status | Title                                                                                                                                                          | Description                                                                                           | Integrations                                                                                                                                                                        | Contributor                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ✅     | **[Cron scheduled basic](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/cronScheduledBasic.ts)**                                                 | A scheduled Job which runs at 2:30pm every Monday.                                                    | None                                                                                                                                                                                | Trigger.dev                                   |
| ✅     | **[Delay example joke](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/delayExampleJoke.ts)**                                                     | Logs a message to the console, waits for 5 minutes, and then logs another message.                    | None                                                                                                                                                                                | Trigger.dev                                   |
| ✅     | **[GitHub: issue reminder](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/gitHubIssueReminder.ts)**                                              | Sends a Slack message to a channel if a GitHub issue is left open for 24 hours.                       | [GitHub](https://trigger.dev/docs/integrations/apis/github), [Slack](https:/trigger.dev/docs/integrations/apis/slack)                                                               | Trigger.dev                                   |
| ✅     | **[GitHub: new issue opened](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/gitHubNewIssueOpened.ts)**                                           | Runs when a new issue is opened on a repo. Once created, it will add a 'Bug' label to the issue.      | [GitHub](https://trigger.dev/docs/integrations/apis/github)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Linear: create issue on new PR](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/linearCreateIssueOnPR.ts)**                                    | Creates a new Linear issue when a pull request is opened on a GitHub repo.                            | [Linear](https://trigger.dev/docs/integrations/apis/linear), [GitHub](https://trigger.dev/docs/integrations/apis/github)                                                            | Trigger.dev                                   |
| ✅     | **[Linear: daily summary of issues on Slack](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/linearIssuesDailySlackAlert.ts)**                    | Post 'In Progress' Linear issues to a Slack channel every weekday at 9am.                             | [Linear](https://trigger.dev/docs/integrations/apis/linear), [Slack](https://trigger.dev/docs/integrations/apis/slack)                                                              | Trigger.dev                                   |
| ✅     | **[Linear: automatically reply to new issues](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/linearNewIssueReply.ts)**                           | Automatically comments and likes any new Linear issue.                                                | [Linear](https://trigger.dev/docs/integrations/apis/linear)                                                                                                                         | [nicktrn](https://github.com/nicktrn)         |
| ✅     | **[OpenAI: generate image](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/openAIGenerateImage.ts)**                                              | Generate an image from a prompt, using OpenAI.                                                        | [OpenAI](https://trigger.dev/docs/integrations/apis/openai)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[OpenAI: tell me a joke](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/openAITellMeAJoke.ts)**                                                | Generate a joke from a prompt, using OpenAI.                                                          | [OpenAI](https://trigger.dev/docs/integrations/apis/openai)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Plain: update custom](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/plainUpdateCustomer.ts)**                                                | Updates a customer's details.                                                                         | [Plain](https://trigger.dev/docs/integrations/apis/plain)                                                                                                                           | Trigger.dev                                   |
| ✅     | **[Resend: send React email](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/resendSendReactEmail.tsx)**                                          | Sends a basic email with Resend, built using React & Typescript.                                      | [Resend](https://trigger.dev/docs/integrations/apis/resend)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Resend: drip campaign](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/resendDripCampaign.tsx)**                                               | Sends an email drip campaign over 30 days with Resend, emails built using React & Typescript.         | [Resend](https://trigger.dev/docs/integrations/apis/resend)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Resend: send basic email](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/resendSendBasicEmail.ts)**                                           | Sends a basic email using Resend.                                                                     | [Resend](https://trigger.dev/docs/integrations/apis/resend)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Scheduled interval basic](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/scheduledIntervalBasic.ts)**                                         | Runs every 60 seconds, starting 60 seconds after this Job is first indexed.                           | None                                                                                                                                                                                | Trigger.dev                                   |
| ✅     | **[SendGrid: send basic email](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/sendGridSendBasicEmail.ts)**                                       | Sends a basic email using SendGrid.                                                                   | [SendGrid](https://trigger.dev/docs/integrations/apis/sendgrid)                                                                                                                     | [OshriAsulin](https://github.com/OshriAsulin) |
| ✅     | **[Slack: post message](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/slackPostMessage.ts)**                                                    | Posts a message to a Slack channel.                                                                   | [Slack](https://trigger.dev/docs/integrations/apis/slack)                                                                                                                           | Trigger.dev                                   |
| ✅     | **[Stripe: on subscription created](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/stripeOnSubscriptionCreated.ts)**                             | Runs when a new subscription is created in Stripe.                                                    | [Stripe](https://trigger.dev/docs/integrations/apis/stripe)                                                                                                                         | Trigger.dev                                   |
| ✅     | **[Stripe: on new subscription update Airtable](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/stripeNewSubscriptionUpdateAirtable.ts)**         | When a new customer creates a Stripe subscription, an Airtable table is populated with their details. | [Stripe](https://trigger.dev/docs/integrations/apis/stripe) [Airtable](https://trigger.dev/docs/integrations/apis/airtable)                                                         | Trigger.dev                                   |
| ✅     | **[Supabase: update database when a Stripe account is updated](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/supabaseStripeUpdateDatabase.ts)** | Update a Supabase table when a Stripe account is updated.                                             | [Supabase](https://trigger.dev/docs/integrations/apis/supabase), [Stripe](https://trigger.dev/docs/integrations/apis/stripe)                                                        | [gjohnsx](https://github.com/gjohnsx/gjohnsx) |
| ✅     | **[Summarize yesterdays GitHub commits on Slack](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/summarizeGitHubCommits.ts)**                     | Summarize yesterdays GitHub commits using OpenAI, then and post them to a Slack channel.              | [GitHub](https://trigger.dev/docs/integrations/apis/github), [OpenAI](https://trigger.dev/docs/integrations/apis/openai), [Slack](https://trigger.dev/docs/integrations/apis/slack) | [gjohnsx](https://github.com/gjohnsx/gjohnsx) |
| ✅     | **[Sync Stripe with Airtable](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/syncStripeWithAirtable.ts)**                                        | Update an Airtable table every time a sale is made in Stripe.                                         | [Airtable](https://trigger.dev/docs/integrations/apis/airtable), [Stripe](https://trigger.dev/docs/integrations/apis/stripe)                                                        | [gjohnsx](https://github.com/gjohnsx/gjohnsx) |
| ✅     | **[Weekly user activity summary](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/weeklyUserActivitySummary.ts)**                                  | Sends a weekly summary email to users and then posts the total numbers to Slack.                      | [SendGrid](https://trigger.dev/docs/integrations/apis/sendgrid), [Slack](https://trigger.dev/docs/integrations/apis/slack)                                                          | Trigger.dev                                   |

---

## Setup: how to use this repo

You will need to create a `.env` file. You can duplicate the contents of `.env.example` file and set your local (Dev 'server') `TRIGGER_API_KEY` value. You can find your API key in your project's integrations page [in the app](https://cloud.trigger.dev). Add other API keys as needed.

### Install packages

First, install the packages:

```sh
npm i
```

### Running a job

Each file in `src` is either a Job or a separate set of jobs that can be run separately. For example, the `src/cronScheduledBasic.ts` file can be run with:

```sh
npm run cronscheduledbasic
```

This will open up a local server using `express` on port 8080. Then in a <u>separate terminal window</u> you can run the `@trigger.dev/cli dev` command:

```sh
npm run dev:trigger
```

### Contributors guide

You can add a new file to `src` with it's own `TriggerClient` and set of jobs (e.g. `src/events.ts`)

```ts
import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { createExpressServer } from "@trigger.dev/express";
import { z } from "zod";

export const client = new TriggerClient({ id: "jobs-showcase" });

client.defineJob({
  id: "example-job-1",
  name: "Example Job 1",
  version: "0.1.0",
  trigger: eventTrigger({
    name: "example.one",
  }),
  run: async (payload, io, ctx) => {},
});

createExpressServer(client);
```

Then add a new script in [`package.json`](./package.json):

```json
{
  "scripts": {
    "events": "nodemon --watch src/events.ts -r tsconfig-paths/register -r dotenv/config src/events.ts"
  }
}
```
