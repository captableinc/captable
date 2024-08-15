import { type APIClientParams, createClient } from "../api-client";
import type { create } from "../routes/convertible-note/create";
import type { getMany } from "../routes/convertible-note/getMany";

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

type GetManyRoute = typeof getMany.route;

export const getManyConvertibleNote = (
  params: TGetManyConvertibleNoteParams,
) => {
  return createClient<GetManyRoute>(
    "get",
    "/v1/{companyId}/convertible-notes",
    params,
  );
};

export type TGetManyConvertibleNoteParams = APIClientParams<GetManyRoute>;
export type TGetManyConvertibleNoteRes = Awaited<
  ReturnType<typeof getManyConvertibleNote>
>;
