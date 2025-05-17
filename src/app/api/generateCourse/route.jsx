import { GoogleGenAI } from "@google/genai";
import { PROMPT } from "@/config/ai-prompt";
import { db } from "@/config/db";

export async function POST(req) {
  const {
    name,
    description,
    noOfModules,
    difficultyLevel,
    categories,
    includeVideo,
    userId,
  } = await req.json();

  const courseJson = {
    name,
    description,
    noOfModules,
    difficultyLevel,
    categories,
    includeVideo,
  };

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  
  const config = {
    responseMimeType: "text/plain",
  };
  
  // Use gemini-2.0-flash model
  const model = 'gemini-2.0-flash';
  
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(courseJson),
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

    // Log the response structure to understand its format
    console.log("Response structure:", JSON.stringify(response));
    
    // Extract the text from the response based on the structure
    let responseText = '';
    
    // For Gemini 2.0 models - directly access the text property
    if (response.candidates && response.candidates[0].content.parts[0].text) {
      responseText = response.candidates[0].content.parts[0].text;
    } else if (response.text && typeof response.text === 'function') {
      // Only call response.text() if it's a function
      responseText = response.text();
    } else if (response.response && response.response.text) {
      // For some Gemini models
      responseText = response.response.text;
    } else {
      // Fallback
      responseText = JSON.stringify(response);
    }
    
    
    // Store in database
    // if (db && userId) {
    //   await db.insert(coursesTable).values({
    //     ...courseJson,
    //     courseJson: responseText,
    //     userId: userId,
    //     cid: `course-${Date.now()}`,
    //     createdAt: Date.now(),
    //     updatedAt: Date.now(),
    //   });
    // }
    
    return new Response(JSON.stringify({ success: true, data: responseText }));
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate course content",
        details: error.message
      }),
      { status: 500 }
    );
  }
}