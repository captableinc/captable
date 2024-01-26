"use client";

{
  /* Usage:
  <EmptyState
    icon={<RiLandscapeFill />}
    title="This is title"
    subtitle="This is subtitle">
    <Button size="lg">Button</Button>
  </EmptyState>
*/
}

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  bordered?: boolean;
  subtitle: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
};

const EmptyState = ({
  icon,
  title,
  bordered = false,
  subtitle,
  children,
}: EmptyStateProps) => {
  return (
    <section className="overflow-hidden py-4">
      <div className="container mx-auto px-4">
        <div
          className={cn(bordered && "rounded-xl border", "bg-white px-6 pt-5")}
        >
          <div className="mx-auto w-full max-w-lg py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
              {icon}
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
