import Link from "next/link";
import { Card } from "@/components/ui/card";
import { withServerSession } from "@/server/auth";
import { PageLayout } from "@/components/dashboard/page-layout";
import {
  RiGroup2Line,
  RiGroup2Fill,
  RiBuildingLine,
  RiBuildingFill,
  RiAccountCircleLine,
  RiAccountCircleFill,
  RiBankCardLine,
  RiBankCardFill,
  RiNotificationLine,
  RiNotificationFill,
} from "@remixicon/react";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await withServerSession();
  const companyPublicId = session.user.companyPublicId;

  return (
    <PageLayout title="Settings">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <ul role="list" className="text-sm text-gray-700">
            <li className="rounded py-1.5">
              <Link href={`/${companyPublicId}/company`}>
                <RiBuildingLine className="mr-2 inline-block" />
                Company
              </Link>
            </li>

            <li className="my-1 rounded py-1.5">
              <Link href={`/${companyPublicId}/team`}>
                <RiGroup2Line className="mr-2 inline-block" />
                Team
              </Link>
            </li>
            <li className="my-1 rounded py-1.5">
              <Link href={`/${companyPublicId}/billing`}>
                <RiBankCardLine className="mr-2 inline-block" />
                Billing
              </Link>
            </li>

            <div className="mt-3 text-xs font-semibold leading-6 text-gray-400">
              Account
            </div>

            <li className="my-1 rounded py-1.5">
              <Link href={`/${companyPublicId}/profile`}>
                <RiAccountCircleLine className="mr-2 inline-block" />
                Profile
              </Link>
            </li>

            <li className="my-1 rounded py-1.5">
              <Link href={`/${companyPublicId}/notifications`}>
                <RiNotificationLine className="mr-2 inline-block" />
                Notifications
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-9">
          <Card className="p-5">{children}</Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;
