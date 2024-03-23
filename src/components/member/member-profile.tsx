/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type z } from "zod";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import React, { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/common/uploads";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/loading";
import {
  compareFormDataWithInitial,
  isFileExists,
  validateFile,
} from "@/lib/utils";
import { profileSettingsSchema } from "@/lib/zodSchemas";
import { PayloadType } from "@/lib/constants";
import { type RootPayload } from "@/lib/types";
import { type RouterOutputs } from "@/trpc/shared";

type MemberProfile = RouterOutputs["member"]["getProfile"];

type ProfileType = {
  memberProfile: MemberProfile;
};

export const ProfileSettings = ({ memberProfile }: ProfileType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSettingsSchema>>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      fullName: memberProfile.fullName,
      loginEmail: memberProfile.loginEmail,
      workEmail: memberProfile.workEmail ?? "",
      jobTitle: memberProfile.jobTitle ?? "",
    },
  });

  const errors = form.formState.errors;
  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  const saveProfileMutation = api.member.updateProfile.useMutation({
    onSuccess: async (message, rootPayload: RootPayload) => {
      if (!message?.success) return;

      const { fullName, loginEmail } = memberProfile;

      switch (rootPayload.type) {
        case PayloadType.PROFILE_DATA:
          const updatedProfilePayload = rootPayload.payload;

          if (
            loginEmail !== updatedProfilePayload.loginEmail ||
            fullName !== updatedProfilePayload.fullName
          ) {
            const updateUser = {
              ...session,
              user: {
                ...session?.user,
                name: updatedProfilePayload.fullName,
                email: updatedProfilePayload.loginEmail,
              },
            };
            await update(updateUser);
          }

          form.reset(updatedProfilePayload);

          router.refresh();

          break;

        case PayloadType.PROFILE_AVATAR:
          const _updatedProfilePayload = rootPayload.payload;

          const updateUser = {
            ...session,
            user: {
              ...session?.user,
              image: _updatedProfilePayload.avatarUrl,
            },
          };

          await update(updateUser);

          break;

        default:
          break;
      }

      toast({
        variant: "default",
        title: "🎉 Successfully updated your profile",
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

  async function handleImageUpload(file: File): Promise<{ imageUrl: string }> {
    if (session?.user.id) {
      const options = {
        expiresIn: 3600,
        keyPrefix: "profile-avatars",
        identifier: session.user.id,
      };
      const { fileUrl } = await uploadFile(file, options, "publicBucket");

      return { imageUrl: fileUrl };
    }

    return { imageUrl: "" };
  }

  const handleFileChangeAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { file } = isFileExists(event);

    if (!file) return;

    const { isValid, title, errorMessage } = validateFile(file);

    if (isValid) {
      try {
        setLoading(true);
        const { imageUrl } = await handleImageUpload(file);

        if (!imageUrl) {
          return toast({
            variant: "destructive",
            title: "Failed uploading the image.",
            description: "Please try again later.",
          });
        }

        saveProfileMutation.mutate({
          type: PayloadType.PROFILE_AVATAR,
          payload: {
            avatarUrl: imageUrl,
          },
        });
      } catch (error) {
        console.error("Something went wrong", error);
        toast({
          variant: "destructive",
          title: "Failed uploading image.",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: title,
        description: errorMessage,
      });

      return;
    }
  };

  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  async function onSubmit(values: z.infer<typeof profileSettingsSchema>) {
    // React Hook Form considers trailing-spaces as change in form-state
    const hasChanged = compareFormDataWithInitial(memberProfile, values);

    if (!hasChanged) return;

    const { fullName, jobTitle, loginEmail, workEmail } = values;

    try {
      setLoading(true);
      saveProfileMutation.mutate({
        type: PayloadType.PROFILE_DATA,
        payload: {
          fullName,
          jobTitle,
          loginEmail,
          workEmail,
        },
      });
    } catch (error) {
      console.warn(error);
      toast({
        variant: "destructive",
        title: "Failed updating profile.",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage
                src={session?.user?.image || "placeholders/user.svg"}
              />
            </Avatar>

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
                  onChange={handleFileChangeAndUpload}
                  ref={fileInputRef}
                />
                <p className="mt-2 text-xs text-gray-700">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
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
            disabled={isSubmitting || !isDirty}
            loading={isSubmitting}
            loadingText="Saving..."
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>

      {loading && <Loading />}
    </Form>
  );
};
