import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import type { Request, Response } from "express";
import express from "express";
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: token,
  baseURL: endpoint,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const learningPathRouter = express.Router();

learningPathRouter.post(
  "/generate-learning-path",
  async (req: Request, res: Response) => {
    try {
      const { userId, careerTitle, requiredSkills } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not configured");
      }

      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error("Supabase credentials are not configured");
      }

      console.log("Generating learning path for:", {
        userId,
        careerTitle,
        requiredSkills,
      });

      const prompt = `Based on the career goal of becoming a ${careerTitle} and the required skills: ${requiredSkills.join(
        ", "
      )}, generate a personalized learning path with specific courses. Include 5-6 courses that will help develop the necessary skills.

The courses MUST be ordered in a logical progression, starting with fundamental prerequisites and building up to advanced topics. For example:
1. Start with basic/foundational skills that are required for more advanced topics
2. Progress to intermediate concepts that build upon the basics
3. Finally, cover advanced or specialized topics specific to the career

Format the response as a JSON object with the following structure:
{
  "career_title": "${careerTitle}",
  "courses": [
    {
      "id": "unique-id",
      "title": "Course Title",
      "platform": "Udemy/Coursera/edX/LinkedIn Learning",
      "description": "Brief course description",
      "url": "REQUIRED: Direct course URL that must be valid and accessible",
      "rating": 4.5,
      "price": "$XX.XX",
      "duration": "X hours",
      "level": "Beginner/Intermediate/Advanced",
      "skills": ["skill1", "skill2", "skill3"],
      "prerequisites": ["prerequisite1", "prerequisite2"],
      "order": 1
    }
  ],
  "total_duration": "Total duration of all courses",
  "estimated_cost": "Total cost of all courses",
  "priority_skills": ["Most important skills to focus on, ordered by learning sequence"]
}

Requirements:
1. ONLY include real, existing courses with VALID, ACCESSIBLE URLs
2. Verify that each course URL exists and is accessible
3. Order courses in a clear learning progression (use the 'order' field)
4. Include prerequisites for each course to show dependencies
5. Ensure earlier courses cover prerequisites needed for later courses
6. Focus on reputable platforms (Coursera, edX, Udemy, LinkedIn Learning)
7. Provide accurate pricing and duration information
8. Include a mix of free and paid courses when possible
9. Ensure the total duration and cost are realistic
10. For technical roles, start with fundamental courses (e.g., programming basics before machine learning)

Example progression for a Data Science career:
1. Python Programming Fundamentals
2. Statistics and Mathematics for Data Science
3. Data Analysis with Python
4. Machine Learning Basics
5. Advanced Machine Learning and Specializations`;

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "system",
            content:
              "You are a career advisor helping to create personalized learning paths. Provide specific, actionable course recommendations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from OpenAI");
      }

      const learningPath = JSON.parse(responseContent);
      console.log("Generated learning path:", learningPath);

      // Store the learning path in Supabase
      const insertData = {
        user_id: userId,
        career_title: learningPath.career_title,
        courses: learningPath.courses,
        total_duration: learningPath.total_duration,
        estimated_cost: learningPath.estimated_cost,
        priority_skills: learningPath.priority_skills,
      };

      console.log("Attempting to insert data:", insertData);

      const { data, error: insertError } = await supabase
        .from("learning_paths")
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error("Supabase error details:", {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
        throw new Error(
          `Failed to store learning path: ${insertError.message}`
        );
      }

      if (!data) {
        throw new Error("No data returned from Supabase insert");
      }

      console.log("Successfully stored learning path:", data);
      res.json(data);
    } catch (error) {
      console.error("Error generating learning path:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate learning path",
      });
    }
  }
);

export default learningPathRouter;
