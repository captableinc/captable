import { dayjsExt } from "@/common/dayjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { badgeVariants } from "@/components/ui/badge";

import type { RouterOutputs } from "@/trpc/shared";

type TSubscription =
  RouterOutputs["billing"]["getSubscription"]["subscription"];

interface PlanDetailsProps {
  subscription: TSubscription;
}

export function PlanDetails({ subscription }: PlanDetailsProps) {
  return (
    <div>
      <Alert>
        <AlertTitle>Plan Details</AlertTitle>
        <AlertDescription>
          <p>
            You are currently on the{" "}
            <span className={badgeVariants()}>
              {subscription ? subscription.price.product.name : "Free"}
            </span>{" "}
            plan.{" "}
            {subscription ? (
              <>
                Current billing cycle:{" "}
                {dayjsExt(subscription?.currentPeriodStart).format("ll")} -{" "}
                {dayjsExt(subscription?.currentPeriodEnd).format("ll")}
              </>
            ) : null}
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
