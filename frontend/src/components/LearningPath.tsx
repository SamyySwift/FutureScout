import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  Circle,
  BookOpen,
  Star,
  Clock,
  DollarSign,
  Trophy,
  Layout,
  Server,
  Database,
  Settings,
  Code,
  Terminal,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import type {
  Course,
  LearningPath as LearningPathType,
} from "@/types/database";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  generateRoadmap,
  fetchUserRoadmap,
  resetUserRoadmap,
} from "@/api/roadmap";

interface ExtendedCourse extends Course {
  tags: string[];
}

interface CustomLearningPath extends LearningPathType {
  courses: ExtendedCourse[];
}

interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  subtopics: {
    id: string;
    title: string;
    description: string;
  }[];
}

interface RoadmapData {
  topics: RoadmapTopic[];
}

const LearningPath = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<CustomLearningPath | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExistingLearningPath();
      fetchExistingRoadmap();
    }
  }, [user]);

  useEffect(() => {
    if (learningPath) {
      fetchCompletedCourses();
    }
  }, [learningPath]);

  const fetchCompletedCourses = async () => {
    if (!user?.id || !learningPath) return;

    try {
      const { data, error } = await supabase
        .from("course_completions")
        .select("course_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching completed courses:", error);
        return;
      }

      const completedSet = new Set(data.map((item) => item.course_id));
      setCompletedCourses(completedSet);

      // Calculate progress
      const totalCourses = learningPath.courses.length;
      const completedCount = completedSet.size;
      const progressPercentage =
        totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;
      setProgress(progressPercentage);
    } catch (err) {
      console.error("Error fetching completed courses:", err);
    }
  };

  const toggleCourseCompletion = async (courseId: string) => {
    if (!user?.id) return;

    try {
      const isCompleted = completedCourses.has(courseId);

      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from("course_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (error) throw error;
      } else {
        // Add completion
        const { error } = await supabase.from("course_completions").insert({
          user_id: user.id,
          course_id: courseId,
        });

        if (error) throw error;
      }

      // Update local state
      const newCompletedCourses = new Set(completedCourses);
      if (isCompleted) {
        newCompletedCourses.delete(courseId);
      } else {
        newCompletedCourses.add(courseId);
      }
      setCompletedCourses(newCompletedCourses);

      // Update progress
      const totalCourses = learningPath?.courses.length || 0;
      const completedCount = newCompletedCourses.size;
      const progressPercentage =
        totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;
      setProgress(progressPercentage);

      toast.success(
        isCompleted
          ? "Course marked as incomplete"
          : "Course marked as complete!"
      );
    } catch (err) {
      console.error("Error toggling course completion:", err);
      toast.error("Failed to update course status");
    }
  };

  const fetchExistingLearningPath = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Get the user's most recent learning path
      const { data: existingPath, error: fetchError } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error fetching learning path:", fetchError);
        throw new Error("Failed to fetch learning path");
      }

      if (existingPath) {
        setLearningPath(existingPath);
        return;
      }

      // If no learning path exists, generate one
      await generateNewLearningPath();
    } catch (err) {
      console.error("Error fetching learning path:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load learning path"
      );
      toast.error("Failed to load learning path");
    } finally {
      setLoading(false);
    }
  };

  const clearCompletedCourses = async () => {
    if (!user?.id) return;

    try {
      // Delete all course completions for the user
      const { error } = await supabase
        .from("course_completions")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      // Reset local state
      setCompletedCourses(new Set());
      setProgress(0);
      toast.success("Progress reset successfully");
    } catch (err) {
      console.error("Error clearing course completions:", err);
      toast.error("Failed to reset progress");
    }
  };

  const generateNewLearningPath = async () => {
    try {
      setGenerating(true);
      setError(null);

      // Clear completed courses first
      await clearCompletedCourses();

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Get the user's most recent career assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from("career_assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      if (assessmentError) {
        console.error("Assessment error:", assessmentError);
        throw new Error(
          "Failed to fetch career assessment. Retake the quiz to generate a new learning path."
        );
      }

      if (!assessment) {
        setError("Please complete the career assessment first");
        return;
      }

      // Get the career matches from the assessment
      const careerMatches = assessment.career_matches;
      if (!careerMatches || careerMatches.length === 0) {
        setError("No career matches found");
        return;
      }

      // Get the top career match
      const topCareer = careerMatches[0];

      // Generate learning path using OpenAI
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASEURL
        }/api/learning-path/generate-learning-path`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            careerTitle: topCareer.title,
            requiredSkills: topCareer.keySkills,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate learning path");
      }

      const data = await response.json();
      setLearningPath(data);
      resetRoadmap();
    } catch (err) {
      console.error("Error generating learning path:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate learning path"
      );
      toast.error("Failed to generate learning path");
    } finally {
      setGenerating(false);
    }
  };

  const getIconForTopic = (iconName: string) => {
    switch (iconName) {
      case "layout":
        return <Layout className="w-4 h-4" />;
      case "server":
        return <Server className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "settings":
        return <Settings className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      case "terminal":
        return <Terminal className="w-4 h-4" />;
      case "globe":
        return <Globe className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const fetchExistingRoadmap = async () => {
    if (!user?.id) return;

    try {
      setLoadingRoadmap(true);
      setError(null);

      const data = await fetchUserRoadmap(user.id);
      if (data) {
        setRoadmapData(data);
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      // Don't show error to user, they'll just see the "Generate Roadmap" button
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const generateCareerRoadmap = async () => {
    if (!user?.id || !learningPath?.career_title) {
      toast.error("Cannot generate roadmap - missing career information");
      return;
    }

    try {
      setGeneratingRoadmap(true);
      setError(null);

      // Get user's current skills from completed courses
      const currentSkills =
        learningPath?.courses
          .filter((course) => completedCourses.has(course.id))
          .flatMap((course) => course.skills) || [];

      console.log("Generating roadmap with:", {
        careerPath: learningPath.career_title,
        currentSkills,
      });

      const data = await generateRoadmap(
        learningPath.career_title,
        currentSkills,
        user.id
      );
      console.log("Received roadmap data:", data);
      setRoadmapData(data);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      let errorMessage = "Failed to generate roadmap";

      if (error instanceof Error) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }

      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          errorMessage = `${errorMessage}: ${
            errorData.error || error.statusText
          }`;
        } catch (e) {
          errorMessage = `${errorMessage}: ${error.statusText || error.status}`;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const resetRoadmap = async () => {
    if (!user?.id) return;

    try {
      setGeneratingRoadmap(true);
      await resetUserRoadmap(user.id);
      setRoadmapData(null);
      toast.success("Roadmap reset successfully");
    } catch (error) {
      console.error("Error resetting roadmap:", error);
      toast.error("Failed to reset roadmap");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">
          Retrieving your learning path...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={generateNewLearningPath}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!learningPath) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No learning path available
            </p>
            <Button onClick={generateNewLearningPath}>
              Generate Learning Path
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-owners">
            Your Personalized Learning Path
          </h1>
          <Button
            onClick={generateNewLearningPath}
            disabled={generating}
            className="flex items-center gap-2 bg-purple-500"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate New Path
              </>
            )}
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              {/* Career Title */}
              <div className="flex items-center gap-2">
                <Badge className="text-base px-4 py-1.5 bg-purple-500">
                  {learningPath.career_title}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Career Path
                </span>
              </div>
              {/* Progress Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {/* Circular progress background */}
                    <div className="w-24 h-24 rounded-full border-8 border-gray-100">
                      {/* Circular progress fill */}
                      <svg className="absolute top-0 left-0 w-24 h-24 transform -rotate-90">
                        <circle
                          className="text-primary transition-all duration-300"
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(progress / 100) * 251.2} 251.2`}
                        />
                      </svg>
                      {/* Percentage text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-owners">
                      Course Progress
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCourses.size} of {learningPath.courses.length}{" "}
                      courses completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {progress === 100 && (
                    <div className="flex items-center gap-2 text-primary">
                      <Trophy className="h-5 w-5" />
                      <span className="font-medium">Path Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-owners">
              Required Skills Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {learningPath.priority_skills.map((skill, index) => (
                    <Badge
                      key={index}
                      // variant="secondary"
                      className="text-sm px-3 py-1 text-white bg-purple-500"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 font-owners">
                  Course Learning Path Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium">Total Duration:</p>
                    <p>{learningPath.total_duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">Estimated Cost:</p>
                    <p>{learningPath.estimated_cost}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Roadmap */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="">Your Learning Roadmap</CardTitle>
              <p className="text-sm text-muted-foreground">
                A comprehensive guide for{" "}
                {learningPath?.career_title || "your career path"}
              </p>
            </div>
            {roadmapData && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetRoadmap}
                disabled={generatingRoadmap}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Roadmap
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingRoadmap || generatingRoadmap ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    {generatingRoadmap
                      ? "Generating your roadmap..."
                      : "Loading roadmap..."}
                  </p>
                </div>
              </div>
            ) : roadmapData ? (
              <div className="space-y-8">
                {roadmapData.topics
                  .sort((a, b) => {
                    // Sort by difficulty: beginner -> intermediate -> advanced
                    const difficultyOrder = {
                      beginner: 1,
                      intermediate: 2,
                      advanced: 3,
                    };
                    return (
                      difficultyOrder[a.difficulty] -
                      difficultyOrder[b.difficulty]
                    );
                  })
                  .map((topic, index) => (
                    <div key={topic.id} className="relative">
                      {/* Topic Card */}
                      <Card
                        className={cn(
                          "transition-all duration-200 hover:shadow-md",
                          topic.difficulty === "beginner" &&
                            "border-green-500/20",
                          topic.difficulty === "intermediate" &&
                            "border-blue-500/20",
                          topic.difficulty === "advanced" &&
                            "border-purple-500/20"
                        )}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {topic.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {topic.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getIconForTopic(topic.icon)}
                              <Badge
                                className={
                                  topic.difficulty === "beginner"
                                    ? "bg-blue-500"
                                    : topic.difficulty === "intermediate"
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                                }
                              >
                                {topic.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            {topic.subtopics.map((subtopic) => (
                              <div
                                key={subtopic.id}
                                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                              >
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {subtopic.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {subtopic.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No roadmap available
                </p>
                <Button
                  onClick={generateCareerRoadmap}
                  disabled={generatingRoadmap}
                  className="mt-4"
                >
                  {generatingRoadmap ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Roadmap"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mt-10">Recommended Courses</h2>
          <div className="grid gap-6">
            {learningPath.courses
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((course, index) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg font-owners">
                          {course.title}
                        </CardTitle>
                      </div>
                      <Badge
                        variant={
                          completedCourses.has(course.id)
                            ? "default"
                            : "outline"
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.platform}</span>
                      </div>
                      <p className="text-sm">{course.description}</p>

                      {/* Prerequisites */}
                      {course.prerequisites &&
                        course.prerequisites.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium font-owners">
                              Prerequisites:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {course.prerequisites.map((prereq, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{course.price}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(course.url, "_blank")}
                        >
                          View Course
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => toggleCourseCompletion(course.id)}
                        >
                          {completedCourses.has(course.id) ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
