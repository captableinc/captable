import { type APIClientParams, createClient } from "../api-client";

import type { create } from "../routes/safe/create";

type CreateRoute = typeof create.route;

export const createSafe = (params: TCreateSafeParams) => {
  return createClient<CreateRoute>("post", "/v1/{companyId}/safes", params);
};

export type TCreateSafeParams = APIClientParams<CreateRoute>;
export type TCreateSafeRes = Awaited<ReturnType<typeof createSafe>>;
