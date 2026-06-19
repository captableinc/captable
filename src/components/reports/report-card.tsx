"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiFileDownloadLine } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";

type ReportCardProps = {
  title: string;
  description: string;
  format: "PDF" | "CSV";
  type: string;
};

const ReportCard = ({ title, description, format, type }: ReportCardProps) => {
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/reports/${type}`);

      if (!response.ok) {
        toast.error("Failed to generate the report, please try again.");
        return;
      }

      const header = response.headers.get("Content-Disposition") ?? "";
      const filename =
        /filename="([^"]+)"/.exec(header)?.[1] ??
        `${type}.${format.toLowerCase()}`;

      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate the report, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-center text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-600/20">
            {format}
          </span>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          loadingText="Generating..."
          onClick={onDownload}
        >
          <RiFileDownloadLine className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
