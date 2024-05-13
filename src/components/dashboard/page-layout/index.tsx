import { type ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageLayout({
  action,
  children,
  title,
  description,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div>{action}</div>
      </div>

      {children}
    </div>
  );
}
