import { UpdateStatusEnum } from "@/prisma-enums";
import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";
import { type Recipient, type Stakeholder, type Stakeholders } from "./types";

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

//################################ INVESTOR UPDATES HELPERS #############################################

export async function onCopyClipboard(text: string) {
  if ("clipboard" in navigator) {
    await navigator.clipboard.writeText(text);
  }
}
export function getShareableUpdateLink(
  companyPublicId: string,
  updatePublicId: string,
): string {
  return `http://localhost:3000/${companyPublicId}/updates/${updatePublicId}`;
}
export function splitBySlash(val: string) {
  return val.split("/");
}

export function splitByHash(val: string) {
  return val.split("#");
}

export function getLastPart(splitted: string[]) {
  return splitted[splitted.length - 1];
}

export function objectifyIdAndEmail(
  stakeholderIds: string[],
  stakeholders: Stakeholder[],
): { id: string; email: string }[] {
  const idMap = new Map(
    stakeholders.map((stakeholder: Stakeholder) => [
      stakeholder.id,
      stakeholder,
    ]),
  );
  const filteredStakeholders = stakeholderIds
    .map((id) => idMap.get(id))
    .filter(Boolean);
  //@ts-expect-error error
  return filteredStakeholders.map(({ id, email }) => ({ id, email }));
}

export function joinIdAndNameByHash(id: string, name: string) {
  return `${id}#${name}`;
}

export function getFormattedRecipients(recipients: Recipient[]): string[] {
  return recipients.map((x: Recipient) =>
    joinIdAndNameByHash(x.stakeholderId, x.stakeholder.name),
  );
}

export function getFormattedStakeholders(recipients: Stakeholders): string[] {
  return recipients.map((x) => joinIdAndNameByHash(x.id, x.name));
}

export function checkEmailUnsending(
  dbRecipients: Recipient[],
  selectedRecipients: string[],
): boolean {
  const _dbRecipients = getFormattedRecipients(dbRecipients);
  const set = new Set(selectedRecipients);
  return !_dbRecipients.every((x) => set.has(x));
}

export function isIllegalDeselect(
  dbRecipients: Recipient[],
  singleRecipient: string,
) {
  const _dbRecipients = getFormattedRecipients(dbRecipients);
  return !_dbRecipients.some((x) => x === singleRecipient);
}

export function getNewSelectedRecipients(
  previousRecipients: Recipient[],
  currentRecipients: string[],
) {
  const previous = getFormattedRecipients(previousRecipients);
  if (previous.length) {
    const selectedSet = new Set(previous);
    return currentRecipients.filter((x) => !selectedSet.has(x));
  }
}

export function getSanitizedName(unsanitized: string) {
  return splitByHash(unsanitized)[1];
}

export function isNewPlayground(pathname: string, slug: string) {
  return pathname.includes(slug);
}

export function isEditingPlaygorund(pathname: string, dbPublicId: string) {
  const splitted = splitBySlash(pathname);
  const _publicId = getLastPart(splitted);
  return dbPublicId === _publicId;
}

export function extractStakeholderIds(values: string[]) {
  return values.map((x) => splitByHash(x)[0]) as string[];
}

export function extractPublicIdFromPath(pathname: string) {
  const splitted = splitBySlash(pathname);
  return getLastPart(splitted);
}

export function getUnselectedRecipients(
  selectedRecipients: string[],
  formattedStakeholders: string[],
) {
  const selectedSet = new Set(selectedRecipients);
  return formattedStakeholders.filter((x) => !selectedSet.has(x));
}

export function isValueInDbRecipients(value: string, dbRecipients: string[]) {
  return new Set(dbRecipients).has(value);
}

export function BadgeColorProvider(type: string) {
  switch (type) {
    case UpdateStatusEnum.DRAFT:
      return "warning";
    case UpdateStatusEnum.PRIVATE:
      return "destructive";
    case UpdateStatusEnum.PUBLIC:
      return "success";
  }
}

export function BadgeStatusProvider(type: string) {
  switch (type) {
    case UpdateStatusEnum.DRAFT:
      return "Draft";
    case UpdateStatusEnum.PRIVATE:
      return "Private";
    case UpdateStatusEnum.PUBLIC:
      return "Public";
  }
}

export function StatusActionProvider(type: string) {
  switch (type) {
    case UpdateStatusEnum.PRIVATE:
      return "Make it public";
    case UpdateStatusEnum.PUBLIC:
      return "Make it private";
  }
}
