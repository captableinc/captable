export function getPublicEnv() {
  const publicEnv = Object.keys(process.env)
    .filter((key) => /^NEXT_PUBLIC_/i.test(key))
    .reduce<Record<string, string>>((prev, curr) => {
      const env = process.env[curr];
      if (env) {
        prev[curr] = env;
      }
      return prev;
    }, {});

  return publicEnv;
}
