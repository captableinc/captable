"use client";

import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { RiArrowRightLine as ArrowRightIcon } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DataRoomPopoverType = {
  trigger: React.ReactNode;
};

const DataRoomPopover = ({ trigger }: DataRoomPopoverType) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const companyPublicId = data?.user.companyPublicId;

  const dataRoomMutation = api.dataRoom.save.useMutation({
    onSuccess: (response) => {
      if (response.success) {
        router.push(
          `/${companyPublicId}/documents/data-rooms/${response.data?.publicId}`,
        );
      } else {
        toast({
          variant: "destructive",
          title: response.message,
          description: "",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        description: "",
      });
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const saveDataRoom = async () => {
    setLoading(true);
    await dataRoomMutation.mutateAsync({ name });
  };

  return (
    <Popover>
      {loading && <Loading />}
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80">
        <form
          className="flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await saveDataRoom();
          }}
        >
          <Label htmlFor="data-room-name">Data room name</Label>
          <p className="text-sm text-muted-foreground">
            Start by giving your data room a name.
          </p>
          <Input
            id="data-room-name"
            className="col-span-2 h-8"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <div className="flex justify-end">
            <Button size="sm" variant={"secondary"} type="submit">
              Continue
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DataRoomPopover;
