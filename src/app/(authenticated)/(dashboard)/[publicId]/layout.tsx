import { NavBar } from "@/components/dashboard/navbar";
import { SideBar } from "@/components/dashboard/sidebar";
import { ModalProvider } from "@/components/modals";
import { withServerComponentSession } from "@/server/auth";
import { getCompanyList } from "@/server/company";
import { redirect } from "next/navigation";
import "@/styles/hint.css";
import { RBAC } from "@/lib/rbac";
import { getServerPermissions } from "@/lib/rbac/access-control";
import { RolesProvider } from "@/providers/roles-provider";

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

  const [companies, permissionsData] = await Promise.all([
    getCompanyList(user.id),
    getServerPermissions(),
  ]);

  const permissions = RBAC.normalizePermissionsMap(permissionsData.permissions);
  return (
    <RolesProvider data={{ permissions }}>
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
