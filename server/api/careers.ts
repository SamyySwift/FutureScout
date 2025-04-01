import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // Load environment variables

const careersRouter = express.Router();
// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN, // Ensure this is set in .env
  baseURL: "https://models.inference.ai.azure.com",
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

// Career Analysis Route
careersRouter.post("/career-analysis", async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { userId, answers } = req.body;

    // Check Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization token provided" });
    }
    const token = authHeader.split(" ")[1];

    // Verify User Authentication with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth error:", authError);
      return res.status(401).json({ error: "Invalid authorization token" });
    }

    console.log("Starting OpenAI API call...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a career guidance expert. Based on the user's responses to a career assessment quiz, suggest 5 career matches. Each career should include:
          - Title
          - Match percentage (0-100)
          - Brief description
          - Salary range
          - Growth potential (Low/Medium/High)
          - Key skills needed
          
          Format the response as a JSON array with these fields:
          [
            {
              "title": "Career Title",
              "matchPercentage": 85,
              "description": "Brief description",
              "salaryRange": "Salary range",
              "growthPotential": "Low/Medium/High",
              "keySkills": ["Skill 1", "Skill 2", "Skill 3"]
            }
          ]`,
        },
        {
          role: "user",
          content: `Based on these quiz responses, suggest 5 career matches: ${JSON.stringify(
            answers
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log(
      "OpenAI response received:",
      completion.choices[0]?.message?.content
    );

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response content from OpenAI");
    }

    const careerMatches = JSON.parse(
      responseContent.replace(/```json\n?|\n?```/g, "").trim()
    );
    console.log("Parsed career matches:", careerMatches);

    // Store results in Supabase
    const { data, error } = await supabase
      .from("career_assessments")
      .upsert({
        user_id: userId,
        answers,
        career_matches: careerMatches,
        completed_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ error: "Failed to store assessment results" });
    }

    console.log("Successfully stored assessment:", data);
    return res.json({ careers: careerMatches });
  } catch (error) {
    console.error("Error in careers API:", error);
    return res.status(500).json({
      error: "Failed to generate career matches",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default careersRouter;
