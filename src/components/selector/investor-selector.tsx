"use client";

import { pushModal } from "@/components/modals";
import { LinearCombobox } from "@/components/ui/combobox";
import { api } from "@/trpc/react";
import {
  RiLoader5Line as LoadingIcon,
  RiAddLine,
  RiRefreshLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";

type StakeholderSelectorType = {
  onSelect: (stakeholder: string) => void;
};

export function InvestorSelector({ onSelect }: StakeholderSelectorType) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );

  const {
    data: stakeholders,
    isLoading,
    refetch,
  } = api.stakeholder.getStakeholders.useQuery({
    investor: true,
  });

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
      placeholder="Select or add an investor"
      options={options}
      onValueChange={(option) => {
        onSelect(option.value);
      }}
    >
      <div>
        {!isLoading && (
          <button
            type="button"
            className="cursor-pointer w-full text-left hover:underline"
            disabled={isLoading}
            onClick={() => {
              refetch();
            }}
          >
            <div className="flex items-center my-1 gap-x-2">
              <span>
                {isLoading ? (
                  <LoadingIcon className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <RiRefreshLine className="h-4 w-4" aria-hidden />
                )}
              </span>
              <div>{isLoading ? "Loading investors" : "Reload investors"}</div>
            </div>
          </button>
        )}

        <button
          type="button"
          className="cursor-pointer w-full text-left hover:underline"
          disabled={isLoading}
          onClick={() => {
            pushModal("InvestorModal", {
              size: "lg",
              title: "Add an investor",
              subtitle: "Add an investor to your cap table.",
            });
          }}
        >
          <div className="flex items-center my-1 gap-x-2">
            <span>
              {isLoading ? (
                <LoadingIcon className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <RiAddLine className="h-4 w-4" aria-hidden />
              )}
            </span>
            <div>{isLoading ? "Loading investors" : "Add an investor"}</div>
          </div>
        </button>
      </div>
    </LinearCombobox>
  );
}
