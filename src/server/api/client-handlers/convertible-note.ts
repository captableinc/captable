import { type APIClientParams, createClient } from "../api-client";
import type { create } from "../routes/convertible-note/create";
import type { deleteOne } from "../routes/convertible-note/delete";
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

type DeleteOneRoute = typeof deleteOne.route;

export const deleteOneConvertibleNote = (
  params: TDeleteOneConvertibleNoteParams,
) => {
  return createClient<DeleteOneRoute>(
    "delete",
    "/v1/{companyId}/convertible-notes/{id}",
    params,
  );
};

export type TDeleteOneConvertibleNoteParams = APIClientParams<DeleteOneRoute>;
export type TDeleteOneConvertibleNoteRes = Awaited<
  ReturnType<typeof deleteOneConvertibleNote>
>;
