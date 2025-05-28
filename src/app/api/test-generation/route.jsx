import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const testType = searchParams.get('type') || 'both';
    
    const results = {
      timestamp: new Date().toISOString(),
      testType,
      environment: {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasYouTubeKey: !!process.env.YOUTUBE_API_KEY,
        geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        youtubeKeyLength: process.env.YOUTUBE_API_KEY?.length || 0
      }
    };

    // Test YouTube API
    if (testType === 'youtube' || testType === 'both') {
      try {
        console.log("Testing YouTube API...");
        
        const params = {
          part: "snippet",
          q: "javascript tutorial",
          maxResults: 2,
          type: "video",
          key: process.env.YOUTUBE_API_KEY
        };

        const response = await axios.get(YOUTUBE_BASE_URL, { params });
        
        results.youtube = {
          success: true,
          status: response.status,
          itemsFound: response.data?.items?.length || 0,
          totalResults: response.data?.pageInfo?.totalResults || 0,
          sampleVideos: response.data?.items?.slice(0, 2)?.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle
          })) || []
        };
        
        console.log("✅ YouTube API test successful");
      } catch (error) {
        console.error("❌ YouTube API test failed:", error.message);
        results.youtube = {
          success: false,
          error: error.message,
          statusCode: error.response?.status,
          errorData: error.response?.data
        };
      }
    }

    // Test Gemini AI
    if (testType === 'ai' || testType === 'both') {
      try {
        console.log("Testing Gemini AI...");
        
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const model = "gemini-2.0-flash-exp";
        const config = {
          temperature: 0.7,
          topP: 1,
          topK: 32,
          maxOutputTokens: 1000,
        };

        const contents = [{
          role: "user",
          parts: [{
            text: "Generate a simple JSON response with a course name for 'JavaScript Basics'. Just return: {\"course\": {\"name\": \"some course name\"}}"
          }]
        }];

        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

        let responseText = "";
        if (response.candidates && response.candidates[0].content.parts[0].text) {
          responseText = response.candidates[0].content.parts[0].text;
        }

        results.gemini = {
          success: true,
          responseLength: responseText.length,
          sampleResponse: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
          hasValidResponse: responseText.includes("course")
        };
        
        console.log("✅ Gemini AI test successful");
      } catch (error) {
        console.error("❌ Gemini AI test failed:", error.message);
        results.gemini = {
          success: false,
          error: error.message,
          errorType: error.constructor.name
        };
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({
      error: "Test failed",
      message: error.message
    }, { status: 500 });
  }
}
