"use client";

import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  ShareClassMutationSchema,
  type ShareClassMutationType,
} from "@/trpc/routers/share-class/schema";

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = ShareClassMutationSchema;

type ShareClassFormType = {
  type?: string;
  className?: string;
  setOpen: (val: boolean) => void;
  shareClass?: ShareClassMutationType;
};

const ShareClassForm = ({
  setOpen,
  className,
  type = "create",
  shareClass = {
    id: "",
    name: "",
    classType: "common",
    initialSharesAuthorized: 0,
    boardApprovalDate: new Date(),
    stockholderApprovalDate: new Date(),
    votesPerShare: 0,
    parValue: 0,
    pricePerShare: 0,
    seniority: 0,
    conversionRights: "convertsToFutureRound",
    convertsToShareClassId: "",
    liquidationPreferenceMultiple: 0,
    participationCapMultiple: 0,
  },
}: ShareClassFormType) => {
  const form = useForm<ShareClassMutationType>({
    resolver: zodResolver(formSchema),
    defaultValues: shareClass,
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

  const createMutation = api.shareClass.create.useMutation({
    onSuccess: async ({ success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully created"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const updateMutation = api.shareClass.update.useMutation({
    onSuccess: async ({ success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully updated"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const onSubmit = async (values: ShareClassMutationType) => {
    type === "create"
      ? await createMutation.mutateAsync(values)
      : await updateMutation.mutateAsync(values);
  };

  const parseBigInt = (value: number) => {
    return Number(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6 md:col-span-2">
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
                      <SelectItem value="preferred">Preferred share</SelectItem>
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
                    <Input
                      {...field}
                      type="number"
                      value={parseBigInt(field.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="boardApprovalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board approval date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
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
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
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

          <div className="sm:col-span-3">
            {
              // if conversionRights === "convertsToStockClassId"
              renderShareClassInput && (
                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="convertsToShareClassId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Share class it{`'`}ll convert to</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value!}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select existing share class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>No share classes</SelectLabel>
                              {/* <SelectItem value="xxxxxx">xxxxxx</SelectItem> */}
                            </SelectGroup>
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

        <div className="mt-8 flex justify-end">
          <Button
            loading={isSubmitting}
            loadingText="Submitting..."
            type="submit"
          >
            {
              {
                create: "Create share class",
                update: "Update share class",
              }[type]
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShareClassForm;
