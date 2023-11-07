import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const replicate = new Replicate({
  id: "replicate",
  apiKey: process.env.REPLICATE_API_KEY!,
});

client.defineJob({
  id: "replicate-cinematic-prompt",
  name: "Replicate - Cinematic Prompt",
  version: "0.1.0",
  integrations: { replicate },
  trigger: eventTrigger({
    name: "replicate.cinematic",
    schema: z.object({
      prompt: z
        .string()
        .default("rick astley riding a harley through post-apocalyptic miami"),
      version: z
        .string()
        .default(
          "af1a68a271597604546c09c64aabcd7782c114a63539a4a8d14d1eeda5630c33"
        ),
    }),
  }),
  run: async (payload, io, ctx) => {
    //wait for prediction completion (uses remote callbacks internally)
    const prediction = await io.replicate.predictions.createAndAwait(
      "await-prediction",
      {
        version: payload.version,
        input: {
          prompt: `${payload.prompt}, cinematic, 70mm, anamorphic, bokeh`,
          width: 1280,
          height: 720,
        },
      }
    );
    return prediction.output;
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
import { Replicate } from "@trigger.dev/replicate";
import z from "zod";
createExpressServer(client);
// end-hide-code
