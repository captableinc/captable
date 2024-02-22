"use client";

import { nanoid } from "nanoid";
import { useState } from "react";
import { TemplateField } from "./template-field";
import { DrawingField } from "./drawing-field";
import { useFieldCanvasContext } from "@/contexts/field-canvas-context";
import clsx from "clsx";

export function FieldCanvas() {
  const { fieldType, fields, addField } = useFieldCanvasContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [focusId, setFocusId] = useState("");

  const handleFocus = (id: string) => {
    setFocusId(id);
  };

  return (
    <>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 top-0 z-10 ",
          fieldType && "cursor-crosshair",
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!fieldType) return;

          if (e.button !== 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setIsDrawing(true);

          setStartPos({ x, y });
          setEndPos({ x, y });
        }}
        onMouseMove={(e) => {
          e.preventDefault();
          if (!fieldType) return;
          if (!isDrawing) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setEndPos({ x, y });
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          if (!fieldType) return;
          if (!isDrawing) return;
          setIsDrawing(false);
          if (startPos.x !== endPos.x && startPos.y !== endPos.y) {
            const id = nanoid(12);

            addField({
              id,
              name: `field ${fields.length}`,
              left: Math.min(startPos.x, endPos.x),
              top: Math.min(startPos.y, endPos.y),
              width: Math.abs(endPos.x - startPos.x),
              height: Math.abs(endPos.y - startPos.y),
              type: fieldType,
              placeholder: "",
              required: true,
            });

            setFocusId(id);
          }
        }}
      />
      {isDrawing && (
        <DrawingField
          left={Math.min(startPos.x, endPos.x)}
          top={Math.min(startPos.y, endPos.y)}
          height={Math.abs(endPos.y - startPos.y)}
          width={Math.abs(endPos.x - startPos.x)}
        />
      )}

      {fields.map((field) => (
        <TemplateField
          key={field.id}
          focusId={focusId}
          height={field.height}
          left={field.left}
          top={field.top}
          id={field.id}
          name={field.name}
          width={field.width}
          handleFocus={handleFocus}
          type={field.type}
        />
      ))}
    </>
  );
}
