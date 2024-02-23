"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ProfileSettingsPage = () => {
  const { data } = useSession();
  const form = useForm();

  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          console.log("submit");
        }}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            <Image
              src={data?.user.image ?? "/avatar.svg"}
              alt="User avatar"
              width={50}
              height={50}
              className="h-20 w-20 flex-none rounded-full object-cover"
            />
            <div>
              <Button size="sm" variant={"outline"} type="button">
                Change avatar
              </Button>
              <p className="mt-2 text-xs text-gray-700">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <Input id="name" type="text" {...form.register("name")} />
              <FormMessage></FormMessage>
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Job title</FormLabel>
              <Input id="name" type="text" {...form.register("name")} />
              <FormMessage></FormMessage>
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Login email</FormLabel>
              <Input id="name" type="text" {...form.register("name")} />
              <FormMessage></FormMessage>
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Work email</FormLabel>
              <Input id="name" type="text" {...form.register("name")} />
              <FormMessage></FormMessage>
            </FormItem>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button loadingText="Submitting..." type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileSettingsPage;
