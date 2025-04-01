import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { answers } = req.body;

    const prompt = `Based on the following career assessment responses, suggest 2-3 suitable career paths. For each career, provide:
1. A title
2. A match percentage (based on how well it aligns with the responses)
3. A brief description
4. Typical salary range
5. Growth potential
6. Key skills needed

Assessment Responses:
${Object.entries(answers)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

Please format the response as a JSON array of career matches with the following structure:
[
  {
    "title": "Career Title",
    "match": 85,
    "description": "Brief description",
    "salary": "Typical salary range",
    "growth": "Growth potential description",
    "skills": ["skill1", "skill2", "skill3"]
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a career counselor AI that provides personalized career recommendations based on user assessments. Provide realistic and practical career suggestions with accurate information about salaries, growth potential, and required skills.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const matches = JSON.parse(response);
    return res.status(200).json({ matches });
  } catch (error) {
    console.error("Error generating career matches:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate career matches" });
  }
}
