import { createClient } from "@supabase/supabase-js";
import type { Request, Response } from "express";
import { Database } from "@/types/database";
import axios from "axios";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const INDEED_API_KEY = process.env.INDEED_API_KEY;
const INDEED_PUBLISHER_ID = process.env.INDEED_PUBLISHER_ID;

interface IndeedJob {
  jobkey: string;
  jobtitle: string;
  company: string;
  city: string;
  state: string;
  country: string;
  formattedLocation: string;
  source: string;
  date: string;
  snippet: string;
  url: string;
  latitude: number;
  longitude: number;
  jobtypes: string[];
  formattedRelativeTime: string;
}

export async function GET(req: Request, res: Response) {
  try {
    const { search, type, location } = req.query;
    const userId = req.query.userId;

    // First, get the user's learning path to understand their career goals
    let userSkills: string[] = [];
    if (userId) {
      const { data: learningPath, error: learningPathError } = await supabase
        .from("learning_paths")
        .select("prioritySkills")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(1)
        .single();

      if (!learningPathError && learningPath) {
        userSkills = learningPath.prioritySkills;
      }
    }

    // Build Indeed API query
    const query = search || userSkills.join(" ");
    const locationParam = location || "United States";
    const jobTypeParam = type && type !== "all" ? type : "";

    // Call Indeed API
    const indeedResponse = await axios.get(
      `https://api.indeed.com/ads/apisearch`,
      {
        params: {
          publisher: INDEED_PUBLISHER_ID,
          v: "2",
          format: "json",
          q: query,
          l: locationParam,
          userip: req.ip,
          useragent: req.get("user-agent"),
          limit: 25,
          start: 0,
          fromage: 30,
          sort: "date",
          filter: 0,
          latlong: 1,
          co: "US",
          chnl: "",
          jt: jobTypeParam,
        },
        headers: {
          Authorization: `Bearer ${INDEED_API_KEY}`,
        },
      }
    );

    // Transform Indeed jobs to our format
    const transformedJobs = indeedResponse.data.results.map(
      (job: IndeedJob) => ({
        id: job.jobkey,
        title: job.jobtitle,
        company: job.company,
        location: job.formattedLocation,
        type: job.jobtypes?.[0] || "full-time",
        description: job.snippet,
        requirements: [], // Indeed API doesn't provide structured requirements
        salary_range: "", // Indeed API doesn't provide salary in basic search
        application_url: job.url,
        posted_at: new Date(job.date).toISOString(),
        source: "Indeed",
      })
    );

    // Store the jobs in our database for caching
    const { error: insertError } = await supabase
      .from("job_listings")
      .upsert(transformedJobs, {
        onConflict: "id",
      });

    if (insertError) {
      console.error("Error storing jobs:", insertError);
    }

    return res.json(transformedJobs);
  } catch (error) {
    console.error("Error in GET /api/jobs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const jobData = req.body;

    // Validate required fields
    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.location ||
      !jobData.type
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("job_listings")
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return res.status(500).json({ error: "Failed to create job" });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error in POST /api/jobs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
