import { GoogleGenAI } from "@google/genai";
import { PROMPT } from "@/config/ai-prompt";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { getUserPlanFeatures, checkCourseLimit } from "@/lib/subscription";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const formData = await req.json();

  // Check authentication first
  const { userId } = await auth();
  
  if (!userId) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        details: "Please sign in to create courses",
      }),
      { status: 401 }
    );
  }

  // Validate userId from form matches authenticated user
  if (!formData.userId) {
    return new Response(
      JSON.stringify({
        error: "User ID is required",
        details: "A valid user ID must be provided to create a course",
      }),
      { status: 400 }
    );
  }

  // Check subscription limits before proceeding
  // Get current month's course count for this user
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const existingCourses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.userId, formData.userId));

  // Filter courses created this month
  const thisMonthCourses = existingCourses.filter(course => {
    const createdAt = new Date(course.createdAt);
    return createdAt >= startOfMonth && createdAt <= endOfMonth;
  });

  const currentCount = thisMonthCourses.length;
  const limitCheck = await checkCourseLimit(currentCount);

  if (!limitCheck.canCreate) {
    const planFeatures = await getUserPlanFeatures();
    
    return new Response(
      JSON.stringify({
        error: "Course creation limit reached",
        details: `You have reached your monthly limit of ${limitCheck.limit} courses. Upgrade your plan to create more courses.`,
        limitInfo: {
          current: currentCount,
          limit: limitCheck.limit,
          remaining: limitCheck.remaining,
        },
        upgradeRequired: true
      }),
      { status: 403 }
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: "text/plain",
  };

  // Use gemini-2.0-flash model
  const model = "gemini-2.0-flash";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContent({  
      model,
      config,
      contents,
    });

    let responseText = "";

    // For Gemini 2.0 models - directly access the text property
    if (response.candidates && response.candidates[0].content.parts[0].text) {
      responseText = response.candidates[0].content.parts[0].text;
    } else {
      // Fallback
      responseText = JSON.stringify(response);
    }

    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);

    // Fallback: try to find first { and last }
    let jsonString;

    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    } else {
      const start = responseText.indexOf("{");
      const end = responseText.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        jsonString = responseText.slice(start, end + 1);
      } else {
        throw new Error("Valid JSON not found in Gemini response.");
      }
    }

    // Parse safely
    const parsedJson = JSON.parse(jsonString);
    const ImagePrompt = parsedJson.course.courseBannerPrompt;
    console.log(parsedJson.course.courseBannerPrompt)

    const bannerImage = await generateImage(ImagePrompt);

    // Map form data fields to schema fields
    const courseData = {
      // Map the form fields to the schema fields
      name: formData.courseName,
      description: formData.courseDescription,
      noOfModules: parseInt(formData.moduleCount) || 1,
      difficultyLevel: formData.difficultyLevel,
      categories: formData.categories,
      includeVideo: formData.includeVideo || false,
      userId: formData.userId,
      courseJson: parsedJson,
      bannerImageUrl: bannerImage,
      cid: `course-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    // console.log(courseData)

    // Validate required fields
    if (!courseData.name) {
      throw new Error("Course name is required");
    }

    if (!courseData.userId) {
      throw new Error("User ID is required");
    }

    await db.insert(coursesTable).values(courseData);

    return new Response(JSON.stringify({ success: true, data: courseData }));
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate course content",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

const generateImage = async (ImagePrompt) => {
  const BASE_URL = "https://aigurulab.tech";
  const result = await axios.post(
    BASE_URL + "/api/generate-image",
    {
      width: 1024,
      height: 1024,
      input: ImagePrompt,
      model: "flux",
      aspectRatio: "16:9", 
    },
    {
      headers: {
        "x-api-key": process?.env?.AI_GURU_LAB_API, // Your API Key
        "Content-Type": "application/json", // Content Type
      },
    }
  );
  console.log(result.data.image);
  return result.data.image;
};
