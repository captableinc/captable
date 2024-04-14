import { PageLayout } from "@/components/dashboard/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiFolder3Fill as FolderIcon,
  RiMore2Line as MoreIcon,
  RiAddFill,
} from "@remixicon/react";
import DataRoomPopover from "./data-room-popover";

const projects = [
  { name: "Graph API", href: "#", files: 16, bgColor: "bg-pink-600" },
  { name: "Component Design", href: "#", files: 12, bgColor: "bg-purple-600" },
  { name: "Templates", href: "#", files: 16, bgColor: "bg-yellow-500" },
  { name: "React Components", href: "#", files: 8, bgColor: "bg-green-500" },
];

type FolderProps = {
  companyPublicId: string;
};

const Folders = ({ companyPublicId }: FolderProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Data room"
        description="A secure spaces to share multiple documents with investors, stakeholders and external parties."
        action={
          <DataRoomPopover
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Data room
              </Button>
            }
          />
        }
      />

      <hr className="my-3" />

      <Card className="mt-3 border-none bg-transparent shadow-none">
        <ul
          role="list"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <li
              key={project.name}
              className="col-span-1 flex cursor-pointer rounded-md shadow-sm hover:shadow-lg"
            >
              <div
                className={cn(
                  "flex w-14 flex-shrink-0 items-center justify-center rounded-l-md border text-sm font-medium ",
                )}
              >
                <FolderIcon
                  className="h-6 w-6 text-primary/70"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <a
                    href={project.href}
                    className="font-medium text-gray-900 hover:text-gray-600"
                  >
                    {project.name}
                  </a>
                  <p className="text-gray-500">{project.files} files</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <MoreIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Folders;
