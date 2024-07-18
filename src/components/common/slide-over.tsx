"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SlideOverProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  trigger: React.ReactNode;
  children: React.ReactNode;
};

const sizes = {
  sm: "max-w-sm sm:max-w-[400px]",
  md: "max-w-md sm:max-w-[500px]",
  lg: "max-w-lg sm:max-w-[600px]",
  xl: "max-w-xl sm:max-w-[700px]",
  "2xl": "max-w-2xl sm:max-w-[800px]",
  "3xl": "max-w-3xl sm:max-w-[900px]",
  "4xl": "max-w-4xl sm:max-w-[1000px]",
  "5xl": "max-w-5xl sm:max-w-[1100px]",
};

const SlideOver = ({
  title,
  subtitle,
  trigger,
  size = "md",
  children,
}: SlideOverProps) => {
  const sizeClass = sizes[size];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className={sizeClass}>
        <SheetHeader>
          <SheetTitle>{title} </SheetTitle>
          <SheetDescription>{subtitle}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default SlideOver;
