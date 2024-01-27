import { cn } from "@/lib/utils";

type BorderWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

const BorderWrapper = ({ className, children }: BorderWrapperProps) => {
  return (
    <div className={cn("rounded border bg-white p-10 shadow-sm", className)}>
      {children}
    </div>
  );
};

export default BorderWrapper;
