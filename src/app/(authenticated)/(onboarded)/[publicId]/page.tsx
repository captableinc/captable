"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";

const CaptablePage = () => {
  const params = useParams<{ publicId: string }>();
  const { data } = useSession();
  const firstName = data?.user.name?.split(" ")[0];

  return (
    <div className="flex flex-wrap">
      <div className="mb-10 w-full md:w-1/2">
        <div className="md:max-w-lg">
          <header className="mb-10">
            <h3 className="font-medium">
              Welcome to OpenCap{firstName && `, ${firstName}`} 👋
            </h3>
            <p className="text-md text-muted-foreground">
              Let{`'`}s start managing your company{`'`}s cap table.
            </p>
          </header>
          <div className="-m-5 mb-9 flex flex-wrap">
            <div className="w-full px-5 py-2">
              <div className="-m-4 flex flex-wrap">
                <div className="w-auto p-4">
                  <div className="relative mb-3 h-16 w-16 text-lg font-semibold text-primary">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <span className="text-orange-500">1</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="md:max-w-xs">
                    <h4 className="leading-normal">Stakeholders</h4>
                    <p className="text-md text-sm leading-relaxed text-muted-foreground">
                      Start inviting your company{`'`}s stakeholders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-5 py-2">
              <div className="-m-4 flex flex-wrap">
                <div className="w-auto p-4">
                  <div className="relative mb-3 h-16 w-16 text-lg font-semibold text-primary">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <span className="text-orange-500">2</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="md:max-w-xs">
                    <h4 className="leading-normal">
                      Share classes & equity plans
                    </h4>
                    <p className="text-md text-sm leading-relaxed text-muted-foreground">
                      Setup share classes and equity plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-5 py-2">
              <div className="-m-4 flex flex-wrap">
                <div className="w-auto p-4">
                  <div className="relative mb-3 h-16 w-16 text-lg font-semibold text-primary">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <span className="text-orange-500">3</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="md:max-w-xs">
                    <h4 className="leading-normal">Issue equities</h4>
                    <p className="text-md text-sm leading-relaxed text-muted-foreground">
                      You are ready to go, start issueing equities, optons and
                      convertibles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:inline-block">
            <Button size="lg">
              <Link href={`/${params.publicId}/stakeholders`}>
                Let{`'`}s get started
                <RiArrowRightLine className="ml-5 inline-block h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <img
          className="mx-auto max-h-[470px] transform transition duration-1000 ease-in-out hover:translate-y-[-12px]"
          src="https://placehold.co/450x500?text=Placeholder"
          alt=""
        />
      </div>
    </div>
  );
};

export default CaptablePage;
