export const PROMPT = `Generate Learning Course depends on the following details. In which make sure to add:

Course Name

Description

Chapter Name ( or noOfModules)

Image Prompt
(Create a modern, flat-style 2D digital illustration representing the user topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course)

For:

Course Banner in 3D format

Topic under each chapter

Duration for each chapter

🧾 Schema (JSON format):
json
Copy
Edit
{
  "course": {
    "name": "string",
    "description": "string",
    "noOfModules": "number",
    "difficultyLevel": "beginner | intermediate | advanced",
    "categories": ["string"],
  }
}`