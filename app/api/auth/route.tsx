/** @format */
// https://zenn.dev/rabbit/articles/b7d712a2f1287f
import { NextResponse } from "next/server";

export async function GET() {
  console.log(11111);
  return NextResponse.json(
    { error: "Basic Auth Required" },
    {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm='secure_area'" },
    },
  );
}
