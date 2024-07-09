"use client";

import { LinearCombobox } from "@/components/ui/combobox";
import { api } from "@/trpc/react";
import {
  RiLoader5Line as LoadingIcon,
  RiAddCircleLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";

export function StakeholderSelector() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const { data: stakeholders, isLoading } =
    api.stakeholder.getStakeholders.useQuery();

  useEffect(() => {
    if (stakeholders) {
      setOptions(
        stakeholders.map((sh) => ({
          value: sh.id,
          label: sh.institutionName
            ? `${sh.institutionName} - ${sh.name}`
            : sh.name,
        })),
      );
    }
  }, [stakeholders]);

  return (
    <LinearCombobox
      placeholder="Select a stakeholder"
      options={options}
      onValueChange={(option) => {
        console.log(option, option.value);
      }}
    >
      <button
        type="button"
        className="cursor-pointer w-full text-left"
        disabled={isLoading}
        onClick={() => {
          alert("Push modal to add a stakeholder");
        }}
      >
        <div className="flex items-center my-1 gap-x-2">
          <span>
            {isLoading ? (
              <LoadingIcon className="h-4 w-4 animate-spin" />
            ) : (
              <RiAddCircleLine className="h-4 w-4" aria-hidden />
            )}
          </span>
          <div>{isLoading ? "Loading stakeholders" : "Add a stakeholder"}</div>
        </div>
      </button>
    </LinearCombobox>
  );
}
