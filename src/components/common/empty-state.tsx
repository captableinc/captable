"use client";

/* Usage:
  <EmptyState
    icon={<RiLandscapeFill />}
    title="This is title"
    subtitle="This is subtitle">
    <Button size="lg">Button</Button>
  </EmptyState>
*/

import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title?: string;
  bordered?: boolean;
  subtitle: string | React.ReactNode;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
};

const EmptyState = ({
  icon,
  title,
  bordered = true,
  subtitle,
  children,
}: EmptyStateProps) => {
  return (
    <section className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            bordered && "rounded-xl border",
            "bg-white px-6 shadow-sm",
          )}
        >
          <div className="mx-auto w-full max-w-2xl py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <span className="text-teal-500">{icon}</span>
            </div>

            {title && <h3 className="mb-5 text-3xl font-semibold">{title}</h3>}
            <p className="mb-6">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmptyState;
