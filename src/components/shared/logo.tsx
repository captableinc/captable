import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const OpenCapLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn("rounded", className)}
      height={500}
      width={500}
      src={logo}
      alt="OpenCap Logo"
    />
  );
};
