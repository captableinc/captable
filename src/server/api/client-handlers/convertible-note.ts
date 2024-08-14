import { type APIClientParams, createClient } from "../api-client";
import type { create } from "../routes/convertible-note/create";

type CreateRoute = typeof create.route;

export const createConvertibleNote = (params: TCreateConvertibleNoteParams) => {
  return createClient<CreateRoute>(
    "post",
    "/v1/{companyId}/convertible-notes",
    params,
  );
};

export type TCreateConvertibleNoteParams = APIClientParams<CreateRoute>;
export type TCreateConvertibleNoteRes = Awaited<
  ReturnType<typeof createConvertibleNote>
>;
