import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

const avatarStackVariants = cva("flex", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    spacing: {
      sm: "-space-x-5 -space-y-5",
      md: "-space-x-4 -space-y-4",
      lg: "-space-x-3 -space-y-3",
      xl: "-space-x-2 -space-y-2",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    spacing: "md",
  },
});

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  avatars: { name: string; image: string }[];
  maxAvatarsAmount?: number;
}

const AvatarStack = ({
  className,
  orientation,
  avatars,
  spacing,
  maxAvatarsAmount = 3,
  ...props
}: AvatarStackProps) => {
  const shownAvatars = avatars.slice(0, maxAvatarsAmount);
  const hiddenAvatars = avatars.slice(maxAvatarsAmount);

  return (
    <div
      className={cn(
        avatarStackVariants({ orientation, spacing }),
        className,
        orientation === "vertical" ? "-space-x-0" : "-space-y-0",
      )}
      {...props}
    >
      {shownAvatars.map(({ name, image }, index) => (
        <TooltipProvider delayDuration={300} key={`${image}-${index + 1}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  avatarStackVariants(),
                  "rounded-full border-2 border-white hover:z-10",
                )}
              >
                <AvatarImage src={image} />
                <AvatarFallback>
                  {name
                    ?.split(" ")
                    ?.map((word) => word[0])
                    ?.join("")
                    ?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {hiddenAvatars.length ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar key="Excesive avatars">
                <AvatarFallback className="bg-gray-200">
                  +{avatars.length - shownAvatars.length}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {hiddenAvatars.map(({ name }, index) => (
                <p key={`${name}-${index + 1}`}>{name}</p>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  );
};

export { AvatarStack, avatarStackVariants };
