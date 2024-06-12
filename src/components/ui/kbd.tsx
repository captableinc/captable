<<<<<<< HEAD
import { cn } from "@/lib/utils";

type KbdProps = {
  children: React.ReactNode;
  className?: string;
};

const Kbd = ({ children, className }: KbdProps) => {
  return (
    // <kbd className="shadow font-medium px-1.5 py-0.5 text-xs text-gray-950 bg-gray-50 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
    <kbd
      className={cn(
        "inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono shadow font-medium text-xs",
        className,
      )}
    >
      {children}
    </kbd>
  );
};

export default Kbd;
=======
export const Kbd = ({ className }: { className?: string }) => {
  return (
    <span
      className={`border rounded-sm flex items-center justify-center size-[18px] text-xs text-primary ${className}`}
    >
      <kbd>P</kbd>
    </span>
  );
};
>>>>>>> 3b6d278 (feat: create kbd component)
