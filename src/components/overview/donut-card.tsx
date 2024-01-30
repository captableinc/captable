import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Pie } from "@ant-design/plots";
import React from "react";

type Props = {
  title: string | React.ReactNode;
  data: { key: string; value: number }[];
};

const DonutCard = ({ title, data }: Props) => {
  const config = {
    data,
    appendPadding: 10,
    angleField: "value",
    colorField: "key",
    radius: 1,
    innerRadius: 0.6,
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>

      <CardContent className="-p-5 h-72">
        <Pie {...config} />
      </CardContent>
    </Card>
  );
};

export default DonutCard;
