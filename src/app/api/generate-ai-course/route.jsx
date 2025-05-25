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
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const getYouTubeVideo = async (topic) => {
  try {
    // Enhanced search query with educational keywords
    const educationalQuery = `${topic} tutorial learn programming course`;
    
    const params = {
      part: "snippet,statistics",
      q: educationalQuery,
      maxResults: 8, // Get more results to filter from
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
      // Additional parameters for better content quality
      order: "relevance", // Sort by relevance
      videoDefinition: "high", // HD videos only
      videoDuration: "medium", // 4-20 minutes (good for learning)
      videoEmbeddable: "true", // Only embeddable videos
      videoSyndicated: "true", // Only syndicated videos
      safeSearch: "moderate", // Filter inappropriate content
      relevanceLanguage: "en", // English content
      regionCode: "US", // US region for better educational content
      // Fields to optimize response
      fields: "items(id/videoId,snippet(title,description,channelTitle,publishedAt,thumbnails/medium),statistics(viewCount,likeCount))"
    };

    const res = await axios.get(YOUTUBE_BASE_URL, { params });
    const YouTubeVideoList = [];

    // Check if items exists and is an array before using forEach
    if (res.data && Array.isArray(res.data.items)) {
      // Filter and sort videos for educational quality
      const filteredVideos = res.data.items
        .filter((item) => {
          if (!item || !item.id || !item.snippet) return false;
          
          const title = item.snippet.title.toLowerCase();
          const description = item.snippet.description?.toLowerCase() || "";
          const channelTitle = item.snippet.channelTitle?.toLowerCase() || "";
          
          // Filter for educational content keywords
          const educationalKeywords = [
            'tutorial', 'learn', 'course', 'guide', 'how to', 'programming',
            'coding', 'development', 'lesson', 'training', 'beginner',
            'intermediate', 'advanced', 'step by step', 'complete'
          ];
          
          // Check if title or description contains educational keywords
          const hasEducationalContent = educationalKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword)
          );
          
          // Filter out low-quality indicators
          const lowQualityIndicators = [
            'shorts', 'tiktok', 'meme', 'funny', 'reaction', 'clickbait',
            'live stream', 'podcast', 'music', 'song', 'gaming'
          ];
          
          const hasLowQualityIndicators = lowQualityIndicators.some(indicator => 
            title.includes(indicator) || description.includes(indicator)
          );
          
          // Prefer educational channels
          const educationalChannels = [
            'freecodecamp', 'codecademy', 'udemy', 'coursera', 'edx',
            'khan academy', 'mit', 'stanford', 'harvard', 'programming',
            'code', 'tech', 'dev', 'tutorial'
          ];
          
          const isEducationalChannel = educationalChannels.some(channel => 
            channelTitle.includes(channel)
          );
          
          return hasEducationalContent && !hasLowQualityIndicators;
        })
        .sort((a, b) => {
          // Sort by view count (higher views = potentially better content)
          const viewsA = parseInt(a.statistics?.viewCount) || 0;
          const viewsB = parseInt(b.statistics?.viewCount) || 0;
          return viewsB - viewsA;
        })
        .slice(0, 4); // Take top 4 after filtering and sorting

      filteredVideos.forEach((item) => {
        const data = {
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description?.substring(0, 200) + "..." || "",
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
          viewCount: item.statistics?.viewCount || "0",
          duration: "Medium length" // YouTube API v3 doesn't return duration in search
        };
        YouTubeVideoList.push(data);
      });
    }

    console.log(`Found ${YouTubeVideoList.length} quality educational videos for topic: ${topic}`);
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
    const thisMonthCourses = existingCourses.filter(course => {
      const createdAt = new Date(course.createdAt);
      return createdAt >= startOfMonth && createdAt <= endOfMonth;
    });

    const currentCount = thisMonthCourses.length;
    const limitCheck = await checkCourseLimit(currentCount);

    if (!limitCheck.canCreate) {
      const planFeatures = await getUserPlanFeatures();
      const planName = planFeatures ? Object.keys(planFeatures)[0] : 'Free';
      
      return NextResponse.json(
        { 
          error: "Course generation limit reached",
          details: `You have reached your monthly limit of ${limitCheck.limit} courses. Upgrade your plan to create more courses.`,
          limitInfo: {
            current: currentCount,
            limit: limitCheck.limit,
            remaining: limitCheck.remaining,
            planName: planName
          },
          upgradeRequired: true
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
      course.modules.map(async (module) => {
        // 
        const promptContent = CHAPTER_PROMPT + JSON.stringify(module);
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
        const maxRetries = 5;
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
            
            // Log the retry attempt
            
            
            if (retries >= maxRetries) {
              console.error("Max retries reached for Gemini API call");
              break;
            }

            // Calculate exponential backoff delay: 2^retries * 1000ms + random jitter
            const delay = Math.min(2 ** retries * 1000 + Math.random() * 1000, 10000);
            
            await sleep(delay);
          }
        }

        // If we've exhausted all retries and still don't have a response
        if (!responseText) {
          console.error("Failed to get response after multiple retries:", lastError);
          throw new Error(`Failed to generate content after ${maxRetries} retries: ${lastError?.message || "Unknown error"}`);
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
              console.error("JSON parsing error from code block:", innerErr.message);
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
                
              }
            }
          }

          // If all parsing attempts failed
          if (!parsedJson) {
            // Create a fallback JSON with the module name
            parsedJson = {
              title: "Generated Content",
              content:
                "Content could not be properly formatted. Please try again.",
              youtubeVideos: [],
            };
            
          }
        } catch (err) {
          console.error("JSON extraction error:", err.message);
          // Create a fallback JSON
          parsedJson = {
            title: "Generated Content",
            content:
              "Content could not be properly formatted. Please try again.",
            youtubeVideos: [],
          };
        }        // Attach YouTube videos with enhanced search
        try {
          const moduleName = module?.moduleName || "programming";
          console.log(`Fetching educational videos for module: ${moduleName}`);
          const videos = await getYouTubeVideo(moduleName);
          
          // Add additional metadata to videos
          parsedJson.youtubeVideos = videos.map(video => ({
            ...video,
            source: "youtube",
            quality: "educational",
            addedAt: new Date().toISOString()
          })) || [];
          
          console.log(`Successfully attached ${parsedJson.youtubeVideos.length} videos to module: ${moduleName}`);
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
        updatedAt: Date.now()
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
    const isOverloaded = error.message && (
      error.message.includes("503 Service Unavailable") || 
      error.message.includes("overloaded") ||
      error.message.includes("UNAVAILABLE")
    );
    
    return NextResponse.json(
      {
        error: "AI Generation Failed",
        details: error.message || "Unknown error occurred",
        isOverloaded: isOverloaded,
        retryAdvised: isOverloaded,
        suggestion: isOverloaded ? 
          "The AI service is currently experiencing high demand. Please try again in a few minutes." : 
          "Please check your course structure and try again."
      },
      { status: isOverloaded ? 503 : 500 }
    );
  }
}
