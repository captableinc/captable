"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { type TGetCompanyList } from "@/server/company";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CompanySwitcherProps {
  companies: TGetCompanyList;
  publicId: string;
}

export function CompanySwitcher({ companies, publicId }: CompanySwitcherProps) {
  const value = useState(() => publicId)[0];
  const { update } = useSession();
  const router = useRouter();

  const switchCompany = api.company.switchCompany.useMutation();

  return (
    <Select
      value={value}
      onValueChange={async (newValue) => {
        if (newValue !== value) {
          const membership = companies.find(
            (item) => item.company.publicId === newValue,
          );

          if (membership) {
            await switchCompany.mutateAsync({ id: membership.id });
            await update();
            router.push(`/${newValue}`);
          }
        }
      }}
    >
      <SelectTrigger className="text-md ml-3 h-8 w-[180px] rounded border-none font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {companies.map((item) => (
          <SelectItem key={item.company.publicId} value={item.company.publicId}>
            {item.company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
