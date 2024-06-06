import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PricingPlanInterval } from "@/prisma/enums";
import type { ComponentProps } from "react";

interface PricingCardProps extends Omit<ButtonProps, "children"> {
  title: string;
  description?: string | null;
  price: string;
  interval: PricingPlanInterval;
  subscribed: boolean;
}

const humanizedInterval: Record<PricingPlanInterval, string> = {
  day: "Daily",
  month: "Monthly",
  week: "Weekly",
  year: "Yearly",
};

export function PricingCard({
  description,
  title,
  interval,
  price,
  subscribed,
  ...rest
}: PricingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">{price}</h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            /{humanizedInterval[interval]}
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button {...rest}>{subscribed ? "Manage" : "Subscribe"}</Button>
      </CardFooter>
    </Card>
  );
}
