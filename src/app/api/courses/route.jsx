import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm"; // ✅ Import `eq`
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("cid");

  if (!courseId) {
    return NextResponse.json({ error: "Missing 'cid'" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.cid, courseId))
    .execute();

  if (!result.length) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
