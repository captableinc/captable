import Link from "next/link";

type OnboardingFormProps = {
  title: string,
  subtitle: string,
  disclaimer?: boolean,
  children: React.ReactNode,
};

const OnboardingForm = (
  {
    title,
    subtitle,
    disclaimer = false,
    children,
  }: OnboardingFormProps,
) => {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      { children }

      {
        disclaimer &&
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking button above, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      }
    </>
  )
};

export default OnboardingForm;
