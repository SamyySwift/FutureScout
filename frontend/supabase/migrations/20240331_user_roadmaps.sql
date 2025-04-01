-- Create user_roadmaps table to store generated roadmaps
CREATE TABLE IF NOT EXISTS "user_roadmaps" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "career_path" TEXT NOT NULL,
  "roadmap_data" JSONB NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE "user_roadmaps" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own roadmaps
CREATE POLICY "Users can view their own roadmaps" 
ON "user_roadmaps" FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own roadmaps
CREATE POLICY "Users can insert their own roadmaps" 
ON "user_roadmaps" FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own roadmaps
CREATE POLICY "Users can update their own roadmaps" 
ON "user_roadmaps" FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own roadmaps
CREATE POLICY "Users can delete their own roadmaps" 
ON "user_roadmaps" FOR DELETE 
USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS "user_roadmaps_user_id_idx" ON "user_roadmaps" (user_id);

-- Create index on created_at for sorting by most recent
CREATE INDEX IF NOT EXISTS "user_roadmaps_created_at_idx" ON "user_roadmaps" (created_at); 