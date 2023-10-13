import { TriggerClient } from "@trigger.dev/sdk";
import { Airtable } from "@trigger.dev/airtable";
import { Typeform } from "@trigger.dev/typeform";

const client = new TriggerClient({ id: "jobs-showcase" });

const typeform = new Typeform({
  id: "typeform",
  token: process.env.TYPEFORM_TOKEN!,
});

const airtable = new Airtable({
  id: "airtable",
  token: process.env.AIRTABLE_TOKEN!,
});

//this is the type definition for the table
type Submissions = {
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
    // to get uid & tag instructions can be found here: https://trigger.dev/docs/integrations/apis/typeform#get-notified-of-new-form-responses
    uid: '<your-form-id>',
    tag: '<your-tag>'
  }),
  run: async (payload, io, ctx) => {
    // You can get your base-id and table-name from airtable
    const table = io.airtable
      .base("<your-base-id>")
      .table<Submissions>("<your-table-name>");

    //create a new record
    const newRecords = await table.createRecords("create records", [
      {
        fields: {
          id: payload.event_id,
          // @ts-ignore
          name: payload.form_response.answers[0]?.text ?? '',
          // @ts-ignore
          email: payload.form_response.answers[1].email ?? '',
          // @ts-ignore
          emailContactEnabled: payload.form_response.answers[2].choice.label === "Yes" ? true : false
        },
      },
    ]);

    await io.logger.info("A new form submission was created.", { payload, newRecords });
  },
});

// These lines can be removed if you don't want to use express
import { createExpressServer } from "@trigger.dev/express";
createExpressServer(client);
