export interface CareerMatch {
  title: string;
  matchPercentage: number;
  description: string;
  salaryRange: string;
  growthPotential: string;
  keySkills: string[];
}

export interface Course {
  id: string;
  title: string;
  platform: "Udemy" | "Coursera" | "LinkedIn Learning";
  description: string;
  url: string;
  rating: number;
  price: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  order: number;
  prerequisites: string[];
}

export interface LearningPath {
  id: string;
  user_id: string;
  career_title: string;
  courses: Course[];
  total_duration: string;
  estimated_cost: string;
  priority_skills: string[];
  created_at: string;
  updated_at: string;
}

export interface CareerAssessment {
  id: string;
  user_id: string;
  answers: Record<string, string>;
  career_matches: CareerMatch[];
  completed_at: string;
  created_at: string;
}

export interface CourseCompletion {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  description: string;
  requirements: string[];
  salary_range?: string;
  application_url: string;
  posted_at: string;
  expires_at?: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      career_assessments: {
        Row: CareerAssessment;
        Insert: Omit<CareerAssessment, "id" | "created_at">;
        Update: Partial<Omit<CareerAssessment, "id" | "created_at">>;
      };
      learning_paths: {
        Row: LearningPath;
        Insert: Omit<LearningPath, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<LearningPath, "id" | "created_at" | "updated_at">>;
      };
      course_completions: {
        Row: CourseCompletion;
        Insert: Omit<CourseCompletion, "id" | "completed_at">;
        Update: Partial<Omit<CourseCompletion, "id" | "completed_at">>;
      };
      job_listings: {
        Row: JobListing;
        Insert: Omit<JobListing, "id" | "created_at">;
        Update: Partial<Omit<JobListing, "id" | "created_at">>;
      };
    };
  };
};
