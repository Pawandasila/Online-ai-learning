import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateCertificate } from "@/lib/certificate-generator";

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
    }

    if (courseId) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      
      const result = await db
        .select({
          // Course data
          courseId: coursesTable.cid,
          courseName: coursesTable.name,
          courseDescription: coursesTable.description,
          noOfModules: coursesTable.noOfModules,
          difficultyLevel: coursesTable.difficultyLevel,
          categories: coursesTable.categories,
          includeVideo: coursesTable.includeVideo,
          courseJson: coursesTable.courseJson,
          courseContent: coursesTable.courseContent,
          bannerImageUrl: coursesTable.bannerImageUrl,
          createdAt: coursesTable.createdAt,
          updatedAt: coursesTable.updatedAt,
          // Enrollment data
          enrollmentId: enrollCourseTable.id,
          status: enrollCourseTable.status,
          completedChapters: enrollCourseTable.completedChapters,
          progress: enrollCourseTable.progress,
          isCompleted: enrollCourseTable.isCompleted,
          certificate: enrollCourseTable.certificate,
        })
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
            message: "Course not found or not enrolled",
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
        .select({
          // Course data
          courseId: coursesTable.cid,
          courseName: coursesTable.name,
          courseDescription: coursesTable.description,
          noOfModules: coursesTable.noOfModules,
          difficultyLevel: coursesTable.difficultyLevel,
          categories: coursesTable.categories,
          includeVideo: coursesTable.includeVideo,
          courseJson: coursesTable.courseJson,
          courseContent: coursesTable.courseContent,
          bannerImageUrl: coursesTable.bannerImageUrl,
          createdAt: coursesTable.createdAt,
          updatedAt: coursesTable.updatedAt,
          // Enrollment data
          enrollmentId: enrollCourseTable.id,
          status: enrollCourseTable.status,
          completedChapters: enrollCourseTable.completedChapters,
          progress: enrollCourseTable.progress,
          isCompleted: enrollCourseTable.isCompleted,
          certificate: enrollCourseTable.certificate,
        })
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(coursesTable.cid, enrollCourseTable.cid)
        )
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.id));

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

export async function PUT(req) {
  try {
    const { courseId, chapterIndex, totalChapters } = await req.json();

    if (!courseId || chapterIndex === undefined || !totalChapters) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID, chapter index, and total chapters are required",
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

    // Get current enrollment record
    const enrollment = await db
      .select()
      .from(enrollCourseTable)
      .where(
        and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        )
      );

    if (!enrollment.length) {
      return NextResponse.json(
        {
          success: false,
          message: "User not enrolled in this course",
        },
        { status: 404 }
      );
    }

    const currentEnrollment = enrollment[0];
    let completedChapters = Array.isArray(currentEnrollment.completedChapters) 
      ? currentEnrollment.completedChapters 
      : [];

    // Add chapter to completed list if not already completed
    if (!completedChapters.includes(chapterIndex)) {
      completedChapters.push(chapterIndex);
    }

    // Calculate progress percentage
    const progressPercentage = Math.round((completedChapters.length / totalChapters) * 100);
    const isCompleted = progressPercentage === 100;

    let certificateUrl = currentEnrollment.certificate;

    // Generate certificate if course is completed and certificate doesn't exist
    if (isCompleted && !certificateUrl) {
      try {
        // Get course details for certificate
        const courseDetails = await db
          .select()
          .from(coursesTable)
          .where(eq(coursesTable.cid, courseId));

        if (courseDetails.length > 0) {
          const courseName = courseDetails[0].name;
          const userName = user.fullName || user.firstName || 'Student';
          const completionDate = new Date().toLocaleDateString();

          const certificateData = await generateCertificate(userName, courseName, completionDate);
          certificateUrl = certificateData.url;
        }
      } catch (certificateError) {
        console.error('Certificate generation failed:', certificateError);
        // Continue without certificate - don't fail the entire request
      }
    }

    // Update enrollment record
    const updateData = {
      completedChapters: completedChapters,
      progress: progressPercentage.toString(),
      isCompleted: isCompleted,
    };

    if (certificateUrl) {
      updateData.certificate = certificateUrl;
    }

    const updatedEnrollment = await db
      .update(enrollCourseTable)
      .set(updateData)
      .where(
        and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        )
      )
      .returning();

    return NextResponse.json({
      success: true,
      message: isCompleted 
        ? "Chapter completed! Congratulations on finishing the course!" 
        : "Chapter completed successfully!",
      data: {
        enrollment: updatedEnrollment[0],
        progress: progressPercentage,
        isCompleted: isCompleted,
        completedChapters: completedChapters,
        certificateUrl: certificateUrl,
      },
    });

  } catch (error) {
    console.error("Error updating course progress:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update course progress",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
