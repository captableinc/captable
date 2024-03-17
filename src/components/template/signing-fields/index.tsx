import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { FieldRenderer } from "./field-renderer";
import { Button } from "@/components/ui/button";
import { SigningFieldForm } from "../signing-field-form";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface SigningFieldsProps {
  fields: Field[];
  token: string;
  companyPublicId: string | undefined;
}

export function SigningFields({
  fields,
  token,
  companyPublicId,
}: SigningFieldsProps) {
  return (
    <SigningFieldForm token={token} companyPublicId={companyPublicId}>
      {fields.map((item) => (
        <FieldRenderer
          name={item.name}
          key={item.id}
          type={item.type}
          required={item.required}
          readOnly={item.readOnly}
        />
      ))}

      <Button type="submit">Sign</Button>
    </SigningFieldForm>
  );
}
