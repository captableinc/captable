"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { constants } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import founder1 from "@/assets/founder.png";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const { handleSubmit } = useForm();

  const joinWaitlist = async () => {
    const response = await fetch(`/api/waitlist?email=${email}`);

    if (response.ok) {
      setModalOpen(false);
      toast({
        title: "Signup successful",
        description:
          "You have successfully joined the waitlist, you will be contacted shortly.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to join the waitlist. Please try again later.",
      });
    }
  };

  return (
    <main className="center min-h-screen flex-col">
      <Navbar />
      <section className="flex h-[80vh] flex-col justify-center gap-4 px-4 sm:items-center">
        <h1>Your shares. Now private.</h1>
        <h2>Scale your cap table with confidence.</h2>
        <p className="mt-4 text-lg sm:mt-8">
          For the builders and funders. We&apos;ll never use your data to sell
          secondaries.
        </p>
        <div className="flex items-center gap-2">
          <Dialog open={modalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setModalOpen(true)}
                className="hover:no-underline"
              >
                Join the waitlist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit(joinWaitlist)}>
                <DialogHeader>
                  <DialogTitle>Waitlist</DialogTitle>
                  <DialogDescription>
                    Add your email to the waitlist. Click save when you&apos;re
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email" // Specify the input type as "email" for better validation
                      placeholder="abc@example.com"
                      className="col-span-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Join the waitlist</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button size="lg" variant="outline">
            <Link href={constants.github.url} className="hover:no-underline">
              Star us on GitHub
            </Link>
          </Button>
        </div>
      </section>
      <section className="flex h-[50vh] w-full flex-col justify-start px-8 sm:p-16">
        <div className="center h-full w-full flex-col gap-4 rounded-md bg-gradient-to-t from-white to-blue-100 p-16">
          <h3>Build equity. Build trust. Build your company.</h3>
          <p className="max-w-xl text-center text-lg">
            OpenCap will follow the{" "}
            <span className="font-bold">Open Cap Table Format</span>, an open
            source standard to prevent lock-in and keep lawyer fees low. No
            promises.
          </p>
          <Button variant="outline">
            <Link href={constants.ocf.url}>Read more</Link>
          </Button>
        </div>
      </section>
      <section className="center min-h-screen w-full flex-col px-4">
        <div className="grid h-full w-full grid-rows-2 gap-8 p-4 sm:p-16 md:grid-cols-2 md:grid-rows-1 md:gap-16">
          <div className="relative h-full">
            <div className="absolute flex h-full flex-col space-y-2 p-8 sm:p-16">
              <h4>Manage your cap table with ease.</h4>
              <div className="grow" />
              <h2>Encrypted.</h2>
              <h2>Self-hosted.</h2>
              <h2>Compliant.</h2>
            </div>
            <Image
              className="rounded-md object-cover opacity-40"
              fill
              src={founder1}
              alt="Happy startup founder who just raised money"
            />
          </div>
          <div className="flex h-full flex-col space-y-4 rounded-md bg-gradient-to-r from-white to-green-100 p-8 sm:p-16">
            <h2>Your data, secured.</h2>
            <h3>
              OpenCap never has access to your most sensitive company data.
            </h3>
            <p className="text-lg">
              With end-to-end encryption and self-hosting options, what is yours
              remains yours.
            </p>
            <div className="grow" />
            <div className="flex flex-col divide-y-2 divide-green-700 text-green-700 blur-sm transition-all duration-700 hover:blur-0">
              <div className="grid grid-cols-4 font-bold">
                <div>Investor</div>
                <div>Round</div>
                <div>Shares</div>
                <div>Signatures</div>
              </div>
              <div className="grid grid-cols-4 divide-x-2 divide-green-700">
                <div className="px-1">Dave Ephraim</div>
                <div className="px-1">B</div>
                <div className="px-1">5500</div>
                <div className="px-1">✓</div>
              </div>
              <div className="grid grid-cols-4 divide-x-2 divide-green-700">
                <div className="px-1">Kara Withers</div>
                <div className="px-1">Seed</div>
                <div className="px-1">111 500</div>
                <div className="px-1">✓</div>
              </div>
              <div className="grid grid-cols-4 divide-x-2 divide-green-700">
                <div className="px-1">Sarah Sunanka</div>
                <div className="px-1">A</div>
                <div className="px-1">45 400</div>
                <div className="px-1">✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="center h-screen w-full flex-col">
        <div className="grid h-full w-full p-8 sm:p-16">
          <div className="center flex-col gap-4 rounded-md bg-gradient-to-t from-blue-100 to-white">
            <h4>Scale your equity.</h4>
            <Button size="lg">
              <Link href={constants.twitter.url} className="hover:no-underline">
                Get started today
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
