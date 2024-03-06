/* eslint-disable @next/next/no-img-element */
"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiArrowRightLine, RiBuildingLine } from "@remixicon/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ZodOnboardingMutationSchema,
  type TypeZodOnboardingMutationSchema,
} from "@/trpc/routers/onboarding-router/schema";

import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import countries from "@/lib/countries";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { type RouterOutputs } from "@/trpc/shared";
import { dayjsExt } from "@/common/dayjs";

const formSchema = ZodOnboardingMutationSchema;

type CompanyFormProps =
  | {
      type: "edit";
      data: RouterOutputs["company"]["getCompany"];
    }
  | {
      type: "create";
      data?: never;
    }
  | {
      type: "onboarding";
      data?: never;
    };

export const CompanyForm = ({ type, data }: CompanyFormProps) => {
  const { update, data: user } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TypeZodOnboardingMutationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        email: type === "onboarding" ? user?.user.email ?? "" : undefined,
        name: type === "onboarding" ? user?.user.name ?? "" : undefined,
        title: type !== "create" ? data?.title ?? "" : undefined,
      },
      company: {
        city: data?.company.city ?? "",
        incorporationCountry: data?.company.incorporationCountry ?? "",
        incorporationDate: data?.company.incorporationDate
          ? dayjsExt(data.company.incorporationDate).format("YYYY-MM-DD")
          : "",
        incorporationState: data?.company.incorporationState ?? "",
        incorporationType: data?.company.incorporationType ?? "",
        name: data?.company.name ?? "",
        state: data?.company.state ?? "",
        streetAddress: data?.company.streetAddress ?? "",
        zipcode: data?.company.zipcode ?? "",
      },
    },
  });

  const onBoardingMutation = api.onboarding.onboard.useMutation({
    onSuccess: async ({ publicId }) => {
      await update();

      router.push(`/${publicId}`);
    },
  });

  const companySettingMutation = api.company.updateCompany.useMutation({
    onSuccess: async ({ success, message }) => {
      await update();

      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully updated"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      router.refresh();
    },
  });

  async function onSubmit(values: TypeZodOnboardingMutationSchema) {
    try {
      if (type === "create" || type === "onboarding") {
        await onBoardingMutation.mutateAsync(values);
      } else if (type === "edit") {
        await companySettingMutation.mutateAsync(values);
      }
    } catch (error) {}
  }

  const isSubmitting = form.formState.isSubmitting;

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="col-span-full flex items-center gap-x-8">
          {user?.user.image ? (
            <img
              src={user.user.image}
              alt="Company logo"
              width={50}
              height={50}
              className="flex-none rounded-full object-cover"
            />
          ) : (
            <div className="h-30 w-30 flex items-center rounded-full bg-[#CCFBF1] p-2">
              <RiBuildingLine className="h-16 w-16 flex-none shrink-0 rounded-full object-cover text-[#14B8A6]" />
            </div>
          )}
          <div>
            <Button size="sm" variant={"outline"} type="button">
              {type === "edit" ? "Change company logo" : "Upload company logo"}
            </Button>
            <p className="mt-2 text-xs text-gray-700">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="grid gap-5">
            {type === "onboarding" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="user.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your full name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your work email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />

              {(type === "onboarding" || type === "create") && (
                <FormField
                  control={form.control}
                  name="user.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Job title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <hr />

            <h2 className="text-xl">Company incorporation details</h2>
            <p className="-mt-5 text-sm text-muted-foreground">
              Please provide your company{`'`}s incorporation details. Your
              certificate of incorporation will come in handy here.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company.incorporationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incorporation type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="llc">
                          Limited Liability Company
                        </SelectItem>
                        <SelectItem value="c-corp">C Corporation</SelectItem>
                        <SelectItem value="s-corp">S Corporation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.incorporationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incorporation date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company.incorporationCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incorporation country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(
                          (country: { code: string; name: string }) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.incorporationState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incorporation state</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>

            {/*  */}
            <h2 className="text-xl">Company address</h2>
            <p className="-mt-5 text-sm text-muted-foreground">
              Please provide your company{`'`}s address.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company.streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Submitting..."
              type="submit"
              className={cn(
                type === "onboarding" || type === "create" ? "w-full" : "",
              )}
            >
              {type === "onboarding" || type === "create" ? (
                <>
                  Complete Setup
                  <RiArrowRightLine className="ml-2 inline-block h-5 w-5" />
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
