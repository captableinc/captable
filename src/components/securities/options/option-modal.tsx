import {
<<<<<<< HEAD
  StepperModal,
  StepperModalContent,
  type StepperModalProps,
  StepperStep,
} from "@/components/ui/stepper";
import { StockOptionFormProvider } from "@/providers/stock-option-form-provider";
import { api } from "@/trpc/server";
import { Documents } from "./steps/documents";
import { GeneralDetails } from "./steps/general-details";
import { RelevantDates } from "./steps/relevant-dates";
import { VestingDetails } from "./steps/vesting-details";

async function VestingDetailsStep() {
  const [stakeholders, equityPlans] = await Promise.all([
    api.stakeholder.getStakeholders.query(),
    api.equityPlan.getPlans.query(),
  ]);
  return (
    <VestingDetails stakeholders={stakeholders} equityPlans={equityPlans} />
  );
}

export const OptionModal = (props: Omit<StepperModalProps, "children">) => {
  return (
    <StepperModal {...props}>
      <StockOptionFormProvider>
        <StepperStep title="General details">
          <StepperModalContent>
            <GeneralDetails />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Vesting details">
          <StepperModalContent>
            <VestingDetailsStep />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Relevant dates">
          <StepperModalContent>
            <RelevantDates />
          </StepperModalContent>
        </StepperStep>
        <StepperStep title="Documents">
          <StepperModalContent>
            <Documents />
          </StepperModalContent>
        </StepperStep>
      </StockOptionFormProvider>
    </StepperModal>
=======
  type TypeZodAddOptionMutationSchema,
  ZodAddOptionMutationSchema,
} from "@/trpc/routers/securities-router/schema";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import {
  Documents,
  GeneralDetails,
  GeneralDetailsField,
  RelevantDates,
  RelevantDatesFields,
  VestingDetails,
  VestingDetailsFields,
} from "./steps";

type OptionModalProps = {
  title: string;
  subtitle: string | React.ReactNode;
  trigger: string | React.ReactNode;
};

const OptionModal = ({ title, subtitle, trigger }: OptionModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const addOptionMutation = api.securities.addOptions.useMutation({
    onSuccess: ({ message, success }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: message,
        description: success
          ? "A new stakeholder option has been created."
          : "Failed adding an option. Please try again.",
      });
      setOpen(false);
      if (success) {
        router.refresh();
      }
    },
  });

  const steps = [
    {
      id: 1,
      title: "General details",
      component: GeneralDetails,
      fields: GeneralDetailsField,
    },
    {
      id: 2,
      title: "Vesting details",
      component: VestingDetails,
      fields: VestingDetailsFields,
    },
    {
      id: 3,
      title: "Relevant dates",
      component: RelevantDates,
      fields: RelevantDatesFields,
    },
    {
      id: 4,
      title: "Documents",
      component: Documents,
      fields: ["documents"],
    },
  ];

  const onSubmit = async (data: TypeZodAddOptionMutationSchema) => {
    if (data?.documents.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh ohh! Documents not found",
        description: "Please upload necessary documents",
      });
      return;
    }
    await addOptionMutation.mutateAsync(data);
  };

  return (
    <div>
      <MultiStepModal
        //@ts-ignore
        steps={steps}
        title={title}
        subtitle={subtitle}
        trigger={trigger}
        dialogProps={{
          open,
          onOpenChange: (val) => {
            setOpen(val);
          },
        }}
        schema={ZodAddOptionMutationSchema}
        onSubmit={onSubmit}
      />
    </div>
>>>>>>> 66bc51c (chore: humanize vesting schedule)
  );
};
