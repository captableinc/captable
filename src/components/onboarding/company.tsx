"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const onboardingSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  companyName: z.string().min(2),
  title: z.string().min(2),
  incorporationType: z.string().min(2),
  incorporationDate: z.string().min(2),
  incorporationCountry: z.string().min(2),
  incorporationState: z.string().min(2),
  streetAddress: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  zipcode: z.string().min(2),
})

const OnboardingCompany = () => {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      title: "",
      incorporationType: "",
      incorporationDate: "",
      incorporationCountry: "",
      incorporationState: "",
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
    },
  })

  function onSubmit(values: z.infer<typeof onboardingSchema>) {
    console.log(values)
  }

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
                    name="firstName"
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
                    name="lastName"
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
                    name="companyName"
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
                    name="title"
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
                    name="incorporationType"
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
                    name="incorporationDate"
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
                    name="incorporationCountry"
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
                    name="incorporationState"
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
                    name="streetAddress"
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
                    name="city"
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
                    name="state"
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
                    name="zipcode"
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
              <Button type="submit">Complete Setup</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
};

export default OnboardingCompany;
