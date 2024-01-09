import Link from "next/link";
import { Button } from "@/components/ui/button"

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#282626] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          OpenCap
        </h1>
        
        <p className="text-xl">
          OpenCap is an open source cap table management tool that does not sell your data.
        </p>

        <p className="flex">
          <Button asChild variant="outline">
            <Link href="/api/auth/signin" className="text-black">Signin</Link>
          </Button>
        </p>
      </div>
    </main>
  );
}
