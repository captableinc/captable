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

const SlideOver = ({
  title,
  subtitle,
  trigger,
  size = "md",
  children,
}: SlideOverProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
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
