"use client";

import {
  RiEqualizer2Fill,
  RiEqualizer2Line,
  RiFileTextFill,
  RiFileTextLine,
  RiFolder5Fill,
  RiFolder5Line,
  RiFolderChart2Fill,
  RiFolderChart2Line,
  RiFolderChartFill,
  RiFolderChartLine,
  RiGroup2Fill,
  RiGroup2Line,
  RiHome2Fill,
  RiHome2Line,
  RiListCheck3,
  RiListIndefinite,
  RiMailSendFill,
  RiMailSendLine,
  RiMoneyDollarCircleFill,
  RiMoneyDollarCircleLine,
  RiPieChartFill,
  RiPieChartLine,
  RiSafeFill,
  RiSafeLine,
} from "@remixicon/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { OpenCapLogo } from "@/components/shared/logo";
import { usePathname } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";

import { type TGetCompanyList } from "@/server/company";
import { CompanySwitcher } from "./company-switcher";

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: RiHome2Line,
    activeIcon: RiHome2Fill,
  },
  {
    name: "Cap table",
    href: "/captable",
    icon: RiPieChartLine,
    activeIcon: RiPieChartFill,
  },
  {
    name: "Stakeholders",
    href: "/stakeholders",
    icon: RiGroup2Line,
    activeIcon: RiGroup2Fill,
  },
  {
    name: "Share classes",
    href: "/share-classes",
    icon: RiFolderChart2Line,
    activeIcon: RiFolderChart2Fill,
  },
  {
    name: "Equity plans",
    href: "/equity-plans",
    icon: RiFolderChart2Line,
    activeIcon: RiFolderChart2Fill,
  },
  {
    name: "Securities",
    href: "/securities",
    icon: RiSafeLine,
    activeIcon: RiSafeFill,
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
    icon: RiMoneyDollarCircleLine,
    activeIcon: RiMoneyDollarCircleFill,
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
        icon: RiFolder5Line,
        activeIcon: RiFolder5Fill,
      },
    ],
  },
  {
    name: "Updates",
    href: "/updates",
    icon: RiMailSendLine,
    activeIcon: RiMailSendFill,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: RiFolderChartLine,
    activeIcon: RiFolderChartFill,
  },
  {
    name: "Audits",
    href: "/audits",
    icon: RiListIndefinite,
    activeIcon: RiListCheck3,
  },
];

const company = [
  {
    id: 1,
    name: "Settings",
    rootPath: "/settings/",
    href: "/settings/company",
    icon: RiEqualizer2Line,
    activeIcon: RiEqualizer2Fill,
  },
  {
    id: 2,
    name: "Form 3921",
    href: "/3921",
    icon: RiFileTextLine,
    activeIcon: RiFileTextFill,
  },
  {
    id: 3,
    name: "409A Valuation",
    href: "/409a",
    icon: RiFileTextLine,
    activeIcon: RiFileTextFill,
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
            <OpenCapLogo className="h-7 w-auto" />

            <CompanySwitcher companies={companies} publicId={publicId} />
          </div>

          <div className="overflow-auto py-2">
            <ul role="list" className="space-y-1">
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
                            {isActive ? (
                              <item.activeIcon
                                className={cn(
                                  "ml-1 mr-1 mt-1 inline-block",
                                  "text-primary",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <item.icon
                                className={cn(
                                  "ml-1 mr-1 mt-1 inline-block",
                                  "text-gray-400 group-hover:text-primary",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                            )}

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
                            <ul role="list" className="space-y-1">
                              {item.subNav.map((subItem) => {
                                const href =
                                  basePath + item.href + subItem.href;
                                const isActive = currentPath.includes(
                                  item.href + subItem.href,
                                );

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
              <ul role="list" className="space-y-1">
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
