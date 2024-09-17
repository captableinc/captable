"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    params: Record<string, string | number | boolean | null | undefined>,
  ) => {
    const nextSearchParams = new URLSearchParams(
      searchParams?.toString() ?? "",
    );

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        nextSearchParams.delete(key);
      } else {
        nextSearchParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${nextSearchParams.toString()}`);
  };
};
