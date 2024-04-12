import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <h1 className=" text-9xl font-extrabold tracking-widest text-gray-900 md:text-[150px]">
        404
      </h1>
      <div className=" px-4 pb-2 text-sm text-black">
        The page you are looking for does not exist
      </div>
      <Button variant="outline">
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </div>
  );
}
