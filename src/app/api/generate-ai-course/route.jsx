import { CHAPTER_PROMPT } from "@/config/ai-prompt";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Helper function to wait for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const getYouTubeVideo = async (topic) => {
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const res = await axios.get(YOUTUBE_BASE_URL, { params });
    const YouTubeVideoList = [];

    // Check if items exists and is an array before using forEach
    if (res.data && Array.isArray(res.data.items)) {
      res.data.items.forEach((item) => {
        if (item && item.id && item.snippet) {
          const data = {
            videoId: item.id.videoId,
            title: item.snippet.title,
          };
          YouTubeVideoList.push(data);
        }
      });
    } else {
      
    }

    // 
    return YouTubeVideoList;
  } catch (error) {
    console.error("YouTube fetch error:", error.message);
    return [];
  }
};

export async function POST(req) {
  try {
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
        }

        // Attach YouTube videos
        try {
          const moduleName = module?.moduleName || "programming";
          // 
          const videos = await getYouTubeVideo(moduleName);
          parsedJson.youtubeVideos = videos || [];
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
