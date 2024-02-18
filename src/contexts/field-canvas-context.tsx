"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { type FieldTypes } from "@/prisma-enums";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { produce } from "immer";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface fieldCanvasContextProps {
  fieldType: FieldTypes | undefined;
  fields: Field[];
  handleFieldType: (val: FieldTypes | undefined) => void;
  handleDeleteField: (id: string) => void;
  addField: (data: Field) => void;
  updateField: (id: string, data: Partial<Field>) => void;
}

const fieldCanvasContext = createContext<null | fieldCanvasContextProps>(null);

interface FieldContextProviderProps {
  children: ReactNode;
  fields: Field[];
}

export function FieldContextProvider({
  children,
  fields: defaultFields,
}: FieldContextProviderProps) {
  const [fieldType, setFieldType] = useState<undefined | FieldTypes>(undefined);
  const [fields, setFields] = useState<Field[]>(defaultFields);

  const handleFieldType = (value: FieldTypes | undefined) => {
    setFieldType(value);
  };

  const handleDeleteField = (id: string) => {
    const deletedItem = produce(fields, (draft) => {
      const index = draft.findIndex((item) => item.id === id);
      if (index !== -1) draft.splice(index, 1);
    });

    setFields(deletedItem);
  };

  const addField = (data: Field) => {
    const addedFields = produce(fields, (draft) => {
      draft.push(data);
    });
    setFields(addedFields);
  };

  const updateField = (id: string, data: Partial<Field>) => {
    const updatedField = produce(fields, (draft) => {
      const index = draft.findIndex((item) => item.id === id);
      if (index !== -1) {
        draft[index] = { ...(draft[index] as Field), ...data };
      }
    });

    setFields(updatedField);
  };

  return (
    <fieldCanvasContext.Provider
      value={{
        fieldType,
        handleFieldType,
        fields,
        handleDeleteField,
        addField,
        updateField,
      }}
    >
      {children}
    </fieldCanvasContext.Provider>
  );
}

export const useFieldCanvasContext = () => {
  const data = useContext(fieldCanvasContext);

  if (!data) {
    throw new Error(
      "useFieldCanvasContext should be called inside FieldContextProvider",
    );
  }

  return data;
};
