// credits https://github.com/pilcrowOnPaper/oslo/blob/main/src/encoding/hex.ts

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

const hexAlphabet = "0123456789abcdef";

const hexDecodeMap = new Map<string, number>([
  ["0", 0],
  ["1", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],

  ["A", 10],
  ["B", 11],
  ["C", 12],
  ["D", 13],
  ["E", 14],
  ["F", 15],

  ["a", 10],
  ["b", 11],
  ["c", 12],
  ["d", 13],
  ["e", 14],
  ["f", 15],
]);

export function encodeHex(data: ArrayBuffer | TypedArray): string {
  const bytes = new Uint8Array(data);
  let result = "";
  for (let i = 0; i < bytes.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const key1 = bytes[i]! >> 4;
    result += hexAlphabet[key1];
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const key2 = bytes[i]! & 0x0f;
    result += hexAlphabet[key2];
  }
  return result;
}

export function decodeHex(data: string): Uint8Array {
  const chunkCount = Math.ceil(data.length / 2);
  const result = new Uint8Array(chunkCount);
  for (let i = 0; i < chunkCount; i++) {
    let buffer = 0;

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const encoded1 = data[i * 2]!;
    const value1 = hexDecodeMap.get(encoded1) ?? null;
    if (value1 === null) {
      throw new Error(`Invalid character: ${encoded1}`);
    }
    buffer += value1 << 4;

    const encoded2 = data[i * 2 + 1];
    if (encoded2 === undefined) {
      throw new Error("Invalid data");
    }
    const value2 = hexDecodeMap.get(encoded2) ?? null;
    if (value2 === null) {
      throw new Error(`Invalid character: ${encoded1}`);
    }
    buffer += value2;

    result[i] = buffer;
  }
  return result;
}
