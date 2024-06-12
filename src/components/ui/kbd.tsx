export const Kbd = ({ className }: { className?: string }) => {
  return (
    <span
      className={`border rounded-sm flex items-center justify-center size-[18px] text-xs text-primary ${className}`}
    >
      <kbd>P</kbd>
    </span>
  );
};
