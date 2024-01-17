import { MobileDrawer } from "./mobile-drawer";
import { UserDropdown } from "./user-dropdown";

export function NavBar() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background">
      <header className="flex  h-14 max-w-screen-2xl items-center px-4 lg:px-8">
        <div className="flex w-full items-center justify-between">
          <MobileDrawer />

          <div>
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}
