import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.inference.ai.azure.com",
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Get existing roadmap for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("user_roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "No roadmap found" });
    }

    res.json(data.roadmap_data);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch roadmap",
    });
  }
});

// Generate and save a roadmap
router.post("/generate", async (req, res) => {
  try {
    const { careerPath, currentSkills, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    console.log("Received request:", { careerPath, currentSkills, userId });

    const currentSkillsText =
      currentSkills && currentSkills.length > 0
        ? `7. Current skills of the user: ${currentSkills.join(", ")}`
        : "7. User is starting from scratch with no current skills";

    const prompt = `Create a comprehensive learning roadmap for ${careerPath}. The roadmap should:
    1. Start from absolute fundamentals and progress to advanced concepts
    2. Include at least 10 main topics
    3. Each topic should have 3-5 subtopics
    4. Be organized in a logical learning sequence
    5. Include both technical and practical skills
    6. Consider modern industry requirements
    ${currentSkillsText}
    
    Format the response as a JSON object with this structure:
    {
      "topics": [
        {
          "id": "unique-id",
          "title": "Topic Name",
          "description": "Brief description of why this topic is important",
          "icon": "code|layout|server|database|settings|terminal|globe",
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
    }
    
    Important: Ensure all JSON strings are properly escaped and all quotes are closed properly.`;

    console.log("Sending prompt to OpenAI");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer for technology education. Create detailed, practical learning paths that help users master their chosen field. Ensure your JSON output is valid and properly formatted with all strings properly escaped.",
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

    if (!response.choices[0].message.content) {
      throw new Error("No response content from OpenAI");
    }

    let roadmapData;
    try {
      const content = response.choices[0].message.content;
      console.log("Parsing JSON response:", content.substring(0, 200) + "..."); // Log the beginning of the response
      roadmapData = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", response.choices[0].message.content);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }

    console.log("Successfully generated roadmap");

    // Validate roadmap data structure
    if (!roadmapData.topics || !Array.isArray(roadmapData.topics)) {
      throw new Error(
        "Invalid roadmap data structure: missing or invalid topics array"
      );
    }

    // Save roadmap to database
    const { error: insertError } = await supabase.from("user_roadmaps").insert({
      user_id: userId,
      career_path: careerPath,
      roadmap_data: roadmapData,
    });

    if (insertError) {
      console.error("Error saving roadmap:", insertError);
      throw new Error(`Failed to save roadmap: ${insertError.message}`);
    }

    res.json(roadmapData);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to generate roadmap",
    });
  }
});

// Delete existing roadmap for a user
router.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase
      .from("user_roadmaps")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to delete roadmap",
    });
  }
});

export default router;
