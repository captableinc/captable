"use client";
import * as React from "react";

export function useListenPkey(
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>,
) {
  React.useEffect(() => {
    const listenPkey = (e: KeyboardEvent) => {
      if (e.key === "p") {
        e.preventDefault();
        setOpenPopover(true);
      }
    };

    document.addEventListener("keypress", listenPkey);

    return () => {
      document.removeEventListener("keypress", listenPkey);
    };
  }, [setOpenPopover]);
}
