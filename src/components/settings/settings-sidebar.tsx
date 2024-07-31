"use client";

import { NavLink } from "@/components/dashboard/sidebar/nav-link";
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
  RiBankCardFill,
  RiBankCardLine,
  RiBankFill,
  RiBankLine,
  RiBuildingFill,
  RiBuildingLine,
  RiGroup2Fill,
  RiGroup2Line,
  RiLock2Fill,
  RiLock2Line,
  RiNotificationFill,
  RiNotificationLine,
  RiShieldUserFill,
  RiShieldUserLine,
  RiTerminalBoxFill,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
    name: "Roles",
    href: "/settings/roles",
    icon: RiShieldUserLine,
    activeIcon: RiShieldUserFill,
  },

  {
    name: "Billing",
    href: "/settings/billing",
    icon: RiBankCardLine,
    activeIcon: RiBankCardFill,
  },

  {
    name: "Bank Accounts",
    href: "/settings/bank-accounts",
    icon: RiBankLine,
    activeIcon: RiBankFill,
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
  {
    name: "Access Tokens",
    href: "/settings/access-token",
    icon: RiTerminalBoxLine,
    activeIcon: RiTerminalBoxFill,
  },
];

interface SettingsSidebarProps {
  isBillingEnabled: boolean;
}

export function SettingsSidebar({ isBillingEnabled }: SettingsSidebarProps) {
  const currentPath = usePathname();
  const { data } = useSession();
  const companyPublicId = data?.user.companyPublicId;

  return (
    <ul className="text-sm">
      {companyNav.map((item) => {
        const href = `/${companyPublicId}${item.href}`;
        const isActive = currentPath === href;

        if (item.name === "Billing" && !isBillingEnabled) {
          return null;
        }

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
        const isActive = currentPath.includes(href) || currentPath === href;

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
  );
}
