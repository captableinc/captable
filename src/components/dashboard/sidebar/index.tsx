"use client";

import {
  RiPieChartLine,
  RiPieChartFill,
  RiSafeLine,
  RiSafeFill,
  RiFolder5Line,
  RiFolder5Fill,
  RiFolderChartLine,
  RiFolderChartFill,
  RiFileList2Line,
  RiFileList2Fill,
  RiEqualizer2Line,
  RiListCheck3,
  RiFolderChart2Line,
  RiFolderChart2Fill,
  RiAccountCircleLine,
  RiAccountCircleFill,
} from "@remixicon/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { usePathname } from "next/navigation";
import { OpenCapLogo } from "@/components/shared/logo";

import { NavLink } from "./nav-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { type TGetCompanyList } from "@/server/company";
import { CompanySwitcher } from "./company-switcher";

const navigation = [
  {
    name: "Cap table",
    href: "/",
    icon: RiPieChartLine,
    activeIcon: RiPieChartFill,
  },
  {
    name: "Stakeholders",
    href: "/stakeholders",
    icon: RiAccountCircleLine,
    activeIcon: RiAccountCircleFill,
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
        name: "Equity",
        href: "/equity",
      },
      {
        name: "Options",
        href: "/options",
      },
      {
        name: "SAFEs",
        href: "/safes",
      },
      {
        name: "Convertible notes",
        href: "/convertible-notes",
      },
      // {
      //   name: "RSUs",
      //   href: "/rsus",
      // },
      // {
      //   name: "Phantom",
      //   href: "/phantom",
      // },
      // {
      //   name: "ESPP",
      //   href: "/espp",
      // },
      // {
      //   name: "Warrants",
      //   href: "/warrants",
      // },
      // {
      //   name: "KISS",
      //   href: "/kiss",
      // },
      // {
      //   name: "SARs",
      //   href: "/sars",
      // },
      // {
      //   name: "Other",
      //   href: "/other",
      // },
    ],
  },
  {
    name: "Documents",
    href: "/documents",
    icon: RiFolder5Line,
    activeIcon: RiFolder5Fill,
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
    icon: RiListCheck3,
    activeIcon: RiListCheck3,
  },
];

const forms = [
  {
    id: 1,
    name: "409A Valuation",
    href: "/409a",
    icon: RiFileList2Line,
    activeIcon: RiFileList2Fill,
  },
  {
    id: 2,
    name: "Form 3921",
    href: "/3921",
    icon: RiFileList2Line,
    activeIcon: RiFileList2Fill,
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
        <div className="gap-y-4 py-4">
          <div className="flex items-center px-2 py-2 ">
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
                            <item.icon
                              className={cn(
                                "ml-1 mr-1 mt-2 inline-block",
                                isActive
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-primary",
                                "h-6 w-6 shrink-0",
                              )}
                              aria-hidden="true"
                            />
                            <AccordionTrigger
                              className={cn(
                                isActive
                                  ? "bg-gray-50 font-semibold text-primary"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 hover:no-underline",
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
                      href={`${basePath}${item.href}`}
                      icon={item.icon}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <NavLink
              active={currentPath === "/settings"}
              name="Settings"
              href={`${basePath}/settings`}
              icon={RiEqualizer2Line}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
