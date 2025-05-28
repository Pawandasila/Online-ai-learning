export const PROMPT = `You are an expert curriculum designer. Create a comprehensive learning course based on the provided details. Generate a well-structured course with diverse modules that cover different aspects of the subject.

CRITICAL REQUIREMENTS - AVOID REPETITION:
- Each module MUST have completely unique content and focus
- Use DIFFERENT approaches, examples, and teaching methods for each module
- Vary the perspective: some modules should be theoretical, others practical, some beginner-focused, others advanced
- Create DISTINCT module names that clearly differentiate the topics (avoid "Module 1", "Module 2")
- Each module should build upon previous ones but cover entirely different subtopics
- NO generic introductions or repeated phrases across modules

Module Differentiation Strategy:
- Module 1: Foundational concepts and theory
- Module 2: Practical implementation and hands-on examples  
- Module 3: Advanced techniques and best practices
- Module 4: Real-world applications and projects
- Module 5: Integration, deployment, and professional workflows

REQUIREMENTS:
- Create unique, specific module names that reflect their distinct focus
- Each module should focus on different aspects/skills of the subject
- Generate 3-5 specific, actionable topics per module that are UNIQUE to that module
- Ensure topics are practical and build upon each other progressively
- Create realistic durations (1-4 hours per module based on content depth)
- Generate appropriate categories based on the course subject
- Make the banner prompt descriptive and visually appealing

Course Structure Requirements:
- Course Name: Clear, descriptive, and engaging
- Description: Comprehensive overview of what students will learn
- Modules: Each with unique focus and specific learning objectives
- Topics: Practical, specific skills/concepts (not generic)
- Duration: Realistic time estimates for each module
- Categories: Relevant subject classifications

Image Prompt Guidelines:
Create a modern, flat-style 2D digital illustration representing the course topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to the course subject, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in the course topic.

🧾 Schema (JSON format):
{
  "course": {
    "name": "string",
    "description": "string", 
    "noOfModules": "number",
    "difficultyLevel": "beginner | intermediate | advanced",
    "categories": ["string"],
    "courseBannerPrompt": "string"
  },
  "modules": [
    {
      "moduleName": "string (UNIQUE, descriptive name - reflect the specific focus)",
      "topics": ["string (UNIQUE, actionable skills/concepts specific to this module)"],
      "duration": "string (realistic time estimate)",
      "imagePrompt": "string (descriptive prompt for module illustration)"
    }
  ]
}`

export const CHAPTER_PROMPT = `You are an expert educational content creator. Generate detailed, unique educational content for the specific module provided below. Each module should have completely different content focused on its specific topics.

CRITICAL ANTI-REPETITION REQUIREMENTS:
- Generate content that is COMPLETELY UNIQUE and SPECIFIC to this exact module
- Do NOT use generic introductions or repetitive phrases across modules
- Each topic within the module must have DISTINCT, detailed content (minimum 500 words per topic)
- Use DIFFERENT writing styles, examples, and explanations for each module
- Avoid phrases like "This module serves as", "We will explore", "In this section"
- Make content MODULE-SPECIFIC - not generic course introductions
- Include practical examples, code snippets, and real-world applications unique to this module
- Ensure each topic has substantive, educational content that stands alone

CONTENT UNIQUENESS STRATEGY:
- Use varied sentence structures and vocabulary
- Include different types of examples (theoretical vs practical vs case studies)
- Vary the depth and complexity based on the module's specific focus
- Reference specific tools, technologies, or methodologies relevant to the module
- Include step-by-step processes, workflows, or methodologies
- Add industry insights and professional perspectives

CONTENT QUALITY STANDARDS:
- Be specific and detailed, not generic
- Include concrete examples and code snippets where appropriate
- Explain concepts step-by-step with clear methodology
- Provide practical applications and use cases
- Make each topic substantive and educational (500+ words per topic)
- Ensure content flows logically within the module
- Include actionable takeaways and learning objectives

JSON Schema:
{
  "moduleName": "string (use the exact module name provided)",
  "chapterName": "string (use the exact module name provided)", 
  "duration": "string (use the duration provided)",
  "about": "string (detailed description of what this specific module covers - make it unique to this module - 100+ words)",
  "topics": [
    {
      "topic": "string (use the exact topic name provided)",
      "content": "string (detailed, unique educational content specific to this topic - minimum 500 words with examples, explanations, and practical applications)"
    }
  ]
}

Module Input Data:
`