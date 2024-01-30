"use client";

import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { DonutChart } from "@tremor/react";

type Props = {
  title: string;
};

const DonutCard = ({ title }: Props) => {
  const cities = [
    {
      name: "New York",
      sales: 9800,
    },
    {
      name: "London",
      sales: 4567,
    },
    {
      name: "Hong Kong",
      sales: 3908,
    },
    {
      name: "San Francisco",
      sales: 2400,
    },
    {
      name: "Singapore",
      sales: 1908,
    },
    {
      name: "Zurich",
      sales: 1398,
    },
  ];

  const valueFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-semibold text-primary">
          {title}
        </CardDescription>
      </CardHeader>

      <CardContent className="h-96">
        <DonutChart
          className="mt-6"
          data={cities}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
        />
      </CardContent>
    </Card>
  );
};

export default DonutCard;
