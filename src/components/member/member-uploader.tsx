"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { RiUploadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/lib/csv-parser";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type TeamMemberUploaderType = {
  setOpen: (val: boolean) => void;
};

const TeamMemberUploader = ({ setOpen }: TeamMemberUploaderType) => {
  const [csvFile, setCSVFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setCSVFile(files);
  };

  const onImport = async () => {
    try {
      if (!csvFile[0]) {
        return;
      }

      const parsedData = await parseCSV(csvFile[0]);

      setOpen(false);
    } catch (error) {
      console.error((error as Error).message);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description:
          "Please check the CSV file and make sure its according to our format",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm leading-6 text-neutral-600">
        Please download the{" "}
        <Link
          download
          href="/sample-csv/opencap-team-members-template.csv"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-gray-300/70 px-2 py-1 text-xs font-medium hover:bg-gray-400/50"
        >
          <span className="mr-1">sample csv file</span>
          <span aria-hidden="true"> &darr;</span>
        </Link>
        , complete and upload it to import your existing or new team members.
      </div>

      <div
        className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <RiUploadLine className="h-7 w-7 text-neutral-500" />
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
