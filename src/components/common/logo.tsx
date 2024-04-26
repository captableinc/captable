import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const CaptableLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn("rounded", className)}
      height={500}
      width={500}
      src={logo}
      alt="Captable, Inc. Logo"
    />
  );
};
