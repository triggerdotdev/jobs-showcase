import { TriggerClient } from "@trigger.dev/sdk";
import { Airtable } from "@trigger.dev/airtable";
import { Typeform } from "@trigger.dev/typeform";

// hide-code
const client = new TriggerClient({ id: "jobs-showcase" });
// end-hide-code

const typeform = new Typeform({
  id: "typeform",
  token: process.env.TYPEFORM_TOKEN!,
});

const airtable = new Airtable({
  id: "airtable",
  token: process.env.AIRTABLE_TOKEN!,
});

//this is the type definition for the table
type Submission = {
  id: string;
  name: string;
  email: string;
  emailContactEnabled: boolean;
};

// This job populates an Airtable table when a new submission is created in Typeform
client.defineJob({
  id: "typeform-new-submission-update-airtable",
  name: "On new Typeform submission update Airtable",
  version: "1.0.0",
  integrations: {
    typeform,
    airtable,
  },
  trigger: typeform.onFormResponse({
    // to get uid & tag instructions can be found here:
    // https://trigger.dev/docs/integrations/apis/typeform#get-notified-of-new-form-responses
    uid: "<your-form-id>",
    tag: "<your-tag>",
  }),
  run: async (payload, io, ctx) => {
    // You can get your base-id and table-name from airtable
    const table = io.airtable
      .base("<your-base-id>")
      .table<Submission>("<your-table-name>");

    if (payload.form_response.answers[0].type !== "text") {
      throw new Error("The first answer is not a name");
    }
    const name = payload.form_response.answers[0].text;

    if (payload.form_response.answers[1].type !== "email") {
      throw new Error("The second answer is not an email");
    }
    const email = payload.form_response.answers[1].email;

    if (payload.form_response.answers[2].type !== "choice") {
      throw new Error("The third answer is not a choice");
    }
    const emailContactEnabled =
      payload.form_response.answers[2].choice.label === "Yes";

    //create a new record
    const newRecords = await table.createRecords("create records", [
      {
        fields: {
          id: payload.event_id,
          name,
          email,
          emailContactEnabled,
        },
      },
    ]);

    await io.logger.info("A new form submission was created.", {
      payload,
      newRecords,
    });
  },
});

// hide-code
// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
// end-hide-code
