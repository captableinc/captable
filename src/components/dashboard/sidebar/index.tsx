"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CaptableLogo } from "@/components/common/logo";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";

import { Icon, type IconName } from "@/components/ui/icon";
import type { TGetCompanyList } from "@/server/company";
import { CompanySwitcher } from "./company-switcher";

type TNavigation = {
  name: string;
  href: string;
  icon: IconName;
  activeIcon: IconName;
  subNav?: { name: string; href: string }[];
  id?: number;
  rootPath?: string;
};

const navigation: TNavigation[] = [
  {
    name: "Overview",
    href: "/",
    icon: "home-2-line",
    activeIcon: "home-2-fill",
  },
  {
    name: "Cap table",
    href: "/captable",
    icon: "pie-chart-line",
    activeIcon: "pie-chart-fill",
  },
  {
    name: "Stakeholders",
    href: "/stakeholders",
    icon: "group-2-line",
    activeIcon: "group-2-fill",
  },
  {
    name: "Share classes",
    href: "/share-classes",
    icon: "folder-chart-2-line",
    activeIcon: "folder-chart-2-fill",
  },
  {
    name: "Equity plans",
    href: "/equity-plans",
    icon: "folder-chart-2-line",
    activeIcon: "folder-chart-2-fill",
  },
  {
    name: "Securities",
    href: "/securities",
    icon: "safe-line",
    activeIcon: "safe-fill",
    subNav: [
      {
        name: "Shares",
        href: "/shares",
      },
      {
        name: "Stock options",
        href: "/options",
      },
      {
        name: "Transactions",
        href: "/transactions",
      },
    ],
  },
  {
    name: "Fundraise",
    href: "/fundraise",
    icon: "money-dollar-circle-line",
    activeIcon: "money-dollar-circle-fill",
    subNav: [
      {
        name: "SAFEs",
        href: "/safes",
      },

      {
        name: "Convertible notes",
        href: "/convertible-notes",
      },

      {
        name: "Investments",
        href: "/investments",
      },
    ],
  },

  {
    name: "Documents",
    href: "/documents",
    icon: "folder-5-line",
    activeIcon: "folder-5-fill",
    subNav: [
      {
        name: "Data rooms",
        href: "/data-rooms",
      },
      {
        name: "eSign documents",
        href: "/esign",
      },
      {
        name: "All documents",
        href: "/",
      },
      // {
      //   name: "Share documents",
      //   href: "/share",
      // },
    ],
  },

  {
    name: "Updates",
    href: "/updates",
    icon: "mail-send-line",
    activeIcon: "mail-send-fill",
  },

  {
    name: "Reports",
    href: "/reports",
    icon: "folder-chart-line",
    activeIcon: "folder-chart-fill",
  },

  {
    name: "Audits",
    href: "/audits",
    icon: "list-indefinite",
    activeIcon: "list-check-3",
  },
];

const company: TNavigation[] = [
  {
    id: 1,
    name: "Team",
    rootPath: "/settings/team",
    href: "/settings/team",
    icon: "group-2-line",
    activeIcon: "group-2-fill",
  },
  {
    id: 2,
    name: "Settings",
    rootPath: "/settings/company",
    href: "/settings/company",
    icon: "equalizer-2-line",
    activeIcon: "equalizer-2-fill",
  },
  {
    id: 3,
    name: "Form 3921",
    href: "/3921",
    icon: "file-text-line",
    activeIcon: "file-text-fill",
  },
  {
    id: 4,
    name: "409A Valuation",
    href: "/409a",
    icon: "file-text-line",
    activeIcon: "file-text-fill",
  },
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
        <div className="fixed gap-y-4 py-4">
          <div className="flex items-center px-1 py-2">
            <CaptableLogo className="h-7 w-auto" />

            <CompanySwitcher companies={companies} publicId={publicId} />
          </div>

          <div className="overflow-auto py-2">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const href = basePath + item.href;
                const isActive =
                  currentPath === href ||
                  (currentPath === basePath && item.href === "/") ||
                  (currentPath.includes(`${item.href}/`) && item.href !== "/");

                return (
                  <li key={item.name}>
                    {item.subNav ? (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                          <div className="flex">
                            <Icon
                              name={isActive ? item.activeIcon : item.icon}
                              className={cn(
                                "ml-1 mr-1 mt-1 inline-block",
                                isActive
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-primary",
                                "h-6 w-6 shrink-0",
                              )}
                            />

                            <AccordionTrigger
                              className={cn(
                                isActive
                                  ? "bg-gray-50 font-semibold text-primary"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                                "group flex gap-x-3 rounded-md px-2 py-1 text-sm leading-6 hover:no-underline",
                              )}
                            >
                              {item.name}
                            </AccordionTrigger>
                          </div>

                          <AccordionContent>
                            <ul className="space-y-1">
                              {item.subNav.map((subItem) => {
                                const href =
                                  basePath + item.href + subItem.href;
                                const isActive =
                                  (subItem.href !== "/" &&
                                    currentPath.includes(
                                      item.href + subItem.href,
                                    )) ||
                                  href === `${currentPath}/`;

                                return (
                                  <li key={subItem.name}>
                                    <NavLink
                                      active={isActive}
                                      name={subItem.name}
                                      href={href}
                                      className="ml-9"
                                    />
                                  </li>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <NavLink
                        active={isActive}
                        name={item.name}
                        href={href}
                        icon={isActive ? item.activeIcon : item.icon}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="py-3">
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Company
              </div>
              <ul className="space-y-1">
                {company.map((item) => {
                  const href = basePath + item.href;
                  const isActive =
                    currentPath === href ||
                    (currentPath === basePath && item.href === "/") ||
                    (currentPath.includes(`/${item.href}/`) &&
                      item.href !== "/") ||
                    (currentPath.includes(`${item.rootPath}`) &&
                      item.href !== "/");

                  return (
                    <li key={item.name}>
                      <NavLink
                        active={isActive}
                        name={item.name}
                        href={`${basePath}${item.href}`}
                        icon={isActive ? item.activeIcon : item.icon}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
