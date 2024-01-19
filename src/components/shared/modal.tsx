"use client";

{
  /*  Usage:
  <Modal
    title="Invite teammate"
    subtitle="Make changes to your profile here. Click save when you're done."
    trigger={<Button variant="outline">Edit Profile</Button>}
  >
    Modal body
  </Modal>
*/
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { OpenCapLogo } from "@/components/shared/logo";
import { type DialogProps } from "@radix-ui/react-dialog";

type ModalProps = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  dialogProps?: DialogProps;
};

const Modal = ({
  title,
  subtitle,
  trigger,
  children,
  dialogProps,
}: ModalProps) => {
  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="gap-0 bg-white p-0 sm:max-w-[425px]">
        <header className="border-b border-gray-200 p-5">
          <div className="">
            <DialogHeader>
              <OpenCapLogo className="mb-3 h-8 w-auto" />
              <DialogTitle className="mb-4 text-center">{title}</DialogTitle>
              <DialogDescription className="text-center">
                {subtitle}
              </DialogDescription>
            </DialogHeader>
          </div>
        </header>

        <section className=" bg-gray-100 p-5">{children}</section>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
