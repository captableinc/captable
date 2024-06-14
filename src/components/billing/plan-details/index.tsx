import { dayjsExt } from "@/common/dayjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { badgeVariants } from "@/components/ui/badge";
import { PricingModal, type PricingModalProps } from "../pricing-modal";

interface PlanDetailsProps extends PricingModalProps {}

export function PlanDetails({ subscription, products }: PlanDetailsProps) {
  return (
    <div>
      <Alert>
        <AlertTitle>Plan Details</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-y-3">
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

            <div className="flex items-center justify-center">
              <PricingModal subscription={subscription} products={products} />
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
