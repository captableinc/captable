interface DrawingFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function DrawingField({ height, left, top, width }: DrawingFieldProps) {
  return (
    <div
      className="absolute overflow-visible  border-2 border-red-600 bg-red-300/50"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}
