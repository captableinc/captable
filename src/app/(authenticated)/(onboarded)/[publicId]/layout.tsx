import { NavBar } from "@/components/dashboard/navbar";
import { SideBar } from "@/components/dashboard/sidebar";
import { withServerSession } from "@/server/auth";
import { getCompanyList } from "@/server/company";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { publicId: string };
};

const DashboardLayout = async ({
  children,
  params: { publicId },
}: DashboardLayoutProps) => {
  const { user } = await withServerSession();

  if (user.companyPublicId !== publicId) {
    redirect(`/${user.companyPublicId}`);
  }

  const companies = await getCompanyList(user.id);

  return (
    <div className="flex bg-gray-50">
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col lg:flex">
        <SideBar companies={companies} publicId={publicId} />
      </aside>
      <div className="flex flex-grow flex-col lg:border-l">
        <NavBar companies={companies} publicId={publicId} />
        <div className="mx-auto min-h-full w-full px-5 py-10 lg:px-8 2xl:max-w-screen-xl">
          <div className="rounded border bg-white p-10 shadow">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
