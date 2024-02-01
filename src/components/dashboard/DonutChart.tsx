"use client";
import { DonutChart } from "@tremor/react";

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

  // const valueFormatter = (number) => `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  return (
    <>
      <DonutChart
        className="mt-6 h-[500px]"
        data={cities}
        category="sales"
        index="name"
        // valueFormatter={valueFormatter}
        colors={[
          "teal-600",
          "teal-500",
          "teal-400",
          "teal-300",
          "teal-200",
          "teal-100",
        ]}
      />
    </>
  );
};

export default DonutChartExample;
