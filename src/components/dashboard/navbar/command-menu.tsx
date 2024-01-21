"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Pages = [
  {
    title: "Createa a SAFE",
    path: "/dashboard/safe",
  },
  {
    title: "Add Stakeholder",
    path: "/dashboard/stakeholders",
  },
  {
    title: "Upload document",
    path: "/dashboard/documents",
  },
  {
    title: "Create an equity plan",
    path: "/dashboard/captable",
  },
  {
    title: "Create a share class",
    path: "/dashboard/securities",
  },
];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const push = (path: string) => {
    console.log("pushing path", path);
    router.push(path);
    setOpen(false);
  };

  return (
    <div className={cn("ml-8 hidden flex-1 gap-x-6 md:flex md:justify-center")}>
      <Button
        variant="outline"
        className="flex w-96 items-center justify-between rounded-lg text-muted-foreground"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Search
        </div>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {Pages.map((page) => (
              <CommandItem key={page.path} onSelect={() => push(page.path)}>
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
