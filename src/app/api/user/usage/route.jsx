import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { getUserPlanFeatures } from "@/lib/subscription";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month's course count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const coursesCreated = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId));

    // Filter courses created this month
    const thisMonthCourses = coursesCreated.filter(course => {
      const createdAt = new Date(course.createdAt);
      return createdAt >= startOfMonth && createdAt <= endOfMonth;
    });

    // Get user's plan features
    const planFeatures = await getUserPlanFeatures();
    const limit = planFeatures ? planFeatures.maxCoursesPerMonth : 0;

    return NextResponse.json({
      success: true,
      coursesCreated: thisMonthCourses.length,
      limit: limit,
      totalCourses: coursesCreated.length,
      thisMonth: {
        created: thisMonthCourses.length,
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      }
    });

  } catch (error) {
    console.error("Error getting usage:", error);
    return NextResponse.json(
      { error: "Failed to get usage data" },
      { status: 500 }
    );
  }
}
