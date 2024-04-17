import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

export interface TemplateFieldContainerProps extends ComponentProps<"button"> {
  currentViewportHeight: number;
  viewportHeight: number;
  currentViewportWidth: number;
  viewportWidth: number;
  left: number;
  top: number;
  height: number;
  width: number;
  children: ReactNode;
}

export function TemplateFieldContainer({
  currentViewportHeight,
  viewportHeight,
  currentViewportWidth,
  viewportWidth,
  height,
  left,
  top,
  width,
  children,
  className,
  ...rest
}: TemplateFieldContainerProps) {
  const heightRatio = currentViewportHeight / viewportHeight;
  const widthRatio = currentViewportWidth / viewportWidth;

  const newLeft = widthRatio * left;
  const newTop = heightRatio * top;
  const newHeight = heightRatio * height;
  const newWidth = widthRatio * width;

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group absolute z-20 cursor-pointer border-2 border-red-600 bg-red-300/50",
            className,
          )}
          style={{
            left: newLeft,
            top: newTop,
            width: newWidth,
            height: newHeight,
          }}
          {...rest}
        />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
}
