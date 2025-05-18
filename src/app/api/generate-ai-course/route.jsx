import { CHAPTER_PROMPT } from "@/config/ai-prompt";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";

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
    // console.log(res.data.items)
    return res?.data?.items || [];
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
        console.log(module.moduleName)
        const promptContent = CHAPTER_PROMPT + JSON.stringify(module);
        const contents = [
          {
            role: "user",
            parts: [{ text: promptContent }],
          },
        ];

        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

        const responseText =
          response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          throw new Error("No content returned from Gemini");
        }

        // Extract JSON
        let jsonString;
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
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

        let parsedJson;
        try {
          parsedJson = JSON.parse(jsonString);
        } catch (err) {
          throw new Error("Failed to parse Gemini response JSON");
        }

        // Attach YouTube videos
        const videos = await getYouTubeVideo(module?.moduleName || "programming");
        parsedJson.youtubeVideos = videos;

        return parsedJson;
      })
    );

    return NextResponse.json({
      success: true,
      cid,
      courseTitle,
      enrichedModules,
    });
  } catch (error) {
    console.error("AI content processing error:", error.message);
    return NextResponse.json(
      {
        error: "AI Generation Failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
