"use client";

import { SafePreview } from "@/components/safe/templates";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Fragment, useState } from "react";

const NewSafePage = () => {
  const [safeProps, setSafeProps] = useState({
    investor: { name: "_____", email: "" },
    investment: 0,
    valuation: 0,
    date: new Date().toISOString(),
    company: { name: "_____", state: "__" },
  });

  return (
    <Fragment>
      <h4>Create a new SAFE</h4>
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-4">
          <h1 className="text-2xl font-semibold">New SAFE</h1>

          <Input
            type="text"
            onChange={(e) =>
              setSafeProps({
                ...safeProps,
                investor: { ...safeProps.investor, name: e.target.value },
              })
            }
          />
        </Card>

        <div className="w-full col-span-8 ">
          <SafePreview
            investor={safeProps.investor}
            investment={safeProps.investment}
            valuation={safeProps.valuation}
            date={safeProps.date}
            company={safeProps.company}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default NewSafePage;
