"use client";

import { useEffect, useLayoutEffect } from "react";

function canUseDOM() {
  return !!(typeof window !== "undefined" && window?.document?.createElement);
}
export const useIsomorphicLayoutEffect = canUseDOM()
  ? useLayoutEffect
  : useEffect;
