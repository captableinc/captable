import type { ReactElement } from "react";

// Export constants from utils package (treeshakable import)
export { META } from "@captable/utils/dist/lib/constants";

// Export all email templates and their types (DRY approach)
export * from "./templates";

// Dynamic import for React Email render function to avoid ES module issues
export async function render(
  component: ReactElement,
  options?: { pretty?: boolean; plainText?: boolean },
) {
  const { render: reactEmailRender } = await import("@react-email/components");
  return reactEmailRender(component, options);
}
