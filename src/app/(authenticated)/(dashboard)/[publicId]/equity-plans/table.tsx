import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Message from "@/components/common/message";
import { Card } from "@/components/ui/card";
import type { EquityPlanMutationType } from "@/trpc/routers/equity-plan/schema";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import { RiEqualizer2Line } from "@remixicon/react";
import EquityPlanModal from "./modal";
const formatter = new Intl.NumberFormat("en-US");

type EquityPlanTableProps = {
  equityPlans: EquityPlanMutationType[];
  shareClasses: ShareClassMutationType[];
};

const getCancelationBehavior = (behavior: string) => {
  switch (behavior) {
    case "RETIRE":
      return "Retire";
    case "RETURN_TO_POOL":
      return "Return to pool";
    case "HOLD_AS_CAPITAL_STOCK":
      return "Hold as capital stock";
    case "DEFINED_PER_PLAN_SECURITY":
      return "Defined per plan security";
    default:
      return "None";
  }
};

const EquityPlanTable = ({
  equityPlans,
  shareClasses,
}: EquityPlanTableProps) => {
  return (
    <Card>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Reserved shares</TableHead>
            <TableHead>Cancellation behavior</TableHead>
            <TableHead>Board approval date</TableHead>
            <TableHead>Plan effective date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {equityPlans.map((plan) => (
            <TableRow key={plan.id} className="border-none">
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>
                {formatter.format(plan.initialSharesReserved)}
              </TableCell>
              <TableCell>
                {getCancelationBehavior(plan.defaultCancellatonBehavior)}
              </TableCell>
              <TableCell>{`${new Date(
                plan.boardApprovalDate,
              ).toLocaleDateString("en-US")}`}</TableCell>
              <TableCell>
                {plan.planEffectiveDate
                  ? `${new Date(plan.planEffectiveDate).toLocaleDateString(
                      "en-US",
                    )}`
                  : ""}
              </TableCell>

              <TableCell>
                <EquityPlanModal
                  type="update"
                  title="Update an equity plan"
                  equityPlan={plan}
                  shareClasses={shareClasses}
                  subtitle={
                    <Tldr
                      description="Equity plans are used to distribute ownership of your company using stock options, RSUs, and other instruments among employees and stakeholders."
                      cta={{
                        label: "Learn more",
                        // TODO - this link should be updated to the correct URL
                        href: "https://captable.inc/help",
                      }}
                    />
                  }
                  trigger={
                    <RiEqualizer2Line className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default EquityPlanTable;
