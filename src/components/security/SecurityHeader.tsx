import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import type React from "react";

type SettingsHeaderProps = {
  title: string;
  subtitle: string;
  showBackArrow?: boolean;
  children?: React.ReactNode;
  className?: string;
  companyPublicId?: string;
};

export const SecurityHeader = async ({
  children,
  title,
  subtitle,
  showBackArrow = true,
  companyPublicId,
  className,
}: SettingsHeaderProps) => {
  let href = "";

  // we only need href incase of back navigation
  if (showBackArrow) {
    if (companyPublicId) {
      href = `/${companyPublicId}/settings/security`;
    } else {
      const session = await getServerAuthSession();
      href = `/${session?.user.companyPublicId}/settings/security`;
    }
  }
  return (
    <>
      <div
        className={cn("flex flex-row items-center justify-between", className)}
      >
        <div>
          <div className="flex flex-row items-center justify-start space-x-1">
            {showBackArrow && (
              <Link href={href}>
                <RiArrowLeftLine className="space-x-3 text-slate-800" />
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
