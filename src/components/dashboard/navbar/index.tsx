import { CommandMenu } from "./command-menu";
import { MobileDrawer } from "./mobile-drawer";
import { UserDropdown } from "./user-dropdown";
import { type TGetCompanyList } from "@/server/company";

interface SideBarProps {
  publicId: string;
  companies: TGetCompanyList;
}

export function NavBar({ publicId, companies }: SideBarProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background">
      <header className="flex h-14 items-center px-4 lg:px-8">
        <div className="flex w-full items-center justify-between ">
          <MobileDrawer publicId={publicId} companies={companies} />
          <div className="flex items-center gap-6">
            <CommandMenu />
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}
