import { Table } from "@/components/ui/table";
import type { ReactNode } from "react";

interface DataTableContentProps {
  children: ReactNode;
}

export function DataTableContent({ children }: DataTableContentProps) {
  return (
    <div className="mt-6 rounded-md border">
      <Table>{children}</Table>
    </div>
  );
}
