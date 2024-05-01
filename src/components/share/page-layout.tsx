import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type SharePageLayoutProps = {
  medium: string;
  company: {
    name: string;
    logo: string | null;
  };
  title: React.ReactNode;
  children: React.ReactNode;
};

export const SharePageLayout = ({
  company,
  title,
  medium,
  children,
}: SharePageLayoutProps) => (
  <div className="flex min-h-screen justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 px-5 pb-5 pt-12">
    <div className="mx-auto flex w-[1080px] max-w-sm flex-col sm:max-w-4xl">
      <div className="mb-16 flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded">
          <AvatarImage src={company.logo || "/placeholders/company.svg"} />
        </Avatar>

        <span className="text-lg font-semibold">{company.name}</span>
      </div>

      <div className="mb-5">{title}</div>

      <Card className="p-10">{children}</Card>

      <div className="my-10 text-center text-sm text-muted-foreground">
        <p>
          Powered by{" "}
          <Link
            href={`https://captable.inc?utm_source=${company.name}&utm_medium=${medium}&utm_campaign=powered_by`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-teal-500 hover:underline"
          >
            Captable, Inc.
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default SharePageLayout;
