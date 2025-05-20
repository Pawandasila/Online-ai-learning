import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm"; 
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("cid");
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (courseId) {
    
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId))
      .execute();

    if (!result.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } else {
    
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userId, user.primaryEmailAddress?.emailAddress))
      .execute();

    if (!result.length) {
      return NextResponse.json({ courses: [] });
    }

    return NextResponse.json(result);
  }
}
