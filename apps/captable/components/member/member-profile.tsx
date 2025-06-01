/* eslint-disable @next/next/no-img-element */
"use client";

import Loading from "@/components/common/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/common/uploads";
import { PayloadType } from "@/lib/types";
import type { RootPayload } from "@/lib/types";
import {
  compareFormDataWithInitial,
  isFileExists,
  validateFile,
} from "@/lib/utils";
import { profileSettingsSchema } from "@/lib/zodSchemas";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { clientSideSession } from "@captable/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type MemberProfile = RouterOutputs["member"]["getProfile"];

type ProfileType = {
  memberProfile: MemberProfile;
};

export const ProfileSettings = ({ memberProfile }: ProfileType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, refetch } = clientSideSession();
  const router = useRouter();
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
        case PayloadType.PROFILE_DATA: {
          const updatedProfilePayload = rootPayload.payload;

          if (
            loginEmail !== updatedProfilePayload.loginEmail ||
            fullName !== updatedProfilePayload.fullName
          ) {
            await refetch();
          }

          form.reset(updatedProfilePayload);

          router.refresh();

          break;
        }

        case PayloadType.PROFILE_AVATAR: {
          const _updatedProfilePayload = rootPayload.payload;

          await refetch();

          break;
        }

        default:
          break;
      }

      toast.success("🎉 Successfully updated your profile");
    },
    onError: () => {
      return toast.error("Error updating profile");
    },
  });

  async function handleImageUpload(file: File): Promise<{ imageUrl: string }> {
    if (session?.user.id) {
      const { fileUrl } = await uploadFile(
        file,
        {
          expiresIn: 3600,
          keyPrefix: "profile-avatars",
          identifier: session.user.id,
        },
        "publicBucket",
      );

      return { imageUrl: fileUrl };
    }

    return { imageUrl: "" };
  }

  const handleFileChangeAndUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { file } = isFileExists(event);

    if (!file) return;

    const { isValid, errorMessage } = validateFile(file);

    if (isValid) {
      try {
        setLoading(true);
        const { imageUrl } = await handleImageUpload(file);

        if (!imageUrl) {
          return toast.error("Failed uploading the image.");
        }

        saveProfileMutation.mutate({
          type: PayloadType.PROFILE_AVATAR,
          payload: {
            avatarUrl: imageUrl,
          },
        });
      } catch (error) {
        console.error("Something went wrong", error);
        toast.error("Failed uploading image.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(errorMessage);
      return;
    }
  };

  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function onSubmit(values: z.infer<typeof profileSettingsSchema>) {
    // React Hook Form considers trailing-spaces as change in form-state
    const memberProfileFormFields = {
      fullName: memberProfile.fullName,
      jobTitle: memberProfile.jobTitle ?? "",
      loginEmail: memberProfile.loginEmail,
      workEmail: memberProfile.workEmail ?? "",
    };
    const hasChanged = compareFormDataWithInitial(
      memberProfileFormFields,
      values,
    );

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
      toast.error("Failed updating profile.");
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
                src={session?.user?.image || "/placeholders/user.svg"}
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
                <p className="mt-2 text-xs text-muted-foreground">
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
