import { CHAPTER_PROMPT } from "@/config/ai-prompt";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserPlanFeatures, checkCourseLimit } from "@/lib/subscription";

// Helper function to wait for a specified time
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const getYouTubeVideo = async (topic) => {
  try {
    // Check if YouTube API key is available
    if (!process.env.YOUTUBE_API_KEY) {
      console.error("YouTube API key is not configured");
      return [];
    }

    const res = await axios.get(YOUTUBE_BASE_URL, { params });


    const YouTubeVideoList = []; // Check if items exists and is an array before using forEach
    if (res.data && Array.isArray(res.data.items)) {

      // Filter and sort videos for educational quality
      const filteredVideos = res.data.items
        .filter((item) => {
          if (!item || !item.id || !item.snippet) {
            
            return false;
          }

          const title = item.snippet.title.toLowerCase();
          const description = item.snippet.description?.toLowerCase() || "";
          

          // Filter for educational content keywords
          const educationalKeywords = [
            "tutorial",
            "learn",
            "course",
            "guide",
            "how to",
            "programming",
            "coding",
            "development",
            "lesson",
            "training",
            "beginner",
            "intermediate",
            "advanced",
            "step by step",
            "complete",
          ];

          // Check if title or description contains educational keywords
          const hasEducationalContent = educationalKeywords.some(
            (keyword) =>
              title.includes(keyword) || description.includes(keyword)
          );

          // Filter out low-quality indicators
          const lowQualityIndicators = [
            "shorts",
            "tiktok",
            "meme",
            "funny",
            "reaction",
            "clickbait",
            "live stream",
            "podcast",
            "music",
            "song",
            "gaming",
          ];

          const hasLowQualityIndicators = lowQualityIndicators.some(
            (indicator) =>
              title.includes(indicator) || description.includes(indicator)
          );

          const isGoodVideo = hasEducationalContent && !hasLowQualityIndicators;

          return isGoodVideo;
        })
        .sort((a, b) => {
          // Sort by published date (newer = potentially better/relevant)
          const dateA = new Date(a.snippet?.publishedAt || 0);
          const dateB = new Date(b.snippet?.publishedAt || 0);
          return dateB - dateA;
        })
        .slice(0, 4);

      filteredVideos.forEach((item, index) => {
        const data = {
          videoId: item.id.videoId,
          title: item.snippet.title,
          description:
            item.snippet.description?.substring(0, 200) + "..." || "",
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
          duration: "Medium length", // YouTube API v3 doesn't return duration in search
        };
       
        YouTubeVideoList.push(data);
      });
    } else {
      console.log("No valid YouTube items found in response");
      console.log("Response data structure:", res.data);
    }

   
    return YouTubeVideoList;
  } catch (error) {
    console.error("YouTube fetch error:", error.message);
    console.error("Error details:", error.response?.data || error);
    return [];
  }
};

