import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { StakeholderSelector } from "@/components/stakeholder/stakeholder-selector";
import { Button } from "@/components/ui/button";
import { LinearCombobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { SafeStatusEnum, SafeTypeEnum } from "@/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { PrePostSelector } from "./pre-post-selector";

type SafeFormProps = {
  type: "create" | "import";
};

const SafeFormSchema = z.object({
  id: z.string().optional(),
  publicId: z.string().optional(),
  type: z.nativeEnum(SafeTypeEnum),
  status: z.nativeEnum(SafeStatusEnum),
  capital: z.coerce.number(),
  valuationCap: z.coerce.number().optional(),
  discountRate: z.coerce.number().optional(),
  mfn: z.boolean().default(false),
  proRata: z.boolean().default(false),
  issueDate: z.string().date(),
  stakeholderId: z.string(),
});

type SafeFormType = z.infer<typeof SafeFormSchema>;

export const SafeForm: React.FC<SafeFormProps> = ({ type }) => {
  const form = useForm<SafeFormType>({
    resolver: zodResolver(SafeFormSchema),
    defaultValues: {
      capital: 0,
      mfn: false,
      proRata: false,
      type: SafeTypeEnum.POST_MONEY,
      status: SafeStatusEnum.ACTIVE,
      issueDate: new Date().toISOString(),
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = (data: SafeFormType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <FormLabel>
            Investor <span className="text-xs">(Stakeholder)</span>
            <p className="text-sm font-normal">
              Please select or create the investor account.
            </p>
          </FormLabel>

          <StakeholderSelector
            onSelect={(value: string) => {
              form.setValue("stakeholderId", value);
            }}
          />
        </div>

        <PrePostSelector
          defaultValue="POST_MONEY"
          onChange={(value: string) => {
            form.setValue("type", value as SafeTypeEnum);
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 mt-5">
          <FormField
            control={form.control}
            name="capital"
            render={({ field }) => {
              const { onChange, ...rest } = field;

              return (
                <FormItem>
                  <FormLabel>Investment amount</FormLabel>

                  <FormControl>
                    <NumericFormat
                      thousandSeparator
                      allowedDecimalSeparators={["%"]}
                      decimalScale={2}
                      prefix={"$  "}
                      {...rest}
                      customInput={Input}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        onChange(floatValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="valuationCap"
            render={({ field }) => {
              const { onChange, ...rest } = field;

              return (
                <FormItem>
                  <FormLabel>
                    Valuation cap <span className="text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator
                      allowedDecimalSeparators={["%"]}
                      decimalScale={2}
                      prefix={"$  "}
                      {...rest}
                      customInput={Input}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        onChange(floatValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investment date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="discountRate"
            render={({ field }) => {
              const { onChange, ...rest } = field;

              return (
                <FormItem>
                  <FormLabel>
                    Discount <span className="text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator
                      allowedDecimalSeparators={["%"]}
                      decimalScale={2}
                      suffix={"  %"}
                      {...rest}
                      customInput={Input}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        onChange(floatValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="capital"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>
                    Pro-rata rights <span className="text-xs">(optional)</span>
                  </FormLabel>

                  <LinearCombobox
                    options={[
                      { value: "true", label: "Include" },
                      { value: "false", label: "Exclude" },
                    ]}
                    onValueChange={(option: {
                      value: string;
                      label: string;
                    }) => {
                      form.setValue("proRata", option.value === "true");
                    }}
                  />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="valuationCap"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>
                    Most favored nation{" "}
                    <span className="text-xs">(optional)</span>
                  </FormLabel>
                  <LinearCombobox
                    options={[
                      { value: "true", label: "Include" },
                      { value: "false", label: "Exclude" },
                    ]}
                    onValueChange={(option: {
                      value: string;
                      label: string;
                    }) => {
                      form.setValue("mfn", option.value === "true");
                    }}
                  />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            {type === "create"
              ? isSubmitting
                ? "Creating SAFE"
                : "Create new SAFE"
              : isSubmitting
                ? "Importing SAFE"
                : "Import existing SAFE"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
