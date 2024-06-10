type KbdProps = {
  children: React.ReactNode;
};

const Kbd = ({ children }: KbdProps) => {
  return (
    <kbd className="shadow font-medium px-1.5 py-0.5 text-xs text-gray-950 bg-gray-50 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {children}
    </kbd>
  );
};

export default Kbd;
