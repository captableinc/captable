import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MemberCardProps {
  name?: string | undefined | null;
  email?: string | undefined | null;
}

export function MemberCard({ email, name }: MemberCardProps) {
  return (
    <div className="flex w-full items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/micah/svg?seed=${email}`}
          />
          <AvatarFallback>{name ?? email}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name ?? email}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Select defaultValue="edit">
        <SelectTrigger className="ml-auto w-[110px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="edit">Can edit</SelectItem>
          <SelectItem value="view">Can view</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
