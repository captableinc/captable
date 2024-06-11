import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EmptyPlans() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Empty Subscription Plans</AlertTitle>
      <AlertDescription>
        No subscription pricing plans found. Create them in your{" "}
        <a
          className="underline underline-offset-2 text-primary"
          href="https://dashboard.stripe.com/products"
          rel="noopener noreferrer"
          target="_blank"
        >
          Stripe Dashboard
        </a>
        .
      </AlertDescription>
    </Alert>
  );
}
