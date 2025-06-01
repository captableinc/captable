import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { dayjsExt } from "@/lib/common/dayjs";
import { api } from "@/trpc/server";
import { RiAccountCircleFill } from "@remixicon/react";
import Link from "next/link";

type Props = {
  publicId: string;
  className: string;
};

const ActivityCard = async ({ className, publicId }: Props) => {
  const activity = (await api.audit.getAudits.query({ take: 4 })) as {
    data: {
      id: string;
      summary: string;
      occurredAt: string;
    }[];
  };

  return (
    <Card className={className}>
      <CardHeader className="pt-0">
        <CardDescription className="text-md font-semibold text-primary">
          Activities
        </CardDescription>
      </CardHeader>

      <CardContent>
        {activity.data.length ? (
          <>
            <ul className="-mb-8">
              {activity.data.map((activityItem) => (
                <li key={activityItem.id} className="group">
                  <div className="relative pb-8">
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border group-last:hidden"
                      aria-hidden="true"
                    />

                    <div className="relative flex items-start space-x-3">
                      <>
                        <div>
                          <div className="relative px-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 ring-8 ring-white">
                              <RiAccountCircleFill
                                className="h-5 w-5 text-teal-500"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary/80">
                              {activityItem.summary}
                            </span>{" "}
                            <br />
                            <span className="whitespace-nowrap text-xs">
                              {dayjsExt().to(activityItem.occurredAt)}
                            </span>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href={`/${publicId}/audits`}
                className="flex w-full items-center justify-center rounded-md border border-border bg-card py-1 text-sm text-primary/85 hover:bg-muted/50"
              >
                View all activity
              </Link>
            </div>
          </>
        ) : (
          <Alert>
            <AlertDescription>No activities to show</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
