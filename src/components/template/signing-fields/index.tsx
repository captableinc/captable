"use client";

import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { FieldRenderer } from "./field-renderer";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
  const { toast } = useToast();
  const router = useRouter();

  const { mutateAsync } = api.template.sign.useMutation({
    onSuccess() {
      toast({
        variant: "default",
        title: "🎉 Document signed Successfully",
        description: "",
      });

      if (companyPublicId) {
        router.push(`/${companyPublicId}/documents`);
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData.entries()) as Record<
          string,
          string
        >;

        await mutateAsync({ data, templatePublicId: token });
      }}
      className="flex flex-col gap-y-4 px-2 py-10"
    >
      {fields.map((item) => (
        <FieldRenderer
          name={item.name}
          id={item.id}
          key={item.id}
          type={item.type}
          required={item.required}
        />
      ))}

      <Button type="submit">Sign</Button>
    </form>
  );
}
