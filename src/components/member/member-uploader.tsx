"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { parseInviteMembersCSV } from "@/lib/invite-team-members-csv-parser";
import { api } from "@/trpc/react";
import type { TypeZodInviteMemberArrayMutationSchema } from "@/trpc/routers/member-router/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type TeamMemberUploaderType = {
  setOpen: (val: boolean) => void;
};

const TeamMemberUploader = ({ setOpen }: TeamMemberUploaderType) => {
  const [csvFile, setCSVFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const inviteMember = api.member.inviteMember.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast.success("You have successfully invited the stakeholder.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setCSVFile(files);
  };

  const onImport = async () => {
    try {
      if (!csvFile[0]) {
        return;
      }

      const parsedData = (await parseInviteMembersCSV(
        csvFile[0],
      )) as TypeZodInviteMemberArrayMutationSchema;
      await Promise.all(
        parsedData.map(async (data) => {
          await inviteMember.mutateAsync(data);
        }),
      );
      setOpen(false);
    } catch (error) {
      console.error((error as Error).message);
      toast.error(
        "Something went wrong, please check the CSV file and make sure its according to our format",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm leading-6 text-neutral-600">
        Please download the{" "}
        <Link
          download
          href="/sample-csv/captable-team-members-template.csv"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-gray-300/70 px-2 py-1 text-xs font-medium hover:bg-gray-400/50"
        >
          <span className="mr-1">sample csv file</span>
          <span aria-hidden="true"> &darr;</span>
        </Link>
        , complete and upload it to import your existing or new team members.
      </div>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon name="upload-line" className="h-7 w-7 text-neutral-500" />
        <span className="text-sm text-neutral-500">
          {csvFile.length !== 0 ? csvFile[0]?.name : "Click here to import"}
        </span>
        <input
          onChange={onFileInputChange}
          type="file"
          ref={fileInputRef}
          accept=".csv"
          hidden
        />
      </div>

      <div className="text-xs">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={""}
          className="text-teal-700 underline"
        >
          Learn more
        </Link>{" "}
        about the sample csv format
      </div>

      <Button onClick={onImport} className="ml-auto block">
        Import
      </Button>
    </div>
  );
};

export default TeamMemberUploader;
