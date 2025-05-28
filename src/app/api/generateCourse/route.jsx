import { GoogleGenAI } from "@google/genai";
import { PROMPT } from "@/config/ai-prompt";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { getUserPlanFeatures, checkCourseLimit } from "@/lib/subscription";
import { eq } from "drizzle-orm";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const getYouTubeVideos = async (topic) => {
  try {
    // Check if YouTube API key is available
    if (!process.env.YOUTUBE_API_KEY) {
      console.error("YouTube API key is not configured");
      return [];
    }    // Create a more meaningful search query if it's a generic "Module X" name
    let searchQuery = topic;
    if (topic.match(/^Module \d+$/)) {
      // If it's just "Module 1", "Module 2", etc., make it more generic
      searchQuery = "programming tutorial";
    } else {
      // Use the actual topic name
      searchQuery = topic;
    }

    const res = await axios.get(YOUTUBE_BASE_URL, { params });
      
     const YouTubeVideoList = [];
    
    if (res.data && Array.isArray(res.data.items)) {
      // Just take the first 4 videos without any filtering
      const videos = res.data.items
        .filter((item) => {
          // Only basic validation - ensure video has required fields
          return item && item.id && item.snippet;
        })
        .slice(0, 4);      videos.forEach((item, index) => {
        const data = {
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description?.substring(0, 200) + "..." || "",
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
          viewCount: "N/A", // Remove statistics reference
          duration: "Medium length"
        };
        YouTubeVideoList.push(data);
      });
    }

    
    return YouTubeVideoList;
  } catch (error) {
    console.error(`YouTube fetch error for topic "${topic}":`, error.message);
    return [];
  }
};

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
  const thisMonthCourses = existingCourses.filter((course) => {
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
        upgradeRequired: true,
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
    // Log the input data being sent to AI
    
    
    
    

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

    // Log the raw AI response
    
    
    
    

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
    
    const bannerImage = await generateImage(ImagePrompt);

    // Add YouTube video integration for each module
    
    const enrichedModules = await Promise.all(
      parsedJson.modules.map(async (module, index) => {
        try {
          const moduleName = module.moduleName || `Module ${index + 1}`;
          
          
          // Use the same YouTube function from generate-ai-course
          const youtubeVideos = await getYouTubeVideos(moduleName);
          
          
          
          return {
            ...module,
            youtubeVideos: youtubeVideos || []
          };
        } catch (error) {
          console.error(`Error fetching videos for module ${module.moduleName}:`, error);
          return {
            ...module,
            youtubeVideos: []
          };
        }
      })
    );

    // Update parsedJson with enriched modules
    parsedJson.modules = enrichedModules;

    // Properly handle categories - prioritize AI-generated categories
    let categoriesValue;
    if (
      parsedJson.course.categories &&
      Array.isArray(parsedJson.course.categories) &&
      parsedJson.course.categories.length > 0
    ) {
      categoriesValue = JSON.stringify(parsedJson.course.categories);
    } else if (formData.categories) {
      categoriesValue = formData.categories;
      
    } else {
      categoriesValue = JSON.stringify(["General"]);
      
    }    // Map form data fields to schema fields
    const courseData = {
      // Map the form fields to the schema fields
      name: parsedJson.course.name || formData.courseName,
      description: parsedJson.course.description || formData.courseDescription,
      noOfModules:
        parseInt(parsedJson.course.noOfModules) ||
        parseInt(formData.moduleCount) ||
        1,
      difficultyLevel:
        parsedJson.course.difficultyLevel || formData.difficultyLevel,
      categories: categoriesValue,
      includeVideo: formData.includeVideo || false,
      userId: formData.userId,
      courseJson: {
        ...parsedJson,
        modules: enrichedModules // Use enriched modules with YouTube videos
      },
      bannerImageUrl: bannerImage,
      cid: `course-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };  
    if (!courseData.name) {
      throw new Error("Course name is required");
    }

    if (!courseData.userId) {
      throw new Error("User ID is required");
    }    await db.insert(coursesTable).values(courseData);
    
    

    return new Response(JSON.stringify({ 
      success: true, 
      data: courseData,
      videoStats: {
        totalVideos: courseData.courseJson.modules.reduce((total, m) => total + (m.youtubeVideos?.length || 0), 0),
        moduleStats: courseData.courseJson.modules.map(m => ({ 
          module: m.moduleName, 
          videoCount: m.youtubeVideos?.length || 0 
        }))
      }
    }));  } catch (error) {
    console.error("=== COURSE GENERATION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Input data:", JSON.stringify(formData, null, 2));
    console.error("==============================");
    
    return new Response(
      JSON.stringify({
        error: "Failed to generate course content",
        details: error.message,
        timestamp: new Date().toISOString(),
        errorType: error.constructor.name
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
  
  return result.data.image;
};
