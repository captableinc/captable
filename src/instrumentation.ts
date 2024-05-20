export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startJobs } = await import("@/jobs/start");
    await startJobs();
  }
}
