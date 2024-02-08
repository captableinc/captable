"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import { useToast } from "@/components/ui/use-toast";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShareClassMutationSchema,
  type ShareClassMutationType,
} from "@/trpc/routers/share-class/schema";
const formSchema = ShareClassMutationSchema;

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ShareClassFormProps = {
  publicId: string;
  className?: string;
  shareClass?: ShareClassMutationType;
};

const ShareClassForm = ({
  publicId,
  className,
  shareClass = {
    name: "",
    classType: "common",
    initialSharesAuthorized: 0,
    boardApprovalDate: "",
    stockholderApprovalDate: "",
    votesPerShare: 0,
    parValue: 0,
    pricePerShare: 0,
    seniority: 0,
    conversionRights: "convertsToFutureRound",
    convertsToShareClassId: "",
    liquidationPreferenceMultiple: 0,
    participationCapMultiple: 0,
  },
}: ShareClassFormProps) => {
  const {
    id,
    idx,
    name,
    classType,
    initialSharesAuthorized,
    boardApprovalDate,
    stockholderApprovalDate,
    votesPerShare,
    parValue,
    pricePerShare,
    seniority,
    conversionRights,
    convertsToShareClassId,
    liquidationPreferenceMultiple,
    participationCapMultiple,
  } = shareClass;

  const form = useForm<ShareClassMutationType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      idx,
      name,
      classType,
      initialSharesAuthorized,
      boardApprovalDate,
      stockholderApprovalDate,
      votesPerShare,
      parValue,
      pricePerShare,
      seniority,
      conversionRights,
      convertsToShareClassId,
      liquidationPreferenceMultiple,
      participationCapMultiple,
    },
  });

  const { watch } = form;
  const router = useRouter();
  const { toast } = useToast();
  const isSubmitting = form.formState.isSubmitting;
  const watchConversionRights = watch("conversionRights") as string;
  const [renderShareClassInput, setRenderShareClassInput] = useState(false);

  useEffect(() => {
    if (watchConversionRights === "convertsToStockClassId") {
      setRenderShareClassInput(true);
    } else {
      setRenderShareClassInput(false);
    }
  }, [watchConversionRights]);

  const mutation = api.shareClass.create.useMutation({
    onSuccess: async ({ success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully created"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      router.push(`/${publicId}/share-classes`);
    },
  });

  const onSubmit = async (values: ShareClassMutationType) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Card className={cn(className, "mt-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 p-6 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Basic Information:
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Let{`'`}s start with share class name and type.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share class name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="classType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of share class</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="common">Common share</SelectItem>
                          <SelectItem value="preferred">
                            Preferred share
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="initialSharesAuthorized"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorized shares</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 p-6 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Financial Details:
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Specify votes per share, par value, and price per share to
                outline the financial characteristics of the Share Class.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="boardApprovalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board approval date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="stockholderApprovalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stockholder approval date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="votesPerShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votes per share</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="parValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Par value</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="pricePerShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per share</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="seniority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seniority</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 p-6 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Conversion and Preferences:
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Specify seniority, conversion rights, and participation cap
                multiples to highlight conversion options and preferences for
                the Share Class.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="col-span-full">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="conversionRights"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Conversion rights</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="convertsToFutureRound" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Converts to future round
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="convertsToStockClassId" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Converts to specific share class
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-xs font-light" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {
                    // if conversionRights === "convertsToStockClassId"
                    renderShareClassInput && (
                      <div className="sm:col-span-3">
                        <FormField
                          control={form.control}
                          name="convertsToShareClassId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Share class it{`'`}ll convert to
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select existing share class" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {/* <SelectItem value="xxxxxx">xxxxxx</SelectItem>
                              <SelectItem value="yyyyyy">yyyyyy</SelectItem> */}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs font-light" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )
                  }
                </div>
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="liquidationPreferenceMultiple"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquidation preference multiple</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="participationCapMultiple"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participation cap multiple</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6 p-6">
            <Link
              href={`/${publicId}/share-classes`}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </Link>

            <Button
              loading={isSubmitting}
              loadingText="Submitting..."
              type="submit"
            >
              Save and continue
              <RiArrowRightLine className="ml-2 inline-block h-5 w-5" />
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ShareClassForm;
