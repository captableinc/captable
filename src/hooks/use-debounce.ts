import { useEffect, useState } from "react";

export const useDebounce = (value: string) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(value);
    }, 600);

    return () => {
      clearTimeout(timeOut);
    };
  }, [value]);

  return { debouncedValue };
};
