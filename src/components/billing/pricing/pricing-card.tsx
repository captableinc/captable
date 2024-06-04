import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  interval: string;
}

export function PricingCard({
  description,
  title,
  interval,
  price,
}: PricingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">${price}</h3>
          <span className="flex flex-col justify-end text-sm mb-1">
            /{interval}
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Subscribe</Button>
      </CardFooter>
    </Card>
  );
}
