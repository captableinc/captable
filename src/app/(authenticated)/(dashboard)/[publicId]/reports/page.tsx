"use server";
import { Card, DonutChart, Title } from "@tremor/react";

const ReportsPage = () => {
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
      <Card className="mx-auto max-w-xs">
        <Title>Sales</Title>
        <DonutChart
          className="mt-6"
          data={cities}
          category="sales"
          index="name"
          // valueFormatter={valueFormatter}
          colors={[
            "blue-900",
            "blue-800",
            "blue-700",
            "blue-600",
            "blue-500",
            "blue-400",
          ]}
        />
      </Card>
    </>
  );
};

export default ReportsPage;
