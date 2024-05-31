import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmptySelectProps {
  title: string;
  description: string;
}

export function EmptySelect({ title, description }: EmptySelectProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
