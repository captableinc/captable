import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface SecurityListProps {
  title: string;
  description: string;
  href: string;
  buttonDisplayName: string;
}

export const SecurityList = ({
  title,
  description,
  href,
  buttonDisplayName,
}: SecurityListProps) => {
  return (
    <>
      <Alert className="mt-6 flex flex-col justify-between p-6 sm:flex-row sm:items-center">
        <div className="mb-4 sm:mb-0">
          <AlertTitle>{title}</AlertTitle>

          <AlertDescription className="mr-4">{description}</AlertDescription>
        </div>

        <Button asChild size="sm" variant={"outline"}>
          <Link href={href}>{buttonDisplayName}</Link>
        </Button>
      </Alert>
    </>
  );
};
