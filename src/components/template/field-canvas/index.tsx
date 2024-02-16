"use client";

import { nanoid } from "nanoid";
import { useState } from "react";
import { TemplateField } from "./template-field";
import { DrawingField } from "./drawing-field";

export function FieldCanvas() {
  const [fields, setFields] = useState<
    {
      left: number;
      top: number;
      width: number;
      height: number;
      id: string;
      name: string;
    }[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [focusId, setFocusId] = useState("");

  const handleDelete = (id: string) => {
    const filteredArray = fields.filter((item) => item.id !== id);
    setFields(filteredArray);
  };

  const handleFocus = (id: string) => {
    setFocusId(id);
  };

  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
        onMouseDown={(e) => {
          e.preventDefault();

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
          if (!isDrawing) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setEndPos({ x, y });
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          if (!isDrawing) return;
          setIsDrawing(false);
          if (startPos.x !== endPos.x && startPos.y !== endPos.y) {
            const id = nanoid(12);
            const newRectangle = {
              id,
              name: `field ${fields.length}`,
              left: Math.min(startPos.x, endPos.x),
              top: Math.min(startPos.y, endPos.y),
              width: Math.abs(endPos.x - startPos.x),
              height: Math.abs(endPos.y - startPos.y),
            };
            setFields([...fields, newRectangle]);
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
          handleDelete={handleDelete}
          handleFocus={handleFocus}
        />
      ))}
    </>
  );
}
