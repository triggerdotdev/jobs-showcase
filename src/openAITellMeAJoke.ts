import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { OpenAI } from "@trigger.dev/openai";
import { z } from "zod";

const client = new TriggerClient({ id: "jobs-showcase" });

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY!,
});

// This Job will use OpenAI GPT-3.5 Turbo to tell you a joke
client.defineJob({
  id: "openai-tell-me-a-joke",
  name: "OpenAI: tell me a joke",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "openai.tasks",
    schema: z.object({
      jokePrompt: z.string(),
    }),
  }),
  integrations: {
    openai,
  },
  run: async (payload, io, ctx) => {
    await io.openai.retrieveModel("get-model", {
      model: "gpt-3.5-turbo",
    });

    const jokeResult = await io.openai.backgroundCreateChatCompletion(
      "background-chat-completion",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: payload.jokePrompt,
          },
        ],
      }
    );

    return {
      joke: jokeResult.choices[0]?.message?.content,
    };
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
