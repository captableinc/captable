import { invariant } from "@/lib/error";
import {
  type Dispatch,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

type FormValueStateContextType<T> = T;

type FormValueUpdaterContextType<T> = Dispatch<Partial<T>>;

const FormValueStateContext =
  createContext<FormValueStateContextType<unknown> | null>(null);

const FormValueUpdaterContext =
  createContext<FormValueUpdaterContextType<unknown> | null>(null);

interface FormValueProviderProps<T> {
  children: ReactNode;
  defaultValues?: T;
}

export function FormValueProvider<T extends {}>({
  children,
  defaultValues,
}: FormValueProviderProps<T>) {
  const [value, setValue] = useReducer(
    (data: T, partialData: Partial<T>) => ({
      ...data,
      ...partialData,
    }),
    { ...(defaultValues && defaultValues) } as T,
  );
  return (
    <FormValueStateContext.Provider value={value}>
      <FormValueUpdaterContext.Provider value={setValue}>
        {children}
      </FormValueUpdaterContext.Provider>
    </FormValueStateContext.Provider>
  );
}

export function useFormValueState<T extends {}>() {
  const data = useContext(
    FormValueStateContext,
  ) as FormValueStateContextType<T> | null;

  invariant(data, "useFormValueState should be used inside FormValueProvider");

  return data;
}

export function useFormValueUpdater<T>() {
  const updater = useContext(
    FormValueUpdaterContext,
  ) as FormValueUpdaterContextType<T> | null;

  invariant(
    updater,
    "useFormValueUpdater should be used inside FormValueProvider",
  );

  const handler = useCallback((arg: T) => updater(arg), [updater]);
  return handler;
}
