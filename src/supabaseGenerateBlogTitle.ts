import { SupabaseManagement, Supabase } from "@trigger.dev/supabase";
import { OpenAI } from "@trigger.dev/openai";
import { TriggerClient } from "@trigger.dev/sdk";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const supabaseManagement = new SupabaseManagement({
  id: "supabase-management",
});

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

// Pass the generated types to the db instance
const db = supabase.db<Database>("https://<project id>.supabase.co");

client.defineJob({
  id: "auto-generate-blog-title",
  name: "Auto generate blog title",
  version: "1.0.0",
  // Subscribe to new blog posts being created
  trigger: db.onInserted({
    table: "blog_posts",
  }),
  // Define the integrations that this Job will use
  integrations: {
    supabase,
    openai,
  },
  run: async (payload, io, ctx) => {
    const result = await io.openai.backgroundCreateChatCompletion(
      "create-blog-title",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Suggest some great titles for this blog post: \n ${payload.record.content}`,
          },
        ],
      }
    );

    const blogTitle = result.choices[0].message.content;

    if (blogTitle) {
      // Set the title for the blog post
      const { data, error } = await io.supabase.runTask(
        "update-blog-post",
        async (db) => {
          return db
            .from("blog_posts")
            .update({ title: blogTitle })
            .eq("id", payload.record.id)
            .select("*");
        }
      );
    }
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
import { Database } from "./mocks/supabase-types";
createExpressServer(client);
// end-hide-code
