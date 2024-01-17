interface LoginFormHeaderProps {
  email?: string;
}

export function LoginFormHeader({ email }: LoginFormHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {email ? "Check your email" : "Login to OpenCap"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {email ? (
          <>
            We emailed a login link to <b>{email}</b>. Click the link to login
          </>
        ) : (
          <>Enter your email to login with a magic link</>
        )}
      </p>
    </div>
  );
}
