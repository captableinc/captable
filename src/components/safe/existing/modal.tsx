import MultiStepModal from "@/components/common/multistep-modal";
import { api } from "@/trpc/react";
import {
  type TypeZodAddExistingSafeMutationSchema,
  ZodAddExistingSafeMutationSchema,
} from "@/trpc/routers/safe/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSafeSteps from "./use-safe-steps";

type CreateExistingSafeType = {
  companyId: string;
  trigger: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function CreateExistingSafe({
  title,
  subtitle,
  companyId,
  trigger,
}: CreateExistingSafeType) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const steps = useSafeSteps({ companyId });
  const formSchema = ZodAddExistingSafeMutationSchema;

  const { mutateAsync } = api.safe.addExisting.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("SAFEs created successfully.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed creating SAFEs. Please try again.");
      }
    },
  });

  const onSubmit = async (values: TypeZodAddExistingSafeMutationSchema) => {
    if (values.documents.length === 0) return;
    await mutateAsync(values);
  };

  return (
    <MultiStepModal
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      steps={steps}
      schema={formSchema}
      onSubmit={onSubmit}
      dialogProps={{ open, onOpenChange: setOpen }}
    />
  );
}
