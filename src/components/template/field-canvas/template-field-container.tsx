import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

interface useMeasurementProps {
  currentViewportHeight: number;
  viewportHeight: number;
  currentViewportWidth: number;
  viewportWidth: number;
  left: number;
  top: number;
  height: number;
  width: number;
}

function useMeasurement({
  currentViewportHeight,
  currentViewportWidth,
  height,
  left,
  top,
  viewportHeight,
  viewportWidth,
  width,
}: useMeasurementProps) {
  const heightRatio = currentViewportHeight / viewportHeight;
  const widthRatio = currentViewportWidth / viewportWidth;

  return {
    left: widthRatio * left,
    top: heightRatio * top,
    height: heightRatio * height,
    width: widthRatio * width,
  };
}

export type ReadOnlyTemplateFieldContainerProps = useMeasurementProps &
  ComponentProps<"div"> & { color: string };

export function ReadOnlyTemplateFieldContainer({
  currentViewportHeight,
  currentViewportWidth,
  height,
  left,
  top,
  viewportHeight,
  viewportWidth,
  width,
  className,
  children,
  color,
  ...rest
}: ReadOnlyTemplateFieldContainerProps) {
  const {
    height: newHeight,
    left: newLeft,
    top: newTop,
    width: newWidth,
  } = useMeasurement({
    currentViewportHeight,
    viewportHeight,
    currentViewportWidth,
    viewportWidth,
    height,
    left,
    top,
    width,
  });
  return (
    <div
      className={cn(
        "group absolute z-20 flex cursor-pointer items-center overflow-hidden border-2 border-red-600 bg-opacity-50",
        color,
        className,
      )}
      style={{
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TemplateFieldContainerProps
  extends ComponentProps<"button">,
    useMeasurementProps {
  children: ReactNode;
  color: string;
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
  color,
  ...rest
}: TemplateFieldContainerProps) {
  const {
    height: newHeight,
    left: newLeft,
    top: newTop,
    width: newWidth,
  } = useMeasurement({
    currentViewportHeight,
    viewportHeight,
    currentViewportWidth,
    viewportWidth,
    height,
    left,
    top,
    width,
  });

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group absolute z-20 cursor-pointer border-2 border-red-600 bg-opacity-50",
            color,
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
