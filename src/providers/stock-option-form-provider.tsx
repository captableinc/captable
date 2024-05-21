"use client";

import type { TypeZodAddOptionMutationSchema } from "@/trpc/routers/securities-router/schema";
import {
  type Dispatch,
  type ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

type TFormValue = TypeZodAddOptionMutationSchema;

interface StockOptionFormProviderProps {
  children: ReactNode;
}

const StockOptionFormProviderContext = createContext<{
  value: TFormValue;
  setValue: Dispatch<Partial<TFormValue>>;
} | null>(null);

export function StockOptionFormProvider({
  children,
}: StockOptionFormProviderProps) {
  const [value, setValue] = useReducer(
    (data: TFormValue, partialData: Partial<TFormValue>) => ({
      ...data,
      ...partialData,
    }),
    {} as TFormValue,
  );

  return (
    <StockOptionFormProviderContext.Provider value={{ value, setValue }}>
      {children}
    </StockOptionFormProviderContext.Provider>
  );
}

export const useStockOptionFormValues = () => {
  const data = useContext(StockOptionFormProviderContext);

  if (!data) {
    throw new Error("useStockOptionFormValues shouldn't be null");
  }

  return data;
};
