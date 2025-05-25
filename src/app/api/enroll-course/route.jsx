import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID is required",
        },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated or email not available",
        },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Check if course is already enrolled
    const enrolledCourses = await db
      .select()
      .from(enrollCourseTable)
      .where(
        and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        )
      );

    if (enrolledCourses?.length === 0) {
      // Enroll the user in the course
      const result = await db
        .insert(enrollCourseTable)
        .values({
          cid: courseId,
          userEmail: userEmail,
          progress: "0",
        })
        .returning();

      return NextResponse.json({
        success: true,
        message: "Successfully enrolled",
        data: result,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Already enrolled",
      });
    }
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to enroll in course",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("cid");

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated or email not available",
        },
        { status: 401 }
      );
    }    if (courseId) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(coursesTable.cid, enrollCourseTable.cid)
        )
        .where(
          and(
            eq(enrollCourseTable.userEmail, userEmail),
            eq(enrollCourseTable.cid, courseId)
          )
        );

      if (result.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Course not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result[0],
      });
    } else {
      const userEmail = user.primaryEmailAddress.emailAddress;

      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(coursesTable.cid, enrollCourseTable.cid)
        )
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.cid));

      return NextResponse.json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch enrolled courses",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
