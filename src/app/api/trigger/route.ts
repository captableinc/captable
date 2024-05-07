import { client } from "@/trigger";
import { createAppRoute } from "@trigger.dev/nextjs";

import "@/jobs/auth-verification-email";
import "@/jobs/data-room-share-email";
import "@/jobs/esign-confirmation-email";
import "@/jobs/esign-email";
import "@/jobs/esign-pdf";
import "@/jobs/member-inivite-email";
import "@/jobs/password-reset-email";

//this route is used to send and receive data with Trigger.dev
export const { POST, dynamic } = createAppRoute(client);

//uncomment this to set a higher max duration (it must be inside your plan limits). Full docs: https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration
//export const maxDuration = 60;
