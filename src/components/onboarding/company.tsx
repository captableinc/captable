"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ZodOnboardingMutationSchema,
  type TypeZodOnboardingMutationSchema,
} from "@/trpc/routers/onboarding-router/schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { api } from "@/trpc/react";

const formSchema = ZodOnboardingMutationSchema;

const OnboardingCompany = () => {
  const form = useForm<TypeZodOnboardingMutationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        firstName: "",
        lastName: "",
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

  const mutation = api.onboarding.onboard.useMutation();

  // 2. Define a submit handler.
  function onSubmit(values: TypeZodOnboardingMutationSchema) {
    mutation.mutate(values);
  }
  return (
    <div className="flex min-h-screen  justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-20">
      <Navbar />
      <div className="border-rounded w-full max-w-2xl border bg-white p-10 shadow">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to OpenCap!
          </h1>
          <p className="text-sm text-muted-foreground">
            You are almost there. Please complete the form below to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-2">
              <div className="grid gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <hr />

                <h2 className="text-xl">Company Incorporation details</h2>
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
                        <FormLabel>Incorporation Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company.incorporationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incorporation Date</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel>Incorporation Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company.incorporationState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incorporation State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/*  */}
                <h2 className="text-xl">Company Address</h2>
                <p className="-mt-5 text-sm text-muted-foreground">
                  Please provide your company{`'`}s address.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company.streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="mt-5">
                Complete Setup
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OnboardingCompany;
