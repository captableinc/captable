import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

const EquityPlanForm = ({ className, equityPlan }: EquityFormType) => {
  return <div className={className}>form</div>;
};

export default EquityPlanForm;
