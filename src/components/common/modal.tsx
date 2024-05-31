"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CaptableLogo } from "@/components/common/logo";
import { cn } from "@/lib/utils";
import type { DialogProps } from "@radix-ui/react-dialog";

export type ModalProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  trigger: React.ReactNode;
  children: React.ReactNode;
  dialogProps?: DialogProps;
  scrollable?: boolean;
};

const Modal = ({
  title,
  subtitle,
  trigger,
  size = "md",
  scrollable = true,
  children,
  dialogProps,
}: ModalProps) => {
  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "mb-10 mt-10 gap-0 bg-white p-0",
          size === "sm" && "sm:max-w-sm",
          size === "md" && "sm:max-w-md",
          size === "lg" && "sm:max-w-lg",
          size === "xl" && "sm:max-w-xl",
          size === "2xl" && "sm:max-w-2xl",
          size === "3xl" && "sm:max-w-3xl",
          size === "4xl" && "sm:max-w-4xl",
          size === "5xl" && "sm:max-w-5xl",
        )}
      >
        <div
          className={cn(
            "no-scrollbar max-h-[80vh]",
            scrollable ? "overflow-scroll" : "",
          )}
        >
          <header className="border-b border-gray-200 p-5">
            <div className="">
              <DialogHeader>
                <div className="flex justify-center">
                  <CaptableLogo className="mb-3 h-10 w-10 rounded" />
                </div>
                <DialogTitle className="mb-4 text-center">{title}</DialogTitle>
                {subtitle && (
                  <DialogDescription className="text-center">
                    {subtitle}
                  </DialogDescription>
                )}
              </DialogHeader>
            </div>
          </header>

          <section className=" bg-gray-100 px-8 py-5">
            <div className="">{children}</div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
