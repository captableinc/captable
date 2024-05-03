"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

const schema = z.object({
  email: z.string().min(1, "Email is required").email(),
  publicId: z.string().min(1, "Public Id is required"),
});

export async function provideRequestAccess(_: unknown, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    publicId: formData.get("publicId"),
  });

  if (!validatedFields.success) {
    return {
      emailError: validatedFields.error.flatten().fieldErrors.email,
    };
  }

  const { publicId } = validatedFields.data;

  const documentShare = await db.documentShare.findFirst({
    where: {
      publicId,
    },
  });

  if (!documentShare) {
    return notFound();
  }

  await db.documentShare.update({
    where: {
      id: documentShare.id,
    },
    data: {
      emailProtected: false,
    },
  });

  revalidatePath(`/document/${publicId}`);

  return {
    emailError: "",
  };
}
