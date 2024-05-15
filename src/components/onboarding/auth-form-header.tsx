import { CaptableLogo } from "@/components/common/logo";

interface LoginFormHeaderProps {
  page?: string;
}

export function AuthFormHeader({ page }: LoginFormHeaderProps) {
  return (
    <div className="flex flex-col gap-y-2 text-center">
      <div className="center">
        <CaptableLogo className="mb-3 h-10 w-10 rounded-md" />
      </div>

      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {page === "signup"
          ? "Signup to Captable, Inc."
          : "Login to Captable, Inc."}
      </h1>
    </div>
  );
}
