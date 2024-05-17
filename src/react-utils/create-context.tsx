"use client";
// credit https://github.com/radix-ui/primitives/blob/main/packages/react/context/src/createContext.tsx
import { createContext, useContext, useMemo } from "react";

export function createReactContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) {
  const Context = createContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    const value = useMemo(
      () => context,
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useReactContext(consumerName: string) {
    const context = useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\``,
    );
  }

  Provider.displayName = rootComponentName + "Provider";
  return [Provider, useReactContext] as const;
}
