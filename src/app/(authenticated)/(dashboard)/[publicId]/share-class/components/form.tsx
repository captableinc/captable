import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    prefix: "CS",
    classType: "common",
    initialSharesAuthorized: 0,
    boardApprovalDate: "",
    stockholderApprovalDate: "",
    votesPerShare: 0,
    parValue: 0,
    pricePerShare: 0,
    seniority: 0,
    convertsToFutureRound: false,
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
    prefix,
    initialSharesAuthorized,
    boardApprovalDate,
    stockholderApprovalDate,
    votesPerShare,
    parValue,
    pricePerShare,
    seniority,
    convertsToFutureRound,
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
      prefix,
      initialSharesAuthorized,
      boardApprovalDate,
      stockholderApprovalDate,
      votesPerShare,
      parValue,
      pricePerShare,
      seniority,
      convertsToFutureRound,
      convertsToShareClassId,
      liquidationPreferenceMultiple,
      participationCapMultiple,
    },
  });

  return (
    <Card className={cn(className)}>
      <Form {...form}>
        <form>
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
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share class name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="initialSharesAuthorized"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorized shares</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
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
                    <FormField
                      control={form.control}
                      name="boardApprovalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board approval date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="boardApprovalDate"
                  render={({ field }) => (
                    <FormField
                      control={form.control}
                      name="stockholderApprovalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stockholder approval date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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

            <div className="max-w-2xl space-y-10 md:col-span-2">
              <div className="sm:col-span-3">
                {/*  */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Notify me about...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              All new messages
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mentions" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Direct messages and mentions
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Nothing
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/*  */}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6 p-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ShareClassForm;
