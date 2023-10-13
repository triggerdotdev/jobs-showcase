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

// This job populates an Airtable table when a new customer subscription is created in Stripe
client.defineJob({
  id: "typeform-new-submission-update-airtable",
  name: "On new Typeform submission update Airtable",
  version: "1.0.0",
  integrations: {
    typeform,
    airtable,
  },
  trigger: typeform.onFormResponse({
    uid: '<form id>',
    tag: '<tag>'
  }),
  run: async (payload, io, ctx) => {
    // Adding the type to table<YourTableType>("<your table name>")
    // gives you nice type inference and errors.
    // You can leave it out as well table("<your table name>")
    const table = io.airtable
      .base("<base id>")
      .table<Submissions>("<table name>");

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
