import { SupabaseManagement, Supabase } from "@trigger.dev/supabase";
import { OpenAI } from "@trigger.dev/openai";
import { TriggerClient } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const openai = new OpenAI({
  id: "open-ai",
  apiKey: process.env.OPENAI_API_KEY!,
});

// Use Supabase integration to run authenticated tasks using the service_role key
const supabase = new Supabase({
  id: "supabase",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  supabaseUrl: "https://<project id>.supabase.co",
});

const supabaseManagement = new SupabaseManagement({
  id: "supabase-management",
});

// Pass the generated types to the db instance
const db = supabase.db<Database>("https://<project id>.supabase.co");

client.defineJob({
  id: "ai-all-the-things",
  name: "AI all the images",
  version: "1.0.0",
  // Subscribe to objects being inserted
  trigger: db.onInserted({
    schema: "storage",
    table: "objects",
    filter: {
      record: {
        bucket_id: ["uploads"],
        name: [
          {
            $endsWith: ".png",
          },
        ],
      },
    },
  }),
  // Define the integrations that this Job will use
  integrations: {
    supabase,
    openai,
  },
  run: async (payload, io, ctx) => {
    // Assuming the bucket is private, we create a signed url for temporary access
    // Use the native supabase client to get a signed url
    const { error, data } = await io.supabase.client.storage
      .from("example_bucket")
      .createSignedUrl(payload.record.name, 60);

    if (error) {
      throw error;
    }

    const imageVariation = await io.openai.createImageVariation(
      "variation-image",
      {
        image: data.signedUrl,
        n: 2,
        response_format: "url",
        size: "512x512",
      }
    );

    // do something with the imageVariation response
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
import { Database } from "./mocks/supabase-types";
createExpressServer(client);
// end-hide-code
