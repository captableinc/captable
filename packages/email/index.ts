import type { ReactElement } from "react";

// Dynamic import for React Email render function to avoid ES module issues
export async function render(
  component: ReactElement,
  options?: { pretty?: boolean; plainText?: boolean },
) {
  const { render: reactEmailRender } = await import("@react-email/components");
  return reactEmailRender(component, options);
}
