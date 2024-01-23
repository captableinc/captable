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
    <div className="flex">
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col lg:flex ">
        <SideBar companies={companies} publicId={publicId} />
      </aside>
      <div className="flex flex-grow flex-col lg:border-l">
        <NavBar />
        <div className="w-full px-4 py-6 lg:px-8 2xl:mx-auto 2xl:max-w-screen-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
