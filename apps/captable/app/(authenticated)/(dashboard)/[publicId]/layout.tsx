import { NavBar } from "@/components/dashboard/navbar";
import { SideBar } from "@/components/dashboard/sidebar";
import { ModalProvider } from "@/components/modals";
import { useServerSideSession } from "@/hooks/use-server-side-session";
import { getCompanyList } from "@/server/company";
import { redirect } from "next/navigation";
import "@/styles/hint.css";
import { RolesProvider } from "@/providers/roles-provider";
import { getServerPermissions } from "@/server/member";
import { checkMembership } from "@/server/member";
import { db } from "@captable/db";
import { RBAC } from "@captable/rbac";
import { headers } from "next/headers";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ publicId: string }>;
};

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
  const { publicId } = await params;
  const headersList = await headers();
  const session = await useServerSideSession({ headers: headersList });

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  if (user.companyPublicId !== publicId) {
    redirect(`/${user.companyPublicId}`);
  }

  const [companies, permissionsData] = await Promise.all([
    getCompanyList(user.id),
    getServerPermissions({ headers: headersList }),
  ]);

  const permissions = RBAC.normalizePermissionsMap(permissionsData.permissions);
  return (
    <RolesProvider data={{ permissions }}>
      <div className="flex min-h-screen bg-background">
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
