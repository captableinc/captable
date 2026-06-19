"use client";

import type { TypeZodAddShareMutationSchema } from "@/trpc/routers/securities-router/schema";
import {
  type Dispatch,
  type ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

type TFormValue = TypeZodAddShareMutationSchema;

interface AddShareFormProviderProps {
  children: ReactNode;
  // When provided, seeds the form for editing an existing share.
  defaultValues?: Partial<TFormValue>;
}

const AddShareFormProviderContext = createContext<{
  value: TFormValue;
  setValue: Dispatch<Partial<TFormValue>>;
} | null>(null);

export function AddShareFormProvider({
  children,
  defaultValues,
}: AddShareFormProviderProps) {
  const [value, setValue] = useReducer(
    (data: TFormValue, partialData: Partial<TFormValue>) => ({
      ...data,
      ...partialData,
    }),
    (defaultValues ?? {}) as TFormValue,
  );

  return (
    <AddShareFormProviderContext.Provider value={{ value, setValue }}>
      {children}
    </AddShareFormProviderContext.Provider>
  );
}

export const useAddShareFormValues = () => {
  const data = useContext(AddShareFormProviderContext);
  if (!data) {
    throw new Error("useAddShareFormValues shouldn't be null");
  }
  return data;
};
