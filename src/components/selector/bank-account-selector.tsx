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

type BankAccountSelectorType = {
  onSelect: (bankAccountId: string) => void;
};

export function BankAccountSelector({ onSelect }: BankAccountSelectorType) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );

  const {
    data: bankAccounts,
    isLoading,
    refetch,
  } = api.bankAccounts.getAll.useQuery();

  useEffect(() => {
    if (bankAccounts) {
      setOptions(
        bankAccounts.map((account) => ({
          value: account.id,
          label: `${account.bankName} - ${account.accountNumber}`,
        })),
      );
    }
  }, [bankAccounts]);

  return (
    <LinearCombobox
      placeholder="Select or add a bank account"
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
              <div>
                {isLoading ? "Loading bank accounts" : "Reload bank accounts"}
              </div>
            </div>
          </button>
        )}

        <button
          type="button"
          className="cursor-pointer w-full text-left hover:underline"
          disabled={isLoading}
          onClick={() => {
            pushModal("BankAccountModal", {
              size: "lg",
              title: "Add a bank account",
              subtitle: "Add a bank account to receive the investment.",
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
            <div>
              {isLoading ? "Loading bank accounts" : "Add a bank account"}
            </div>
          </div>
        </button>
      </div>
    </LinearCombobox>
  );
}
