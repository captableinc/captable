"use client";

import { NavLink } from "@/components/dashboard/sidebar/nav-link";
import { Icon, type IconName } from "@/components/ui/icon";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type TNav = {
  name: string;
  href: string;
  icon: IconName;
  activeIcon: IconName;
};

const companyNav: TNav[] = [
  {
    name: "Company",
    href: "/settings/company",
    icon: "building-line",
    activeIcon: "building-fill",
  },
  {
    name: "Team",
    href: "/settings/team",
    icon: "group-2-line",
    activeIcon: "group-2-fill",
  },
  {
    name: "Roles",
    href: "/settings/roles",
    icon: "shield-user-line",
    activeIcon: "shield-user-fill",
  },

  {
    name: "Billing",
    href: "/settings/billing",
    icon: "bank-card-line",
    activeIcon: "bank-card-fill",
  },

  {
    name: "Bank Accounts",
    href: "/settings/bank-accounts",
    icon: "bank-line",
    activeIcon: "bank-fill",
  },
];

const accountNav: TNav[] = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: "account-circle-line",
    activeIcon: "account-circle-fill",
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: "lock-2-line",
    activeIcon: "lock-2-fill",
  },

  {
    name: "Developer",
    href: "/settings/developer",
    icon: "terminal-box-line",
    activeIcon: "terminal-box-fill",
  },

  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: "notification-line",
    activeIcon: "notification-fill",
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
