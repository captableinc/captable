import { useState } from "react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import useSteps from "@/components/safe/new/steps";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiStepModal from "@/components/shared/multistep-modal";
import {
  type SafeMutationType,
  SafeMutationSchema,
} from "@/trpc/routers/safe/schema";

type CreateNewSafeType = {
  companyId: string;
  trigger: React.ReactNode;
};

export default function CreateNewSafe({
  companyId,
  trigger,
}: CreateNewSafeType) {
  const steps = useSteps({ companyId });
  const formSchema = SafeMutationSchema;
  const { mutateAsync } = api.safe.create.useMutation();

  const [open, setOpen] = useState(false);

  const form = useForm<SafeMutationType>({
    resolver: zodResolver(formSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SafeMutationType) => {
    await mutateAsync({ values });
    setOpen(false);
  };

  return (
    <MultiStepModal
      title="Create a new SAFE agreement"
      subtitle="Create, sign and send a new SAFE agreement to your investors."
      trigger={trigger}
      steps={steps}
      schema={formSchema}
      onSubmit={onSubmit}
      dialogProps={{ open, onOpenChange: setOpen }}
    />
  );
}
