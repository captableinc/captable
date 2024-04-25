import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/shared";
import { SigningFieldForm } from "../signing-field-form";
import { FieldRenderer } from "./field-renderer";

type Fields = RouterOutputs["template"]["getSigningFields"]["fields"];

interface SigningFieldsProps {
  fields: Fields;
  companyPublicId: string | undefined;
  recipientId: string;
  templateId: string;
}

export function SigningFields({
  fields,
  companyPublicId,
  recipientId,
  templateId,
}: SigningFieldsProps) {
  return (
    <SigningFieldForm
      recipientId={recipientId}
      templateId={templateId}
      companyPublicId={companyPublicId}
    >
      {fields.map((item) => (
        <FieldRenderer
          name={item.name}
          key={item.id}
          type={item.type}
          required={item.required}
          readOnly={item.readOnly}
          group={item.group}
          recipientId={recipientId}
          prefilledValue={item.prefilledValue}
          id={item.id}
        />
      ))}

      <Button type="submit">Sign</Button>
    </SigningFieldForm>
  );
}
