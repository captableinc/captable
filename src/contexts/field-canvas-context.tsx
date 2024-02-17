"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { type FieldTypes } from "@/prisma-enums";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-router/schema";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface fieldCanvasContextProps {
  fieldType: FieldTypes | undefined;
  fields: Field[];
  handleFieldType: (val: FieldTypes | undefined) => void;
  handleDeleteField: (id: string) => void;
  addField: (data: Field) => void;
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
    const filteredArray = fields.filter((item) => item.id !== id);
    setFields(filteredArray);
  };

  const addField = (data: Field) => {
    setFields([...fields, data]);
  };

  return (
    <fieldCanvasContext.Provider
      value={{
        fieldType,
        handleFieldType,
        fields,
        handleDeleteField,
        addField,
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
