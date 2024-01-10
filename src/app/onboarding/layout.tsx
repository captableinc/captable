import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "OpenCap - Onboarding",
  description: "Login or create an account to get started.",
}

const quotes = [
  {
    user: "Mitchell Hashimoto",
    title: "Founder & CEO, HashiCorp",
    handle: "@mitchellh",
    link: "https://twitter.com/mitchellh/status/1744052396609941813",
    tweet: "Don’t use Carta. Just don’t. I don’t recall the details of my experience many years ago and no longer have access to my corp email to dig it up anyways, so I’m just going to say trust me, you do not want to be using Carta.  (Reminded due to the recent Carta drama)",
  },

  {
    user: "Karri Saarinen",
    title: "Founder & CEO, Linear",
    handle: "@karrisaarinen",
    link: "https://twitter.com/karrisaarinen/status/1743398553500971331",
    tweet: "This might be the end of @cartainc as the trusted platform for startups. As a founder it feels kind shitty that Carta, who I trust to manage our cap table, is now doing cold outreach to our angel investors about selling Linear shares to their buyers."
  },

  {
    user: "Paul Graham",
    title: "Co-founder, Y Combinator",
    handle: "@paulg",
    link: "https://twitter.com/paulg/status/1356643841659572227",
    tweet: "If you use Carta to manage your cap table, they will spam all your investors."
  }
]

export default function OnboardingLayout(
  {
    children,
  }: {
    children: React.ReactNode
  },
) {

  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="min-h-screen">
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative  h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted px-10 py-5 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link href="/" className="relative z-20 flex items-center hover:no-underline">
            <h1 className="font-cal flex items-center gap-2 text-xl hover:no-underline">
              OpenCap
            </h1>
          </Link>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <Link href={quote?.link || ""} className="text-lg" target="_blank">
                &ldquo;
                {quote?.tweet}
                &rdquo;
              </Link>
              <footer className="text-sm pt-3">{
                quote?.user
                + " - "
                + quote?.title
              }</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
