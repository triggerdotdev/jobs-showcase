# Jobs Showcase

This repo contains a set of jobs that can be run locally using the `@trigger.dev/cli` and `@trigger.dev/express` packages. The jobs included in this repo are.

| Status | Title                                                                                                                                                        | Description                                                                                                               | Integrations                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ✅     | **[Cron scheduled basic](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/cronScheduledBasic.ts)**                                               | A scheduled Job which runs at 2:30pm every Monday.                                                                        | None                                                                                                                         |
| ✅     | **[Delay example joke](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/delayExampleJoke.ts)**                                                   | Logs a message to the console, waits for 5 minutes, and then logs another message.                                        | None                                                                                                                         |
| ✅     | **[GitHub: issue reminder](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/gitHubIssueReminder.ts)**                                            | Sends a Slack message to a channel if a GitHub issue is left open for 24 hours.                                           | [GitHub](https://trigger.dev/docs/integrations/apis/github), [Slack](https:/trigger.dev/docs/integrations/apis/slack)        |
| ✅     | **[GitHub: new issue opened](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/gitHubNewIssueOpened.ts)**                                         | Runs when a new issue is opened on a repo you have admin rights to, once created, it will add a 'Bug' label to the issue. | [GitHub](https://trigger.dev/docs/integrations/apis/github)                                                                  |
| ✅     | **[OpenAI: generate image](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/openAIGenerateImage.ts)**                                            | Generate an image from a prompt, using OpenAI.                                                                            | [OpenAI](https://trigger.dev/docs/integrations/apis/openai)                                                                  |
| ✅     | **[OpenAI: tell me a joke](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/openAITellMeAJoke.ts)**                                              | Generate a joke from a prompt, using OpenAI.                                                                              | [OpenAI](https://trigger.dev/docs/integrations/apis/openai)                                                                  |
| ✅     | **[Resend: send basic email](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/resendSendBasicEmail.ts)**                                         | Sends a basic email using Resend.                                                                                         | [Resend](https://trigger.dev/docs/integrations/apis/resend)                                                                  |
| ✅     | **[Scheduled interval basic](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/scheduledIntervalBasic.ts)**                                       | Runs every 60 seconds, starting 60 seconds after this Job is first indexed.                                               | None                                                                                                                         |
| ✅     | **[SendGrid: send basic email](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/sendGridSendBasicEmail.ts)**                                     | Sends a basic email using SendGrid.                                                                                       | [SendGrid](https://trigger.dev/docs/integrations/apis/sendgrid)                                                              |
| ✅     | **[Slack: post message](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/slackPostMessage.ts)**                                                  | Posts a message to a Slack channel.                                                                                       | [Slack](https://trigger.dev/docs/integrations/apis/slack)                                                                    |
| ✅     | **[Supabase: update database when Stripe account is updated](https://github.com/triggerdotdev/jobs-showcase/blob/main/src/supabaseStripeUpdateDatabase.ts)** | Update a Supabase table when a Stripe account is updated                                                                  | [Supabase](https://trigger.dev/docs/integrations/apis/supabase), [Stripe](https://trigger.dev/docs/integrations/apis/stripe) |

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

export const client = new TriggerClient({ id: "job-catalog" });

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
