"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const profileSettingsSchema = z.object({
  fullName: z.string().min(2).max(40),
  jobTitle: z.string().min(2).max(30),
  loginEmail: z.string().email(),
  workEmail: z.string().email(),
  avatarUrl: z.string(),
});

const ProfileSettingsPage = () => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const memberProfile = api.member.getProfile.useQuery();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // @ts-expect-error: xxxx
  const form = useForm<z.infer<typeof profileSettingsSchema>>({
    resolver: zodResolver(profileSettingsSchema),
  });

  // @ts-expect-error: xxxx
  const { errors } = form.formState;
  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;
  const canSave: boolean = file ? isDirty || !!file : isDirty;

  // @ts-expect-error: xxxx
  const saveProfileMutation = api.member.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.member.getProfile.invalidate();
      return toast({
        variant: "default",
        title: "Profile changed successfully.",
      });
    },
    onError: () => {
      return toast({
        variant: "destructive",
        title: "Failed updating profile",
        description: "Something went wrong.",
      });
    },
  });

  useEffect(() => {
    if (memberProfile?.data) {
      // @ts-expect-error: xxxx
      form.reset(memberProfile?.data);
    }
  }, [memberProfile?.data, form]);

  const handleImageUpload = async (
    _file: File,
  ): Promise<{ imageUrl: string }> => {
    // const options = {
    //   expiresIn: 3600,
    //   keyPrefix: "opencap",
    //   identifier: "unique-id",
    // };
    // const { key, ...rest } = await uploadFile(file, options);
    // const imageUrl = `${process.env.UPLOAD_ENDPOINT}/${key}`;
    return { imageUrl: "https://avatars.githubusercontent.com/u/456802?v=4" };
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.[0]) {
      const maxSizeInBytes = 1024 * 1024; // 1 MB

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (files[0].size > maxSizeInBytes) {
        return toast({
          variant: "destructive",
          title: "File limit exceeded.",
          description: "File size exceeds the maximum allowed(1 MB)",
        });
      }
      if (!allowedTypes.includes(files[0].type)) {
        return toast({
          variant: "destructive",
          title: "Invalid file format.",
          description: "Allowed types: JPEG, PNG, GIF",
        });
      }
      setFile(files[0]);
    }
  };
  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleRemoveAvatar = () => {
    setFile(null);
  };
  async function onSubmit(values: z.infer<typeof profileSettingsSchema>) {
    const { fullName, jobTitle, loginEmail, workEmail, avatarUrl } = values;
    try {
      if (!file) {
        saveProfileMutation.mutate({
          fullName,
          jobTitle,
          loginEmail,
          workEmail,
          avatarUrl,
        });
      } else {
        const { imageUrl } = await handleImageUpload(file);
        saveProfileMutation.mutate({
          fullName,
          jobTitle,
          loginEmail,
          workEmail,
          avatarUrl: imageUrl,
        });
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            <Image
              src={memberProfile?.data?.avatarUrl ?? "/avatar.svg"}
              alt="User avatar"
              width={50}
              height={50}
              className="h-20 w-20 flex-none rounded-full object-cover"
            />
            <div className="flex items-start space-x-3">
              <div>
                <Button
                  onClick={handleAvatarChange}
                  size="sm"
                  variant={"outline"}
                  type="button"
                >
                  Change avatar
                </Button>
                <Input
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <p className="mt-2 text-xs text-gray-700">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
              <>
                {file && (
                  <div className="flex items-center space-x-2">
                    <p className="mt-2 text-sm text-green-700">
                      {file.name.length > 12
                        ? `${file.name.slice(0, 12)}.. .${file.type} selected`
                        : `${file.name} selected`}
                    </p>
                    <Button
                      onClick={handleRemoveAvatar}
                      variant={"outline"}
                      className="border-none text-xl text-red-600 hover:bg-white hover:text-slate-600"
                      size={"sm"}
                    >
                      x
                    </Button>
                  </div>
                )}
              </>
            </div>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <Input id="name" type="text" {...form.register("fullName")} />
              {errors.fullName && (
                <FormMessage>{errors.fullName.message}</FormMessage>
              )}
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Job title</FormLabel>
              <Input id="name" type="text" {...form.register("jobTitle")} />
              {errors.jobTitle && (
                <FormMessage>{errors.jobTitle.message}</FormMessage>
              )}
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Login email</FormLabel>
              <Input id="name" type="text" {...form.register("loginEmail")} />
              {errors.loginEmail && (
                <FormMessage>{errors.loginEmail.message}</FormMessage>
              )}
            </FormItem>
          </div>

          <div className="sm:col-span-3">
            <FormItem>
              <FormLabel htmlFor="name">Work email</FormLabel>
              <Input id="name" type="text" {...form.register("workEmail")} />
              {errors.workEmail && (
                <FormMessage>{errors.workEmail.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            disabled={isSubmitting || !canSave}
            loading={isSubmitting}
            loadingText="Saving..."
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileSettingsPage;
