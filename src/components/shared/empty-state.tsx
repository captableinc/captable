"use client";

{
  /* Usage:
  <EmptyState
    icon={<RiLandscapeFill />}
    title="This is title"
    description="This is description">
    <Button size="lg">Button</Button>
  </EmptyState>
*/
}

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  bordered?: boolean;
  description: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
};

const EmptyState = ({
  icon,
  title,
  bordered = false,
  description,
  children,
}: EmptyStateProps) => {
  return (
    <section className="overflow-hidden py-4">
      <div className="container mx-auto px-4">
        <div
          className={cn(bordered && "rounded-xl border", "bg-white px-6 pt-5")}
        >
          <div className="mx-auto max-w-xs py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
              {icon}
            </div>

            {title && <h2 className="mb-5 text-4xl font-semibold">{title}</h2>}
            <p className="mb-6">{description}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmptyState;
