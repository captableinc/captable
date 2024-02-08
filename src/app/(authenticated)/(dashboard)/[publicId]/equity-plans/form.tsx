import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  EquityPlanMutationSchema,
  type EquityPlanMutationType,
} from "@/trpc/routers/equity-plan/schema";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = EquityPlanMutationSchema;

type EquityFormType = {
  className?: string;
  equityPlan?: EquityPlanMutationType;
};

const EquityPlanForm = ({
  className,
  equityPlan = {
    name: "",
    boardApprovalDate: "",
    planEffectiveDate: "",
    initialSharesReserved: 0,
    defaultCancellatonBehavior: "RETURN_TO_POOL",
    shareClassId: "",
    comments: [],
  },
}: EquityFormType) => {
  const form = useForm<EquityPlanMutationType>({
    resolver: zodResolver(formSchema),
    defaultValues: equityPlan,
  });

  const onSubmit = async (values: EquityPlanMutationType) => {
    debugger;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div className="col-span-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equity plan name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-3">two</div>
          <div className="sm:col-span-3">three</div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create an equity plan</Button>
        </div>
      </form>
    </Form>
  );
};

export default EquityPlanForm;
