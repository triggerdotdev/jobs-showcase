import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { OpenAI } from "@trigger.dev/openai";
import { z } from "zod";

const client = new TriggerClient({ id: "jobs-showcase" });

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY!,
});

// This Job will generate an image from a prompt, using OpenAI's image API
client.defineJob({
  id: "openai-generate-image",
  name: "OpenAI: generate image from a prompt",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "openai.images",
    schema: z.object({}),
  }),
  integrations: {
    openai,
  },
  run: async (payload, io, ctx) => {
    const imageResults = await io.openai.createImage("image", {
      prompt: "A hedgehog wearing a party hat",
      n: 2,
      size: "256x256",
      response_format: "url",
    });

    return {
      images: imageResults.data?.map((image) => image.url),
    };
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
