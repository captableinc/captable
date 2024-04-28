import { createTRPCRouter } from "@/trpc/api/trpc";
import { createTemplateProcedure } from "./procedures/create-template";
import { getAllTemplateProcedure } from "./procedures/get-all-template";
import { getSigningFieldsProcedure } from "./procedures/get-signing-fields";
import { getTemplateProcedure } from "./procedures/get-template";
import { signTemplateProcedure } from "./procedures/sign-template";

export const templateRouter = createTRPCRouter({
  create: createTemplateProcedure,
  get: getTemplateProcedure,
  sign: signTemplateProcedure,
  getSigningFields: getSigningFieldsProcedure,
  all: getAllTemplateProcedure,
});
