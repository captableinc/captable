import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkProps {
  href?: string;
  icon?: IconName;
  name: string;
  active: boolean;
  className?: string;
}

export function NavLink({ active, href, icon, name, className }: NavLinkProps) {
  return (
    <>
      {href ? (
        <Link
          href={href}
          className={cn(
            className,
            active
              ? "bg-gray-50 font-semibold text-primary"
              : "text-gray-700 hover:bg-gray-50 hover:text-primary",
            "group flex gap-x-3 rounded-md p-1 text-sm leading-6",
          )}
        >
          {icon && (
            <Icon
              name={icon}
              className={cn(
                active
                  ? "text-primary"
                  : "text-gray-400 group-hover:text-primary",
                "h-6 w-6 shrink-0",
              )}
            />
          )}
          {name}
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            className,
            active
              ? "bg-gray-50 font-semibold text-primary"
              : "text-gray-700 hover:bg-gray-50 hover:text-primary",
            "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
          )}
        >
          {icon && (
            <Icon
              name={icon}
              className={cn(
                active
                  ? "text-primary"
                  : "text-gray-400 group-hover:text-primary",
                "h-6 w-6 shrink-0",
              )}
            />
          )}
          {name}
        </button>
      )}
    </>
  );
}