export async function POST(req) {
  try {
    // Check authentication first
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to generate courses" },
        { status: 401 }
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
      .where(eq(coursesTable.userId, userId));

    // Filter courses created this month
    const thisMonthCourses = existingCourses.filter((course) => {
      const createdAt = new Date(course.createdAt);
      return createdAt >= startOfMonth && createdAt <= endOfMonth;
    });

    const currentCount = thisMonthCourses.length;
    const limitCheck = await checkCourseLimit(currentCount);

    if (!limitCheck.canCreate) {
      const planFeatures = await getUserPlanFeatures();
      const planName = planFeatures ? Object.keys(planFeatures)[0] : "Free";

      return NextResponse.json(
        {
          error: "Course generation limit reached",
          details: `You have reached your monthly limit of ${limitCheck.limit} courses. Upgrade your plan to create more courses.`,
          limitInfo: {
            current: currentCount,
            limit: limitCheck.limit,
            remaining: limitCheck.remaining,
            planName: planName,
          },
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const data = await req.json();

    const courseObj = data?.course;

    const course = courseObj?.courseJson?.course;

    const courseTitle = courseObj?.name;
    const cid = courseObj?.cid;

    if (!course || !Array.isArray(course.modules)) {
      console.error("Invalid course data format - missing modules array");
      console.error("Course structure:", course);
      return NextResponse.json(
        { error: "Invalid course data format" },
        { status: 400 }
      );
    }
    if (!process.env.GEMINI_API_KEY || !process.env.YOUTUBE_API_KEY) {
      console.error("Missing API keys:", {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasYouTubeKey: !!process.env.YOUTUBE_API_KEY,
      });
      return NextResponse.json(
        { error: "Missing API keys in environment variables" },
        { status: 500 }
      );
    }


    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = "gemini-2.0-flash";
    const config = { responseMimeType: "text/plain" };
    const enrichedModules = await Promise.all(
      course.modules.map(async (module, index) => {
       
        // Create a more specific prompt with course context and module position
        const courseContext = `
Course Title: ${courseTitle}
Course Description: ${course.description || "No description provided"}
Module Position: ${index + 1} of ${course.modules.length}
Difficulty Level: ${course.difficultyLevel || "beginner"}
`;

        const promptContent =
          CHAPTER_PROMPT + courseContext + JSON.stringify(module);
        

        const contents = [
          {
            role: "user",
            parts: [{ text: promptContent }],
          },
        ];

        // Implement retry logic with exponential backoff
        let response;
        let responseText;
        let retries = 0;
        const maxRetries = 3; // Reduced retries to speed up debugging
        let lastError;

        while (retries < maxRetries) {
          try {
          

            response = await ai.models.generateContent({
              model,
              config,
              contents,
            });

            responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (responseText) {

              // Success! Break out of the retry loop
              break;
            } else {
              throw new Error("No content returned from Gemini");
            }
          } catch (error) {
            lastError = error;
            retries++;


            if (retries >= maxRetries) {
              console.error("Max retries reached for Gemini API call");
              break;
            }

            // Calculate exponential backoff delay: 2^retries * 1000ms + random jitter
            const delay = Math.min(
              2 ** retries * 1000 + Math.random() * 1000,
              10000
            );

            await sleep(delay);
          }
        } // If we've exhausted all retries and still don't have a response
        if (!responseText) {
          console.error(
            `❌ Failed to get response after ${maxRetries} retries:`,
            lastError
          );
          throw new Error(
            `Failed to generate content after ${maxRetries} retries: ${
              lastError?.message || "Unknown error"
            }`
          );
        }


        // Extract JSON
        let jsonString;
        let parsedJson;

        try {
          // First try to extract JSON from code blocks
          const jsonMatch = responseText.match(
            /```(?:json)?\s*([\s\S]*?)\s*```/
          );
          if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1].trim();
 

            // Try to parse the extracted JSON
            try {
              parsedJson = JSON.parse(jsonString);
              
            } catch (innerErr) {
              console.error(
                "❌ JSON parsing error from code block:",
                innerErr.message
              );
            }
          }

          // If the above method failed, try to find JSON by braces
          if (!parsedJson) {
            
            const start = responseText.indexOf("{");
            const end = responseText.lastIndexOf("}");

            if (start !== -1 && end !== -1 && end > start) {
              jsonString = responseText.slice(start, end + 1);
              
              try {
                parsedJson = JSON.parse(jsonString);
                
              } catch (innerErr) {
                console.error(
                  "❌ JSON parsing error from braces:",
                  innerErr.message
                );
                console.error(
                  "Problematic JSON string:",
                  jsonString.substring(0, 500) + "..."
                );
              }
            }
          }

          // If all parsing attempts failed
          if (!parsedJson) {
            // Create a fallback JSON with the correct module structure
            console.error(
              "❌ Failed to parse AI response, using fallback structure"
            );
            console.error("Raw response:", responseText);

            parsedJson = {
              moduleName: module?.moduleName || `Module ${index + 1}`,
              chapterName: module?.moduleName || `Module ${index + 1}`,
              duration: module?.duration || "2 hours",
              about: `This module covers essential concepts related to ${courseTitle}. Please regenerate this content for better results.`,
              topics: (
                module?.topics || [
                  "Introduction",
                  "Basic concepts",
                  "Practical examples",
                ]
              ).map((topic) => ({
                topic: topic,
                content: `This section covers ${topic} in the context of ${courseTitle}. The content generation encountered an issue. Please try regenerating this module for detailed educational content with examples and practical applications.`,
              })),
              youtubeVideos: [],
            };
          }
        } catch (err) {
          console.error("JSON extraction error:", err.message);
          // Create a fallback JSON with correct structure
          parsedJson = {
            moduleName: module?.moduleName || `Module ${index + 1}`,
            chapterName: module?.moduleName || `Module ${index + 1}`,
            duration: module?.duration || "2 hours",
            about: `This module covers essential concepts related to ${courseTitle}. Please regenerate this content for better results.`,
            topics: (
              module?.topics || [
                "Introduction",
                "Basic concepts",
                "Practical examples",
              ]
            ).map((topic) => ({
              topic: topic,
              content: `This section covers ${topic} in the context of ${courseTitle}. The content generation encountered an issue. Please try regenerating this module for detailed educational content with examples and practical applications.`,
            })),
            youtubeVideos: [],
          };
        } // Attach YouTube videos with enhanced search
        try {
          let searchTerm = module?.moduleName || "programming";

          // Handle generic module names by using course context and topics
          if (searchTerm.match(/^Module \d+$/i)) {
          

            // Create a more specific search term using course title and first topic
            const firstTopic = module?.topics?.[0] || "programming basics";
            const courseTopic = courseTitle?.toLowerCase().includes("web")
              ? "web development"
              : courseTitle?.toLowerCase().includes("python")
              ? "python programming"
              : courseTitle?.toLowerCase().includes("javascript")
              ? "javascript programming"
              : courseTitle?.toLowerCase().includes("react")
              ? "react development"
              : courseTitle?.toLowerCase().includes("node")
              ? "nodejs development"
              : "programming";

            searchTerm = `${courseTopic} ${firstTopic}`;
            
          }

          
          const videos = await getYouTubeVideo(searchTerm);

          // Add additional metadata to videos
          parsedJson.youtubeVideos =
            videos.map((video) => ({
              ...video,
              source: "youtube",
              quality: "educational",
              addedAt: new Date().toISOString(),
            })) || [];

        } catch (youtubeError) {
          console.error(
            "Error attaching YouTube videos:",
            youtubeError.message
          );
          parsedJson.youtubeVideos = [];
        }

        return parsedJson;
      })
    );

    //
    //

    // Update the courseContent field instead of trying to use a non-existent enrichedModules field
    const dbRes = await db
      .update(coursesTable)
      .set({
        courseContent: { enrichedModules },
        updatedAt: Date.now(),
      })
      .where(eq(coursesTable.cid, cid))
      .returning();

    return NextResponse.json({
      success: true,
      courseTitle,
      enrichedModules,
    });
  } catch (error) {
    console.error("AI content processing error:", error.message);
    console.error("Error stack:", error.stack);

    // Determine if this is a service overload error
    const isOverloaded =
      error.message &&
      (error.message.includes("503 Service Unavailable") ||
        error.message.includes("overloaded") ||
        error.message.includes("UNAVAILABLE"));

    return NextResponse.json(
      {
        error: "AI Generation Failed",
        details: error.message || "Unknown error occurred",
        isOverloaded: isOverloaded,
        retryAdvised: isOverloaded,
        suggestion: isOverloaded
          ? "The AI service is currently experiencing high demand. Please try again in a few minutes."
          : "Please check your course structure and try again.",
      },
      { status: isOverloaded ? 503 : 500 }
    );
  }
}
