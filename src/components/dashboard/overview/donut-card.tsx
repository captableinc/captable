"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { DonutChart } from "@tremor/react";
import { Fragment, useEffect, useState } from "react";
import DonutSelector from "./donut-selector";

type DonutTooltipProps = {
  name: string;
  value: number;
};

type OwnershipSlice = {
  key: string;
  value: number;
};

type DonutCardProps = {
  stakeholders: OwnershipSlice[];
  shareClasses: OwnershipSlice[];
};

const DonutCard = ({ stakeholders, shareClasses }: DonutCardProps) => {
  const [isClient, setIsClient] = useState(false);
  const [selected, setSelected] = useState("stakeholder");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = selected === "stakeholder" ? stakeholders : shareClasses;

  return (
    <Fragment>
      {isClient && (
        <Card className="h-[365px]">
          <CardHeader>
            <div className="text-sm text-gray-700">
              <div className="flex">
                <span>Ownership by</span>
                <DonutSelector selected={selected} onChange={setSelected} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {data.length === 0 ? (
              <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
                No ownership data to show yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <ScrollArea className="h-60 w-full py-4 pr-8">
                  <ul className="space-y-3 text-sm">
                    {data.map((slice) => (
                      <li key={slice.key} className="flex justify-between">
                        <span className="font-medium">{slice.key}</span>
                        <span>{slice.value}%</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>

                <DonutChart
                  className="h-60 py-4"
                  data={data}
                  category="value"
                  index="key"
                  showLabel={false}
                  showAnimation={true}
                  customTooltip={({ payload }) => {
                    if (Array.isArray(payload) && payload.length > 0) {
                      const data = payload[0] as DonutTooltipProps;

                      return (
                        <div className="rounded bg-white p-2 shadow-md">
                          <p className="text-xs text-primary/80">
                            <span className="font-semibold">{data.name}</span>:{" "}
                            {data.value}%
                          </p>
                        </div>
                      );
                    }

                    return null;
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
};

export default DonutCard;
