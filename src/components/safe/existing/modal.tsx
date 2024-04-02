import { useState } from "react";
import { api } from "@/trpc/react";
import MultiStepModal from "@/components/shared/multistep-modal";
import { useRouter } from "next/navigation";
import useSafeSteps from "./use-safe-steps";
import { useToast } from "@/components/ui/use-toast";
import {
  type TypeZodAddExistingSafeMutationSchema,
  ZodAddExistingSafeMutationSchema,
} from "@/trpc/routers/safe/schema";

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
  const { toast } = useToast();

  const { mutateAsync } = api.safe.addExisting.useMutation({
    onSuccess: async ({ message, success }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: message,
        description: success
          ? "New SAFEs agreement has been created."
          : "Failed creating SAFEs. Please try again.",
      });
      setOpen(false);
      if (success) {
        router.refresh();
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
