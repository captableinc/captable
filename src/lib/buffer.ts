type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export function constantTimeEqual(
  a: ArrayBuffer | TypedArray,
  b: ArrayBuffer | TypedArray,
): boolean {
  const aBuffer = new Uint8Array(a);
  const bBuffer = new Uint8Array(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < aBuffer.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    c |= aBuffer[i]! ^ bBuffer[i]!; // ^: XOR operator
  }
  return c === 0;
}
