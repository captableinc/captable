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
    title: "Add Stakeholder",
    path: "/stakeholders",
  },
  {
    title: "Upload document",
    path: "/documents",
  },
  {
    title: "Create an equity plan",
    path: "/captable",
  },
  {
    title: "Create a share class",
    path: "/securities",
  },
  {
    title: "Create a SAFE",
    path: "/safe",
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
        className="flex w-80 items-center justify-between rounded text-muted-foreground"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          <span>Type a command or search</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-3 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-sm">⌘</span>K
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
