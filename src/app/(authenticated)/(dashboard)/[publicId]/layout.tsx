import { NavBar } from "@/components/dashboard/navbar";
import { SideBar } from "@/components/dashboard/sidebar";
import { ModalProvider } from "@/components/modals";
import { withServerComponentSession } from "@/server/auth";
import { getCompanyList } from "@/server/company";
import { redirect } from "next/navigation";
import "@/styles/hint.css";
import { RolesProvider } from "@/providers/roles-provider";
import { api } from "@/trpc/server";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { publicId: string };
};

const DashboardLayout = async ({
  children,
  params: { publicId },
}: DashboardLayoutProps) => {
  const { user } = await withServerComponentSession();

  if (user.companyPublicId !== publicId) {
    redirect(`/${user.companyPublicId}`);
  }

  const [companies, roles] = await Promise.all([
    getCompanyList(user.id),
    api.rbac.getPermissions.query(),
  ]);
  return (
    <RolesProvider initialData={roles}>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="sticky top-0 hidden min-h-full w-64 flex-shrink-0 flex-col lg:flex lg:border-r">
          <SideBar companies={companies} publicId={publicId} />
        </aside>
        <div className="flex h-full flex-grow flex-col">
          <NavBar companies={companies} publicId={publicId} />
          <div className="mx-auto min-h-full w-full px-5 py-10 lg:px-8 2xl:max-w-screen-xl">
            {children}
          </div>
        </div>
      </div>
      <ModalProvider />
    </RolesProvider>
  );
};

export default DashboardLayout;
