"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const OnboardingCompany = () => {
  return (
    <div className="min-h-screen flex  justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pt-20 pb-5 px-5">
      <Navbar />
      <div className="max-w-2xl w-full p-10 border border-rounded bg-white shadow">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to OpenCap!
          </h1>
          <p className="text-sm text-muted-foreground">
            You are almost there. Please complete the form below to continue
          </p>
        </div>

        <form onSubmit={
          async (e) => {
            e.preventDefault();
          }
        } >
          <div className="grid gap-2">
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label  htmlFor="firstName">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label  htmlFor="lastName">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label  htmlFor="companyName">
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label  htmlFor="title">
                    Your title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>
              </div>

              <hr />

              <h2 className="text-xl">
                Company Incorporation details
              </h2>
              <p className="text-sm text-muted-foreground -mt-5">
                Please provide your company's incorporation details. Your certificate of incorporation will come in handy here.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    Incorporation type
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Incorporation date
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    Incorporation country
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Incorporation state
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>
              </div>

              {/*  */}
              <h2 className="text-xl">
                Company address
              </h2>
              <p className="text-sm text-muted-foreground -mt-5">
                Please provide your company's address.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    Street address
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">
                    City
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    State
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Zipcode
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCorrect="off"
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button >
              Complete setup
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default OnboardingCompany;
