import { useServerSideSession } from "@/hooks/use-server-side-session";

export const POST = async (req: Request) => {
  const session = await useServerSideSession({ headers: req.headers });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
};
