import { db } from "@/server/db";
import EquityPlanModal from "./modal";
import EquityPlanTable from "./table";
import { Card } from "@/components/ui/card";
import Tldr from "@/components/shared/tldr";
import { Button } from "@/components/ui/button";
import { withServerSession } from "@/server/auth";
import EmptyState from "@/components/shared/empty-state";
import { RiPieChart2Line, RiAddFill } from "@remixicon/react";
import { type EquityPlanMutationType } from "@/trpc/routers/equity-plan/schema";

const getEquityPlans = async (companyId: string) => {
  return await db.equityPlan.findMany({
    where: { companyId },
  });
};

const EquityPlanPage = async () => {
  const session = await withServerSession();
  const companyId = session?.user?.companyId;
  let equityPlans: EquityPlanMutationType[] = [];

  if (companyId) {
    equityPlans = (await getEquityPlans(
      companyId,
    )) as unknown as EquityPlanMutationType[];
  }

  if (equityPlans.length === 0) {
    return (
      <EmptyState
        icon={<RiPieChart2Line />}
        title="You do not have any equity plans!"
        subtitle="Please click the button below to create a new equity plan."
      >
        <EquityPlanModal
          type="create"
          title="Create an equity plan"
          subtitle={
            <Tldr
              message="Equity plans are used to distribute ownership of your company using stock options, RSUs, and other instruments among employees and stakeholders."
              cta={{
                label: "Learn more",
                // TODO - this link should be updated to the correct URL
                href: "https://opencap.co/help",
              }}
            />
          }
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Create an equity plan
            </Button>
          }
        />
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Equity plans</h3>
          <p className="text-sm text-muted-foreground">
            Manage the equity plans for your company
          </p>
        </div>

        <div>
          <EquityPlanModal
            type="create"
            title="Create an equity plan"
            subtitle={
              <Tldr
                message="Equity plans are used to distribute ownership of your company using stock options, RSUs, and other instruments among employees and stakeholders."
                cta={{
                  label: "Learn more",
                  // TODO - this link should be updated to the correct URL
                  href: "https://opencap.co/help",
                }}
              />
            }
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Create an equity plan
              </Button>
            }
          />
        </div>
      </div>

      <Card className="mt-3">
        <div className="p-6">
          <EquityPlanTable equityPlans={equityPlans} />
        </div>
      </Card>
    </div>
  );
};

export default EquityPlanPage;
