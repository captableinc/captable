/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";

type FieldRendererProps = Pick<
  TypeZodAddFieldMutationSchema["data"][number],
  "type" | "name" | "id" | "required"
>;

export function FieldRenderer({
  type,
  id,
  name,
  required,
}: FieldRendererProps) {
  switch (type) {
    case "TEXT":
      return (
        <div className="flex flex-col gap-y-2">
          <Label>{name}</Label>
          <Input required={required} id={id} name={name} />
        </div>
      );

    default:
      return null;
  }
}
