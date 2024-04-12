"use client";

import { constants } from "@/lib/constants";
import { RiDiscordFill, RiGithubFill, RiTwitterFill } from "@remixicon/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CaptableLogo } from "./common/logo";
import { buttonVariants } from "./ui/button";

export const Navbar = () => {
  const { data } = useSession();

  return (
    <div className="absolute left-0 top-0 flex h-16 w-full items-center border-b px-4 sm:px-8">
      <Link
        href="/#"
        className="flex items-center gap-2 text-2xl hover:no-underline"
      >
        <CaptableLogo className="h-9 w-9" />
      </Link>
      <div className="grow" />
      <div className="flex items-center gap-4 text-sm">
        <Link
          href={constants.twitter.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RiTwitterFill className="text-primary/80" />
        </Link>
        <Link
          href={constants.github.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RiGithubFill className="text-primary/80" />
        </Link>
        <Link
          href={constants.discord.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RiDiscordFill className="text-primary/80" />
        </Link>

        {data && (
          <Link
            className={buttonVariants()}
            href={`/${data.user.companyPublicId}`}
          >
            Go to App
          </Link>
        )}
      </div>
    </div>
  );
};
