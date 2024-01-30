"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  amount: number;
  prefix?: string;
  format?: boolean;
};

const OverviewCard = ({ title, amount, prefix, format = true }: Props) => {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    minimumIntegerDigits: 1,
    minimumFractionDigits: 2,
  });

  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>
          {prefix && <span>{`${prefix} `}</span>}
          {format ? formatter.format(amount) : amount}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default OverviewCard;
