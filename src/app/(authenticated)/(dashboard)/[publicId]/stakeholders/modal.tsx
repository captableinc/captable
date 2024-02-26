"use client";

import { useState } from "react";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseStakeholderTextareaCSV } from "@/lib/csv-parser";
import { type TypeZodAddStakeholderMutationSchema } from "@/trpc/routers/stakeholder-router/schema";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

type StakeholderType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  trigger: React.ReactNode;
};

const StakeholderModal = ({ title, subtitle, trigger }: StakeholderType) => {
  const [open, setOpen] = useState(false);

  const [csvData, setCSVData] = useState("");
  const { mutateAsync } = api.stakeholder.addStakeholders.useMutation({
    onSuccess: async ({ message }) => {
      toast({
        variant: "default",
        title: "🎉 Successfully added",
        description: message,
      });
    },
  });

  const handleCSVSubmit = async () => {
    try {
      const parsedData = parseStakeholderTextareaCSV(
        csvData,
      ) as TypeZodAddStakeholderMutationSchema[];

      await mutateAsync(parsedData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      size="2xl"
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Add stakeholders manually</Label>
          <Textarea onChange={(e) => setCSVData(e.target.value)} />
          <Button className="ml-auto block" onClick={handleCSVSubmit}>
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StakeholderModal;
