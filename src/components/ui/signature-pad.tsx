"use client";

import { type MouseEvent, forwardRef, useRef, useState } from "react";
import { toPng } from "html-to-image";

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
  name: string;
}

export function SignaturePad({ name }: SignaturePadProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lines, setLines] = useState<[Point][]>([]);
  const canvasSizeRef = useRef<{ width: number; height: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCoordinates = (pointerEvent: MouseEvent<HTMLDivElement>): Point => {
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

  return (
    <div
      className="h-64 w-full cursor-crosshair border"
      ref={canvasRef}
      onMouseUp={async () => {
        setIsDrawing(false);

        if (lines.length) {
          if (svgRef.current) {
            const png = await toPng(svgRef.current as unknown as HTMLElement);

            if (inputRef.current) {
              inputRef.current.value = png;
            }
          }
        }
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) {
          return;
        }

        const point = getCoordinates(e);

        setLines((prevLines) => [...prevLines, [point]]);
        setIsDrawing(true);
      }}
      onMouseMove={(e) => {
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

      <input name={name} required minLength={1} type="hidden" ref={inputRef} />
    </div>
  );
}
