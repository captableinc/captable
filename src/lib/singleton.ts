// credit https://github.com/epicweb-dev/remember/blob/main/index.js

export function singleton<Value>(name: string, getValue: () => Value): Value {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const thusly = globalThis as any;
  thusly.__remember_singleton ??= new Map<string, Value>();
  if (!thusly.__remember_singleton.has(name)) {
    thusly.__remember_singleton.set(name, getValue());
  }
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return thusly.__remember_singleton.get(name)!;
}
