import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { withServerComponentSession } from "@/server/auth";
import Link from "next/link";
import type React from "react";

type SettingsHeaderProps = {
  title: string;
  subtitle: string;
  showBackArrow?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const SettingsHeader = async ({
  children,
  title,
  subtitle,
  showBackArrow = true,
  className,
}: SettingsHeaderProps) => {
  const session = await withServerComponentSession();

  const href = `/${session?.user.companyPublicId}/settings/security`;
  return (
    <>
      <div
        className={cn("flex flex-row items-center justify-between", className)}
      >
        <div>
          <div className="flex flex-row items-center justify-start space-x-1">
            {showBackArrow && (
              <Link href={href}>
                <Icon
                  name="arrow-left-line"
                  className="space-x-3 text-slate-800"
                />
              </Link>
            )}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>

          <p className="text-muted-foreground text-sm md:mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </>
  );
};
