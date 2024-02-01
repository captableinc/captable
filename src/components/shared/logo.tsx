import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const OpenCapLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn(className)}
      height={100}
      width={100}
      src={logo}
      alt="OpenCap Logo"
    />
  );
};
