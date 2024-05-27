"use server";

import { api } from "@/trpc/server";
import { InvestorDetailsForm } from "./form";

export async function InvestorDetails() {
  const stakeholders = await api.stakeholder.getStakeholders.query();
  return <InvestorDetailsForm stakeholders={stakeholders} />;
}
