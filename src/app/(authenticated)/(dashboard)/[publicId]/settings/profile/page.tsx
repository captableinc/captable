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
import { useSession } from "next-auth/react";
import { uploadFile } from "@/common/uploads";
import { env } from "@/env";

enum PayloadType {
  PROFILE_DATA = "profile-data",
  PROFILE_AVATAR = "profile-avatar",
}

type ProfilePayload = {
  type: PayloadType.PROFILE_DATA;
  payload: {
    fullName: string;
    jobTitle: string;
    loginEmail: string;
    workEmail: string;
  };
};

type AvatarPayload = {
  type: PayloadType.PROFILE_AVATAR;
  payload: {
    avatarUrl: string;
  };
};

type RootPayload = ProfilePayload | AvatarPayload;

type MemberProfile = {
  data: {
    fullName: string;
    jobTitle: string;
    loginEmail: string;
    workEmail: string;
    avatarUrl: string;
  };
};

const profileSettingsSchema = z.object({
  fullName: z.string().min(2).max(40),
  jobTitle: z.string().min(2).max(30),
  loginEmail: z.string().email().min(2),
  workEmail: z.string().email().min(2),
});

const ProfileSettingsPage = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const utils = api.useUtils();
  // @ts-expect-error xxxx
  const memberProfile: MemberProfile = api.member.getProfile.useQuery();

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // @ts-expect-error: xxxx
  const form = useForm<z.infer<typeof profileSettingsSchema>>({
    resolver: zodResolver(profileSettingsSchema),
  });

  // @ts-expect-error: xxxx
  const { errors } = form.formState;
  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;
  const canSave: boolean = avatarUrl ? !!avatarUrl : isDirty;

  const saveProfileMutation = api.member.updateProfile.useMutation({
    // @ts-expect-error xxxx
    onSuccess: async (
      message: { success: boolean },
      rootPayload: RootPayload,
    ) => {
      if (!message.success) return;

      const { fullName, loginEmail } = memberProfile.data;

      switch (rootPayload.type) {
        case PayloadType.PROFILE_DATA:
          console.log("ran-profile-data");

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

          await utils.member.getProfile.invalidate();

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
          console.log("Updating session");
          await update(updateUser);

          break;

        default:
          break;
      }

      toast({
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
    file: File,
  ): Promise<{ imageUrl: string }> => {
    const options = {
      expiresIn: 3600,
      keyPrefix: "profile-avatars",
      //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      identifier: session?.user.id!,
    };
    const { key } = await uploadFile(file, options, "publicBucket");

    const s3BaseURL = `https://${env.PUBLIC_UPLOAD_BUCKET}.s3.amazonaws.com`;

    const imageUrl = `${s3BaseURL}/${key}`;
    // const imageUrl = "https://avatars.githubusercontent.com/u/8019099?s=64&v=4";

    return { imageUrl };
  };

  const validateFile = (file: File) => {
    const maxSizeInBytes = 1024 * 1024; // 1 MB

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file.size > maxSizeInBytes) {
      toast({
        variant: "destructive",
        title: "File limit exceeded.",
        description: "File size exceeds the maximum allowed(1 MB)",
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file format.",
        description: "Allowed types: JPEG, PNG, GIF",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files && event.target.files.length > 0
        ? event.target.files[0]
        : null;

    if (!file) return;

    const canUpload = validateFile(file);

    if (canUpload) {
      try {
        const { imageUrl } = await handleImageUpload(file);

        if (!imageUrl) {
          return toast({
            variant: "destructive",
            title: "Failed uploading the image.",
            description: "Please try again later.",
          });
        }

        setAvatarUrl(imageUrl);
      } catch (error) {
        console.error("Something went wrong", error);
        toast({
          variant: "destructive",
          title: "Failed uploading image.",
          description: "Please try again later.",
        });
      }
    }
  };

  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  async function onSubmit(values: z.infer<typeof profileSettingsSchema>) {
    if (avatarUrl) {
      saveProfileMutation.mutate({
        type: PayloadType.PROFILE_AVATAR,
        payload: {
          avatarUrl,
        },
      });
      setAvatarUrl("");
      return;
    }

    const { fullName, jobTitle, loginEmail, workEmail } = values;

    saveProfileMutation.mutate({
      type: PayloadType.PROFILE_DATA,
      payload: {
        fullName,
        jobTitle,
        loginEmail,
        workEmail,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            <Image
              src={session?.user.image ?? "/avatar.svg"}
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
                  disabled={!!avatarUrl}
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
                {avatarUrl && (
                  <div className="flex items-center space-x-2">
                    <p className="mt-2 rounded-md bg-yellow-100 px-2 text-sm text-green-700">
                      {avatarUrl.length > 12
                        ? `${avatarUrl.slice(0, 16)}.jpg  (Uploaded successfully)`
                        : `${avatarUrl}.jpg  (Uploaded successfully)`}
                    </p>
                    <Button
                      onClick={handleRemoveAvatar}
                      variant={"outline"}
                      className="mt-1 border-none text-xl text-red-600 hover:bg-white hover:text-slate-600"
                      size={"sm"}
                    >
                      <p className="font-bold">X</p>
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
            disabled={!!isSubmitting || !canSave}
            loading={!!isSubmitting}
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
