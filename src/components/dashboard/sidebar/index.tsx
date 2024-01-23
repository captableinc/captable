"use client";

import {
  RiHome4Line,
  RiPieChartLine,
  RiSafeLine,
  RiUserHeartLine,
  RiUserSettingsLine,
  RiFolder5Line,
  RiFolderChartLine,
  RiFileList2Line,
  RiEqualizer2Line,
  RiListOrdered2,
  RiFolderShield2Line,
} from "@remixicon/react";

import { usePathname } from "next/navigation";
import { OpenCapLogo } from "@/components/shared/logo";

import { NavLink } from "./nav-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { type TGetCompanyList } from "@/server/company";
import { CompanySwitcher } from "./company-switcher";

const navigation = [
  { name: "Home", href: "", icon: RiHome4Line },
  { name: "Team", href: "/team", icon: RiUserHeartLine },
  { name: "SAFEs", href: "/safe", icon: RiSafeLine },
  { name: "Cap table", href: "/captable", icon: RiPieChartLine },
  {
    name: "Securities",
    href: "/securities",
    icon: RiFolderShield2Line,
  },
  {
    name: "Stakeholders",
    href: "/stakeholders",
    icon: RiUserSettingsLine,
  },
  { name: "Documents", href: "/documents", icon: RiFolder5Line },
  { name: "Reports", href: "/reports", icon: RiFolderChartLine },
  { name: "Audits", href: "/audits", icon: RiListOrdered2 },
];

const forms = [
  {
    id: 1,
    name: "409A Valuation",
    href: "/dashboard/409a",
    icon: RiFileList2Line,
  },
  { id: 2, name: "Form 3921", href: "/dashboard/3921", icon: RiFileList2Line },
];

interface SideBarProps {
  className?: string;
  publicId: string;
  companies: TGetCompanyList;
}

export function SideBar({ className, publicId, companies }: SideBarProps) {
  const currentPath = usePathname();

  const basePath = `/${publicId}`;

  return (
    <ScrollArea className="h-screen px-3">
      <div className={cn("pb-12", className)}>
        <div className="gap-y-4 py-4">
          <div className="flex items-center px-2 py-2 ">
            <OpenCapLogo className="h-7 w-auto" />

            <CompanySwitcher companies={companies} publicId={publicId} />
          </div>

          <div className="overflow-auto py-2">
            <ul role="list" className=" space-y-1">
              {navigation.map((item) => {
                const href = basePath + item.href;
                const isActive = currentPath === href;
                return (
                  <li key={item.name}>
                    <NavLink
                      active={isActive}
                      name={item.name}
                      href={href}
                      icon={item.icon}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="py-2">
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Legal
              </div>
              <ul role="list" className=" space-y-1">
                {forms.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      active={currentPath === item.href}
                      name={item.name}
                      href={item.href}
                      icon={item.icon}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <NavLink
              active={currentPath === "/dashboard/settings"}
              name="Settings"
              href="/dashboard/settings"
              icon={RiEqualizer2Line}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
