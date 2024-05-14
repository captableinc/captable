export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initPgBoss } = await import("./lib/pg-boss");

    await initPgBoss();
  }
}
