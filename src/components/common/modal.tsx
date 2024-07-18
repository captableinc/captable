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

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  screen: "max-w-[96vw]",
};

export type ModalSizeType = keyof typeof sizes;

export type ModalProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  size?: ModalSizeType;
  trigger?: React.ReactNode;
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
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("mb-10 mt-10 gap-0 bg-white p-0", sizes[size])}
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
