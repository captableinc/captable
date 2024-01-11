"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const onboardingSchema = z.object({
  user: z.object({
    firstName: z.string().min(1, {
      message: "First name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required",
    }),
    companyName: z.string().min(1, {
      message: "Company name is required",
    }),
    title: z.string().min(1, {
      message: "Title is required",
    }).optional(),
  }),
  company: z.object({
    incorporationType: z.string().min(1, {
      message: "Incorporation type is required",
    }),
    incorporationDate: z.string().min(1, {
      message: "Incorporation date is required",
    }),
    incorporationCountry: z.string().min(1, {
      message: "Incorporation country is required",
    }),
    incorporationState: z.string().min(1, {
      message: "Incorporation state is required",
    }),
    streetAddress: z.string().min(1, {
      message: "Street address is required",
    }),
    city: z.string().min(1, {
      message: "City is required",
    }),
    state: z.string().min(1, {
      message: "State is required",
    }),
    zipcode: z.string().min(1, {
      message: "Zipcode is required",
    }),
  }),
});

const OnboardingCompany = () => {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      user: {
        firstName: "",
        lastName: "",
        companyName: "",
        title: "",
      },
      company: {
        incorporationType: "",
        incorporationDate: "",
        incorporationCountry: "",
        incorporationState: "",
        streetAddress: "",
        city: "",
        state: "",
        zipcode: "",
      }
    },
  });

  function onSubmit(values: z.infer<typeof onboardingSchema>) {
    alert(JSON.stringify(values, null, 2))
  };

  return (
    <div className="min-h-screen flex  justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pt-20 pb-5 px-5">
      <Navbar />
      <div className="max-w-2xl w-full p-10 border border-rounded bg-white shadow">
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
                    name="user.companyName"
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

                <h2 className="text-xl">
                  Company Incorporation details
                </h2>
                <p className="text-sm text-muted-foreground -mt-5">
                  Please provide your company{`'`}s incorporation details. Your certificate of incorporation will come in handy here.
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
                <h2 className="text-xl">
                  Company Address
                </h2>
                <p className="text-sm text-muted-foreground -mt-5">
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
              <Button type="submit" className="mt-5">Complete Setup</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
};

export default OnboardingCompany;
