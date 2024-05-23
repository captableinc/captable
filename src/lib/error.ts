// credit https://github.com/remix-run/remix/blob/58ac1e98f0768ba775fbda885f8cc36bbf51f78e/packages/remix-dev/invariant.ts#L1

export function invariant(value: boolean, message?: string): asserts value;

export function invariant<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
