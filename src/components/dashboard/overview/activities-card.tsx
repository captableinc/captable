import { RiUser4Fill } from "@remixicon/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

type Props = {
  title?: string;
  className: string;
};

const DonutCard = ({ title, className }: Props) => {
  const activity = [
    {
      id: 1,
      action: "safe.created",
      actor: {
        id: "xxxxx",
        type: "user",
      },
      target: {
        id: "xxxxx",
        type: "user",
      },

      summary: "Jane Doe created a safe '[Draft] - SAFE for Y Combinator'",
      date: "28 days ago",
    },
    {
      id: 2,
      action: "document.uploaded",
      actor: {
        id: "xxxxx",
        type: "user",
      },
      target: {
        id: "xxxxx",
        type: "user",
      },

      summary: "Jane Doe uploaded a document 'Certificate of Incorporation'",
      date: "28 days ago",
    },
    {
      id: 3,
      action: "user.invited",
      actor: {
        id: "xxxxx",
        type: "user",
      },
      target: {
        id: "xxxxx",
        type: "user",
      },

      summary: "Jane Doe accepted the invitation to join the company",
      date: "29 days ago",
    },
    {
      id: 4,
      action: "user.invited",
      actor: {
        id: "xxxxx",
        type: "user",
      },
      target: {
        id: "xxxxx",
        type: "user",
      },

      summary: "John Doe invited an admin Jane Doe to join the company",
      date: "30 days ago",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pt-0">
        <CardDescription className="text-md font-semibold text-primary">
          Activities
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul role="list" className="-mb-8">
          {activity.map((activityItem, activityItemIdx) => (
            <li key={activityItem.id}>
              <div className="relative pb-8">
                {activityItemIdx !== activity.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <>
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 ring-8 ring-white">
                          <RiUser4Fill
                            className="h-5 w-5 text-teal-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {activityItem.summary}
                        </span>{" "}
                        <br />
                        <span className="whitespace-nowrap">
                          {activityItem.date}
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
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutCard;
