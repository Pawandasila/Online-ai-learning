import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { enrollCourseTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, certificateUrl } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Update the enrollment record to mark as completed and add certificate
    const result = await db
      .update(enrollCourseTable)
      .set({
        isCompleted: true,
        progress: "100",
        certificate: certificateUrl || `https://certificates.example.com/${courseId}-${userId}.pdf`,
        // You could also update completedAt timestamp if you add that field
      })
      .where(
        and(
          eq(enrollCourseTable.cid, courseId),
          eq(enrollCourseTable.userEmail, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course completed successfully!",
      data: result[0]
    });

  } catch (error) {
    console.error("Error completing course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
