"use client";

import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageLayout } from "@/components/dashboard/page-layout";
import { NavLink } from "@/components/dashboard/sidebar/nav-link";
import {
  RiGroup2Line,
  RiGroup2Fill,
  RiBuildingLine,
  RiBuildingFill,
  RiAccountCircleLine,
  RiAccountCircleFill,
  RiBankCardLine,
  RiBankCardFill,
  RiNotificationLine,
  RiNotificationFill,
  RiLock2Line,
  RiLock2Fill,
} from "@remixicon/react";

const companyNav = [
  {
    name: "Company",
    href: "/settings/company",
    icon: RiBuildingLine,
    activeIcon: RiBuildingFill,
  },
  {
    name: "Team",
    href: "/settings/team",
    icon: RiGroup2Line,
    activeIcon: RiGroup2Fill,
  },
  {
    name: "Billing",
    href: "/settings/billing",
    icon: RiBankCardLine,
    activeIcon: RiBankCardFill,
  },
];

const accountNav = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: RiAccountCircleLine,
    activeIcon: RiAccountCircleFill,
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: RiLock2Line,
    activeIcon: RiLock2Fill,
  },
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: RiNotificationLine,
    activeIcon: RiNotificationFill,
  },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const currentPath = usePathname();
  const { data } = useSession();
  const companyPublicId = data?.user.companyPublicId;

  return (
    <PageLayout title="Settings">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <ul role="list" className="text-sm">
            {companyNav.map((item) => {
              const href = `/${companyPublicId}${item.href}`;
              const isActive = currentPath === href;

              return (
                <li key={item.name} className="rounded py-1">
                  <NavLink
                    active={isActive}
                    name={item.name}
                    href={href}
                    icon={isActive ? item.activeIcon : item.icon}
                  />
                </li>
              );
            })}

            <div className="mt-3 text-xs font-semibold leading-6 text-gray-400">
              Account
            </div>

            {accountNav.map((item) => {
              const href = `/${companyPublicId}${item.href}`;
              const isActive = currentPath === href;

              return (
                <li key={item.name} className="rounded py-1">
                  <NavLink
                    active={isActive}
                    name={item.name}
                    href={href}
                    icon={isActive ? item.activeIcon : item.icon}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-9">
          <Card className="p-5">{children}</Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;
