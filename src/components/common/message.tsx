import { RiInformationLine } from "@remixicon/react";
import Link from "next/link";

type MessageProps = {
  description: string;
  cta?: {
    label: string;
    href: string;
  };

  children?: React.ReactNode;
};

const Message = ({ description, cta, children }: MessageProps) => {
  return (
    <div className="mt-3 rounded-md bg-teal-50 p-4 text-left">
      <div className="flex">
        <div className="flex-shrink-0">
          <RiInformationLine
            className="h-5 w-5 text-teal-600"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <div className="text-sm text-teal-600">
            <p>{description}</p>
          </div>

          {cta && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <Link
                  passHref
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-teal-100 px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-teal-50"
                >
                  <span className="mr-1">{cta.label}</span>
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default Message;
