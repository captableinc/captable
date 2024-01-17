import { cn } from "@/lib/utils";
import Link from "next/link";
import { type RiHome4Line } from "@remixicon/react";

type Icon = typeof RiHome4Line;

interface NavLinkProps {
  href: string;
  icon: Icon;
  name: string;
  active: boolean;
}

export function NavLink({ active, href, icon, name }: NavLinkProps) {
  const Icon = icon;
  return (
    <Link
      href={href}
      className={cn(
        active
          ? "bg-gray-50 font-semibold text-primary"
          : "text-gray-700 hover:bg-gray-50 hover:text-primary",
        "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
      )}
    >
      <Icon
        className={cn(
          active ? "text-primary" : "text-gray-400 group-hover:text-primary",
          "h-6 w-6 shrink-0",
        )}
        aria-hidden="true"
      />
      {name}
    </Link>
  );
}
