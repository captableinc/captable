"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";

type ToggleStatusAlertDialogProps = {
  status: string | undefined;
  onContinue: () => void;
  privateToggleWarning: string;
  publicToggleWarning: string;
  trigger: React.ReactNode;
};

export function ToggleStatusAlertDialog({
  trigger,
  status,
  onContinue,
  privateToggleWarning,
  publicToggleWarning,
}: ToggleStatusAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {status?.toUpperCase() === "PRIVATE"
              ? publicToggleWarning
              : privateToggleWarning}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Button disabled={!status} onClick={onContinue}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
