export function EmptyPlans() {
  return (
    <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
      No subscription pricing plans found. Create them in your{" "}
      <a
        href="https://dashboard.stripe.com/products"
        rel="noopener noreferrer"
        target="_blank"
      >
        Stripe Dashboard
      </a>
      .
    </p>
  );
}
