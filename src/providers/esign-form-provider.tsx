"use client";

import { createReactContext } from "@/react-utils/create-context";
import { type Dispatch, type ReactNode, useReducer } from "react";
import { type FileWithPath } from "react-dropzone";

interface EsignFormProviderProps {
  children: ReactNode;
}

type Value = {
  recipients: {
    email: string;
    name?: string;
  }[];
  orderedDelivery: boolean;
  document: FileWithPath[];
};

const consumerName = "EsignFormProvider";

const [Provider, useValues] = createReactContext<{
  value: Value;
  setValue: Dispatch<Partial<Value>>;
}>(consumerName);

export function EsignFormProvider({ children }: EsignFormProviderProps) {
  const [value, setValue] = useReducer(
    (data: Value, partialData: Partial<Value>) => ({ ...data, ...partialData }),
    {} as Value,
  );

  return (
    <Provider value={value} setValue={setValue}>
      {children}
    </Provider>
  );
}

export const useEsignValues = () => useValues(consumerName);
