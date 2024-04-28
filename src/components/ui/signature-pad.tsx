/* eslint-disable @next/next/no-img-element */
"use client";

import { mergeRefs } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";
import { forwardRef, useRef, useState, type MouseEvent } from "react";

interface Point {
  x: number;
  y: number;
}

const Drawing = forwardRef<SVGSVGElement, { lines: [Point][] }>(
  ({ lines }, ref) => {
    return (
      <svg ref={ref} className="h-full w-full">
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  },
);

Drawing.displayName = "Drawing";

function DrawingLine({ line }: { line: [Point] }) {
  const pathData =
    "M " +
    line
      .map((p) => {
        return `${p.x} ${p.y}`;
      })
      .join(" L ");

  return (
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="black"
      strokeWidth="1px"
      d={pathData}
    />
  );
}

interface SignaturePadProps {
  onChange?: (value: string) => void;
  disabled: boolean;
  prefilledValue: string | null;
}

export const SignaturePad = forwardRef<HTMLDivElement, SignaturePadProps>(
  ({ onChange, disabled, prefilledValue }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [lines, setLines] = useState<[Point][]>([]);
    const canvasSizeRef = useRef<{ width: number; height: number } | null>(
      null,
    );
    const svgRef = useRef<SVGSVGElement>(null);

    const getCoordinates = (
      pointerEvent: MouseEvent<HTMLDivElement>,
    ): Point => {
      const boundingArea = canvasRef.current?.getBoundingClientRect();
      canvasSizeRef.current = boundingArea
        ? {
            width: boundingArea.width,
            height: boundingArea.height,
          }
        : null;

      const scrollLeft = window.scrollX ?? 0;
      const scrollTop = window.scrollY ?? 0;

      if (!boundingArea) {
        return { x: 0, y: 0 };
      }

      return {
        x: pointerEvent.pageX - boundingArea.left - scrollLeft,
        y: pointerEvent.pageY - boundingArea.top - scrollTop,
      };
    };

    if (prefilledValue) {
      return (
        <div ref={ref} className="h-64 w-full cursor-not-allowed border">
          <img src={prefilledValue} alt="signature" />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "h-64 w-full border",
          disabled ? "cursor-not-allowed" : "cursor-crosshair",
        )}
        ref={mergeRefs(canvasRef, ref)}
        onMouseUp={async () => {
          if (disabled) {
            return;
          }

          setIsDrawing(false);

          if (onChange) {
            if (lines.length) {
              if (svgRef.current) {
                const png = await toPng(
                  svgRef.current as unknown as HTMLElement,
                );

                onChange(png);
              }
            }
          }
        }}
        onMouseDown={(e) => {
          if (disabled) {
            return;
          }

          if (e.button !== 0) {
            return;
          }

          const point = getCoordinates(e);

          setLines((prevLines) => [...prevLines, [point]]);
          setIsDrawing(true);
        }}
        onMouseMove={(e) => {
          if (disabled) {
            return;
          }

          if (!isDrawing) {
            return;
          }

          const point = getCoordinates(e);

          setLines((prevLines) =>
            prevLines.map(
              (line, index) =>
                (index === prevLines.length - 1 ? [...line, point] : line) as [
                  Point,
                ],
            ),
          );
        }}
      >
        <Drawing ref={svgRef} lines={lines} />
      </div>
    );
  },
);

SignaturePad.displayName = "SignaturePad";
