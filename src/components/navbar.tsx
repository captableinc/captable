import Link from "next/link";
import React from "react";
import { constants } from "@/lib/constants";
import { OpenCapLogo } from "./shared/logo";
import { RiTwitterFill, RiGithubFill, RiDiscordFill } from "@remixicon/react";

export const Navbar = () => (
  <div className="absolute left-0 top-0 flex h-16 w-full items-center border-b px-4 sm:px-8">
    <Link
      href="/#"
      className="font-cal flex items-center gap-2 text-2xl hover:no-underline"
    >
      <OpenCapLogo className="h-7 w-7" />
      <p>{constants.title}</p>
    </Link>
    <div className="grow" />
    <div className="flex items-center gap-4 text-sm">
      <Link
        href={constants.twitter.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiTwitterFill className="text-[#1DA1F2]" />
      </Link>
      <Link
        href={constants.github.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiGithubFill />
      </Link>
      <Link
        href={constants.discord.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiDiscordFill className="text-[#5865F2]" />
      </Link>
    </div>
  </div>
);
