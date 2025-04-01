import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuizAnswers {
  career_goal: string;
  interests: string[];
  skills: string[];
  values: string;
  environment: string;
  experience: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { quizAnswers, userId } = await req.json();

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    const openai = new OpenAIApi(configuration);

    // Format the prompt for career analysis
    const prompt = `Based on the following career assessment answers, suggest 3-5 career paths that would be a good fit. For each career, provide:
1. A match percentage (0-100%)
2. A brief description
3. Typical salary range
4. Growth potential
5. Key skills needed

Career Goal: ${quizAnswers.career_goal}
Interests: ${quizAnswers.interests.join(", ")}
Skills: ${quizAnswers.skills.join(", ")}
Values: ${quizAnswers.values}
Preferred Environment: ${quizAnswers.environment}
Experience Level: ${quizAnswers.experience}

Format the response as a JSON array of careers with the following structure:
{
  "careers": [
    {
      "title": "Career Title",
      "description": "Brief description",
      "matchPercentage": 85,
      "salaryRange": "Typical salary range",
      "growthPotential": "Growth potential description",
      "keySkills": ["skill1", "skill2", "skill3"]
    }
  ]
}`;

    // Get career suggestions from OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a career counselor helping to match people with suitable career paths based on their assessment answers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the response
    const careers = JSON.parse(response);

    return new Response(JSON.stringify(careers), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in analyze-career function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
