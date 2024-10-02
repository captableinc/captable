"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import HelpTooltip from "@/components/common/help-tooltip";
import SlideOver from "@/components/common/slide-over";
import { BankAccountSelector } from "@/components/selector/bank-account-selector";
import { InvestorSelector } from "@/components/selector/investor-selector";
import { MemberSelector } from "@/components/selector/member-selector";
import { Button } from "@/components/ui/button";
import { LinearCombobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { SafeStatusEnum, SafeTypeEnum } from "@/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { PrePostSelector } from "./pre-post-selector";

// Safe document preview
import { PostMoneyDiscount } from "@/components/safe/templates";
import { createSafe } from "@/server/api/client-handlers/safe";
import { PDFViewer } from "@react-pdf/renderer";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type SafeFormProps = {
  type: "create" | "import";
};

const SafeFormSchema = z.object({
  type: z.nativeEnum(SafeTypeEnum),
  status: z.nativeEnum(SafeStatusEnum),
  capital: z.coerce.number(),
  valuationCap: z.coerce.number().optional(),
  discountRate: z.coerce.number().optional(),
  mfn: z.boolean().optional().default(false),
  proRata: z.boolean().optional().default(false),
  issueDate: z.string().date(),
  signerStakeholderId: z.string(),
  signerMemberId: z.string(),
  bankAccountId: z.string(),
});

type SafeFormType = z.infer<typeof SafeFormSchema>;

const placeholder = "________________________________________";

export const SafeForm: React.FC<SafeFormProps> = ({ type }) => {
  const { data: session } = useSession();
  const { mutate } = useMutation(createSafe);

  const form = useForm<SafeFormType>({
    resolver: zodResolver(SafeFormSchema),
    defaultValues: {
      mfn: false,
      proRata: false,
      type: SafeTypeEnum.POST_MONEY,
      status: SafeStatusEnum.ACTIVE,
      issueDate: new Date().toISOString(),
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = (data: SafeFormType) => {
    mutate({
      json: { ...data },
      urlParams: { companyId: session?.user.companyId ?? "" },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-2"
      >
        <PrePostSelector
          defaultValue="POST_MONEY"
          onChange={(value: string) => {
            form.setValue("type", value as SafeTypeEnum);
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 mt-5">
          <FormField
            control={form.control}
            name="signerMemberId"
            render={() => {
              return (
                <FormItem>
                  <FormLabel className="inline-flex">
                    Team member{" "}
                    <HelpTooltip
                      className="ml-2"
                      text="Team member responsible for signing the SAFE agreement"
                    />
                  </FormLabel>
                  <MemberSelector
                    onSelect={(value: string) => {
                      form.setValue("signerMemberId", value);
                    }}
                  />

                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="signerStakeholderId"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>Investor</FormLabel>
                  <InvestorSelector
                    onSelect={(value: string) => {
                      form.setValue("signerStakeholderId", value);
                    }}
                  />
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="bankAccountId"
            render={() => {
              return (
                <FormItem>
                  <FormLabel className="inline-flex">
                    Bank account
                    <HelpTooltip
                      className="ml-2"
                      text="Bank account with wiring details to receive the investment"
                    />
                  </FormLabel>
                  <BankAccountSelector
                    onSelect={(value: string) => {
                      form.setValue("bankAccountId", value);
                    }}
                  />

                  <FormMessage className="text-xs font-light" />
                </FormItem>
              );
            }}
          />
        </div>

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
            name="proRata"
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
            name="mfn"
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

        <div className="mt-8 flex justify-end gap-4">
          <SlideOver
            title="Preview SAFE"
            subtitle="Review the SAFE agreement generated based on the information provided."
            size="3xl"
            trigger={
              <Button variant="outline" type="button">
                Preview
              </Button>
            }
          >
            <PDFViewer className="w-full h-screen border-none rounded-md">
              <PostMoneyDiscount
                options={{
                  author: "Y Combinator",
                  creator: "Captable, Inc.",
                  producer: "Captable, Inc.",
                  title: "YC SAFE - Post Money Discount",
                  subject: "YC SAFE - Post Money Discount",
                  keywords: "YC, SAFE, Post Money, Discount",
                }}
                investor={{
                  name: placeholder,
                  email: placeholder,
                  address: placeholder,
                  signature: placeholder,
                  title: placeholder,
                }}
                sender={{
                  email: placeholder,
                  name: placeholder,
                  title: placeholder,
                  signature: placeholder,
                }}
                investment={100000}
                valuation={1000000}
                date={new Date().toISOString()}
                company={{
                  name: "Company Inc.",
                  state: "CA",
                }}
              />
            </PDFViewer>
          </SlideOver>

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            {type === "create"
              ? isSubmitting
                ? "Creating SAFE"
                : "Create a new SAFE agreement"
              : isSubmitting
                ? "Importing SAFE"
                : "Import existing SAFE"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
