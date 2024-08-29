import { type APIClientParams, createClient } from "../api-client";

import type { getMany } from "../routes/stakeholder/getMany";

type GetManyRoute = typeof getMany.route;

export const getManyStakeholder = (params: TGetManyStakeholderParams) => {
  return createClient<GetManyRoute>(
    "get",
    "/v1/{companyId}/stakeholders",
    params,
  );
};

export type TGetManyStakeholderParams = APIClientParams<GetManyRoute>;
export type TGetManyStakeholderRes = Awaited<
  ReturnType<typeof getManyStakeholder>
>;
