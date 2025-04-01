import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { careerPath } = req.body;

    const prompt = `Create a comprehensive learning roadmap for ${careerPath}. The roadmap should:
    1. Start from fundamentals and progress to advanced concepts
    2. Include 8-12 main topics
    3. Each topic should have 3-5 subtopics
    4. Be organized in a logical learning sequence
    5. Include both technical and practical skills
    6. Consider modern industry requirements
    
    Format the response as a JSON object with this structure:
    {
      "topics": [
        {
          "id": "unique-id",
          "title": "Topic Name",
          "description": "Brief description of why this topic is important",
          "icon": "suggested-icon-name",
          "difficulty": "beginner|intermediate|advanced",
          "subtopics": [
            {
              "id": "subtopic-id",
              "title": "Subtopic Name",
              "description": "What you'll learn"
            }
          ]
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer for technology education.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const roadmapData = JSON.parse(response.choices[0].message.content);
    res.json(roadmapData);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

export default router;
