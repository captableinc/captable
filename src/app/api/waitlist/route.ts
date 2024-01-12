import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")!;

  try {
    const newWaitlistUser = await db.waitlistUser.create({
      data: {
        email: email,
      },
    });

    return NextResponse.json(
      { message: `Waitlist user ${newWaitlistUser.id} created successfully ` },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 400 });
  }
}
