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
import { OpenCapLogo } from "@/components/logo";

import { NavLink } from "./nav-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navigation = [
  { name: "Home", href: "/dashboard", icon: RiHome4Line },
  { name: "Team", href: "/dashboard/team", icon: RiUserHeartLine },
  { name: "SAFEs", href: "/dashboard/safe", icon: RiSafeLine },
  { name: "Cap table", href: "/dashboard/captable", icon: RiPieChartLine },
  {
    name: "Securities",
    href: "/dashboard/securities",
    icon: RiFolderShield2Line,
  },
  {
    name: "Stakeholders",
    href: "/dashboard/stakeholders",
    icon: RiUserSettingsLine,
  },
  { name: "Documents", href: "/dashboard/documents", icon: RiFolder5Line },
  { name: "Reports", href: "/dashboard/reports", icon: RiFolderChartLine },
  { name: "Audits", href: "/dashboard/audits", icon: RiListOrdered2 },
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
}

export function SideBar({ className }: SideBarProps) {
  const currentPath = usePathname();
  return (
    <ScrollArea className="h-screen px-3">
      <div className={cn("pb-12", className)}>
        <div className="gap-y-4 py-4">
          <div className="flex items-center px-2 py-2 md:justify-center">
            <OpenCapLogo className="h-7 w-auto" />

            <Select>
              <SelectTrigger className="text-md ml-3 h-8 w-[180px] rounded border-none font-semibold">
                <SelectValue placeholder="Acme Inc." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acme">Acme Inc.</SelectItem>
                <SelectItem value="piedPiper">Pied Pieper</SelectItem>
                <SelectItem value="hooli">Hooli</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-auto py-2">
            <ul role="list" className=" space-y-1">
              {navigation.map((item) => (
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
