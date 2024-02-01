"use client";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { useState } from "react";
import { DonutChart } from "@tremor/react";
import DonutSelector from "./donut-selector";

const DonutChartExample = () => {
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

  const [selected, setSelected] = useState("stakeholder");

  return (
    <Card className="h-[365px]">
      <CardHeader>
        <CardDescription>
          <>
            <div className="flex">
              <span>Ownership by</span>
              <DonutSelector selected={selected} onChange={setSelected} />
            </div>
          </>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <DonutChart
          className="h-56 p-5"
          data={cities}
          category="sales"
          index="name"
          colors={[
            "teal-600",
            "teal-500",
            "teal-400",
            "teal-300",
            "teal-200",
            "teal-100",
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default DonutChartExample;
