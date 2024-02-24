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
import { RiArrowRightLine } from "@remixicon/react";
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
import type { User } from "next-auth";

import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import countries from "@/lib/countries";
import { cn } from "@/lib/utils";

const formSchema = ZodOnboardingMutationSchema;

type CompanyFormProps = {
  formType?: "onboarding" | "create-company" | "edit-company";
  currentUser: User;
};

const CompanyForm = ({ currentUser, formType }: CompanyFormProps) => {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<TypeZodOnboardingMutationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        title: "",
      },
      company: {
        name: "",
        incorporationType: "",
        incorporationDate: "",
        incorporationCountry: "",
        incorporationState: "",
        streetAddress: "",
        city: "",
        state: "",
        zipcode: "",
      },
    },
  });

  const mutation = api.onboarding.onboard.useMutation({
    onSuccess: async ({ publicId }) => {
      await update();

      router.push(`/${publicId}`);
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TypeZodOnboardingMutationSchema) {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {}
  }

  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-2">
          <div className="grid gap-5">
            {formType === "onboarding" && (
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              loading={isSubmitting}
              loadingText="Submitting..."
              type="submit"
              className={cn(
                formType === "onboarding" || formType === "create-company"
                  ? "w-full"
                  : "",
              )}
            >
              {formType === "onboarding" || formType === "create-company" ? (
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

export default CompanyForm;
