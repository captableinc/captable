"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectSeparator,
  SelectItemStyle,
} from "@/components/ui/select";

import { type TGetCompanyList } from "@/server/company";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { RiAddCircleLine } from "@remixicon/react";

interface CompanySwitcherProps {
  companies: TGetCompanyList;
  publicId: string;
}

const createCompanyValue = "cap-co-create-company";

export function CompanySwitcher({ companies, publicId }: CompanySwitcherProps) {
  const value = useState(() => publicId)[0];
  const { update } = useSession();
  const router = useRouter();

  const switchCompany = api.company.switchCompany.useMutation();
  const segment = useSelectedLayoutSegment();

  return (
    <Select
      value={value}
      onValueChange={async (newValue) => {
        if (newValue === createCompanyValue) {
          router.push("/company/new");
        }

        if (newValue !== value) {
          const membership = companies.find(
            (item) => item.company.publicId === newValue,
          );

          if (membership) {
            await switchCompany.mutateAsync({ id: membership.id });
            await update();
            router.push(`/${newValue}${segment ? "/" + segment : ""}`);
          }
        }
      }}
    >
      <SelectTrigger className="text-md ml-3 h-8 w-[180px] rounded border-none bg-transparent font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {companies.map((item) => (
          <SelectItem key={item.company.publicId} value={item.company.publicId}>
            {item.company.name}
          </SelectItem>
        ))}

        <SelectSeparator />
        <SelectPrimitive.Item
          value={createCompanyValue}
          className={SelectItemStyle}
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <RiAddCircleLine className="h-4 w-4" aria-hidden />
          </span>

          <SelectPrimitive.ItemText>Create Company</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
      </SelectContent>
    </Select>
  );
}
