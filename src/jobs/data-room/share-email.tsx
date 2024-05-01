// import { DataRoomShareEMail } from "@/emails/DataRoomShareEMail";
// import { db } from "@/server/db";
// import { sendMail } from "@/server/mailer";
// import { render } from "jsx-email";
import { client } from "@/trigger";
import { invokeTrigger } from "@trigger.dev/sdk";

export const investorUpdateEmailJob = client.defineJob({
  id: "dataRoom/shareemail",
  name: "Data room share email",
  version: "0.0.1",
  trigger: invokeTrigger(),
  run: async (payload, io) => {
    // perform the job
  },
});
