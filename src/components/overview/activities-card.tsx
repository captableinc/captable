import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

type Props = {
  title?: string;
  className: string;
};

const DonutCard = ({ title, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader className="pt-0">
        <CardDescription className="text-md font-bold text-primary">
          Activities
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default DonutCard;
