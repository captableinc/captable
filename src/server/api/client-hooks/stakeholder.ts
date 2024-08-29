"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type TGetManyStakeholderParams,
  getManyStakeholder,
} from "../client-handlers/stakeholder";

export const useManyStakeholder = (data: TGetManyStakeholderParams) =>
  useQuery({
    queryKey: [
      "all-stakeholder",
      data.urlParams.companyId,
      String(data.searchParams.limit),
      String(data.searchParams.page),
      String(data.searchParams.sort),
    ],
    queryFn: () => getManyStakeholder(data),
  });
