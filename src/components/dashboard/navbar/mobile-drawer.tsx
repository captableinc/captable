import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RiMenuLine } from "@remixicon/react";
import { SideBar } from "../sidebar";

export function MobileDrawer() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <RiMenuLine className="h-4 w-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-0">
          <div className="flex flex-col">
            <SideBar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
