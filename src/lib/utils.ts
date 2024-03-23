import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileSizeSuffix(bytes: number): string {
  const suffixes = ["", "K", "M", "G", "T"];
  const magnitude = Math.floor(Math.log2(bytes) / 10);
  const suffix = suffixes[magnitude] + "B";
  return suffix;
}

export function isFileExists(event: React.ChangeEvent<HTMLInputElement>): {
  file: File | undefined;
} {
  const file =
    event.target.files && event.target.files.length > 0
      ? event.target.files[0]
      : undefined;

  return { file };
}

export function validateFile(file: File): {
  isValid: boolean;
  title: string;
  errorMessage: string;
} {
  const maxSizeInBytes = 1024 * 1024; // 1 MB

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      title: "File limit exceeded.",
      errorMessage: "File size exceeds the maximum allowed (1 MB)",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      title: "Invalid file format.",
      errorMessage: "Invalid file format. Allowed types: JPEG, PNG, GIF",
    };
  }

  return {
    isValid: true,
    title: "",
    errorMessage: "",
  };
}

// Function to remove trailing spaces and compare changes
export function compareFormDataWithInitial<T extends Record<string, string>>(
  initial: T,
  form: T,
): boolean {
  const cleanedFormData = Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim()]),
  ) as T;

  const isChanged = Object.entries(cleanedFormData).some(
    ([key, value]) => initial[key]?.trim() !== value,
  );

  return isChanged;
}
