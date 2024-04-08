"use client";

import { RiFileLockLine } from "@remixicon/react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { provideRequestAccess } from "@/app/(documentShare)/document/[publicId]/actions";

export const AccessRequestForm = ({ publicId }: { publicId: string }) => {
  const [state, formAction] = useFormState(provideRequestAccess, {
    emailError: "",
  });
  const { pending } = useFormStatus();

  return (
    <Card className="flex w-full max-w-md flex-col items-center justify-center py-4">
      <CardHeader className="flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-400">
          <RiFileLockLine className="h-12 w-12 text-neutral-800" />
        </div>
        <CardTitle>Request Document Access</CardTitle>

        <CardDescription>This document is email protected.</CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        <form
          action={formAction}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <input type="hidden" name="publicId" value={publicId} />
          <div className="w-full">
            <Label htmlFor="email">Your Email</Label>
            <Input className="w-full" id="email" name="email" type="email" />
            <div>{state?.emailError}</div>
          </div>

          <Button size="sm" className="w-full" type="submit" disabled={pending}>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
