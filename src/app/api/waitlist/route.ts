import { NextRequest, NextResponse } from "next/server"
import { db } from "@/server/db"

export async function GET(req: NextRequest) { 
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  console.log(email)

  /* Add part to add to db */

  return NextResponse.json({ message: "Signed up successfully." }, { status: 200 })
}