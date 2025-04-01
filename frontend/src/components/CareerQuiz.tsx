import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Trash2 } from "lucide-react";
import type { CareerAssessment } from "@/types/database";

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    interests: [] as string[],
    skills: [] as string[],
    environment: "",
    values: "",
    experience: "",
    career_goal: "",
    preferences: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [previousAssessments, setPreviousAssessments] = useState<
    CareerAssessment[]
  >([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const questions = [
    {
      id: "career_goal",
      title: "What is your career goal?",
      description:
        "Describe your ideal career path or role (e.g., 'I want to become an AI Engineer' or 'I aspire to be a Data Scientist'). If you're unsure, describe what kind of work you enjoy doing.",
      type: "text",
      placeholder: "Enter your career goal here...",
    },
    {
      id: "interests",
      title: "What are you most interested in?",
      description:
        "Select all that apply to you. Choose the areas that genuinely excite you.",
      type: "checkbox",
      options: [
        { id: "technology", label: "Technology & Computing" },
        { id: "science", label: "Science & Research" },
        { id: "business", label: "Business & Finance" },
        { id: "creative", label: "Creative Arts & Design" },
        { id: "healthcare", label: "Healthcare & Medicine" },
        { id: "education", label: "Education & Teaching" },
        { id: "social", label: "Social Sciences & Services" },
        { id: "engineering", label: "Engineering & Architecture" },
        { id: "environment", label: "Environment & Sustainability" },
        { id: "media", label: "Media & Communications" },
        { id: "sports", label: "Sports & Fitness" },
        { id: "legal", label: "Legal & Justice" },
        { id: "agriculture", label: "Agriculture & Food" },
        { id: "trades", label: "Skilled Trades & Crafts" },
        { id: "military", label: "Military & Defense" },
        { id: "entertainment", label: "Entertainment & Performance" },
      ],
    },
    {
      id: "skills",
      title: "What skills are you most confident in?",
      description:
        "Select all that apply to you. Include both technical and soft skills.",
      type: "checkbox",
      options: [
        // Technical Skills
        { id: "programming", label: "Programming & Software Development" },
        { id: "data", label: "Data Analysis & Statistics" },
        { id: "design", label: "Design & Visual Communication" },
        { id: "writing", label: "Writing & Communication" },
        { id: "research", label: "Research & Analysis" },
        { id: "problem-solving", label: "Problem Solving & Critical Thinking" },
        { id: "interpersonal", label: "Interpersonal & People Skills" },
        { id: "management", label: "Management & Leadership" },
        // Additional Technical Skills
        { id: "ai-ml", label: "AI & Machine Learning" },
        { id: "cybersecurity", label: "Cybersecurity" },
        { id: "cloud", label: "Cloud Computing" },
        { id: "mobile-dev", label: "Mobile Development" },
        { id: "web-dev", label: "Web Development" },
        { id: "database", label: "Database Management" },
        { id: "networking", label: "Networking & Infrastructure" },
        { id: "devops", label: "DevOps & CI/CD" },
        // Soft Skills
        { id: "communication", label: "Verbal & Written Communication" },
        { id: "teamwork", label: "Teamwork & Collaboration" },
        { id: "adaptability", label: "Adaptability & Flexibility" },
        { id: "creativity", label: "Creativity & Innovation" },
        { id: "time-management", label: "Time Management" },
        { id: "negotiation", label: "Negotiation & Persuasion" },
        { id: "public-speaking", label: "Public Speaking" },
        { id: "emotional-intelligence", label: "Emotional Intelligence" },
        // Industry-Specific Skills
        { id: "project-management", label: "Project Management" },
        { id: "financial-analysis", label: "Financial Analysis" },
        { id: "marketing", label: "Marketing & Branding" },
        { id: "sales", label: "Sales & Business Development" },
        { id: "customer-service", label: "Customer Service" },
        { id: "quality-assurance", label: "Quality Assurance" },
        { id: "technical-writing", label: "Technical Writing" },
        { id: "data-visualization", label: "Data Visualization" },
      ],
    },
    {
      id: "values",
      title: "What do you value most in a career?",
      description: "Choose the option that best describes your priorities.",
      type: "radio",
      options: [
        { id: "salary", label: "High income potential" },
        { id: "work-life", label: "Work-life balance" },
        { id: "impact", label: "Making a positive impact" },
        { id: "growth", label: "Learning & growth opportunities" },
        { id: "creativity", label: "Creative freedom & expression" },
        { id: "stability", label: "Job security & stability" },
        { id: "autonomy", label: "Autonomy & independence" },
        { id: "recognition", label: "Recognition & prestige" },
        { id: "flexibility", label: "Schedule flexibility" },
        { id: "purpose", label: "Sense of purpose" },
        { id: "innovation", label: "Innovation & cutting-edge work" },
        { id: "mentorship", label: "Mentorship & teaching others" },
      ],
    },
    {
      id: "environment",
      title: "What type of work environment do you prefer?",
      description:
        "Choose the option that best describes your ideal workplace.",
      type: "radio",
      options: [
        { id: "corporate", label: "Corporate office setting" },
        { id: "startup", label: "Fast-paced startup environment" },
        { id: "remote", label: "Remote work from anywhere" },
        { id: "outdoor", label: "Outdoors or field work" },
        { id: "research", label: "Research or laboratory setting" },
        { id: "community", label: "Community or social setting" },
        { id: "academic", label: "Academic or educational setting" },
        { id: "healthcare", label: "Healthcare or medical setting" },
        { id: "industrial", label: "Industrial or manufacturing setting" },
        { id: "creative", label: "Creative or artistic environment" },
        { id: "government", label: "Government or public sector" },
        { id: "nonprofit", label: "Non-profit or charitable organization" },
      ],
    },
    {
      id: "experience",
      title: "What is your current experience level?",
      description:
        "Choose the option that best describes your professional experience.",
      type: "radio",
      options: [
        { id: "student", label: "Student or recent graduate" },
        { id: "entry", label: "Entry-level professional" },
        { id: "mid", label: "Mid-level professional (3-5 years)" },
        { id: "senior", label: "Senior professional (5+ years)" },
        { id: "executive", label: "Executive or leadership role" },
        { id: "career-changer", label: "Changing careers from another field" },
        { id: "intern", label: "Intern or trainee" },
        { id: "freelancer", label: "Freelancer or self-employed" },
        { id: "entrepreneur", label: "Entrepreneur or business owner" },
        { id: "academic", label: "Academic or researcher" },
        { id: "military", label: "Military or service background" },
        { id: "retired", label: "Retired or semi-retired" },
      ],
    },
    {
      id: "preferences",
      title: "What are your work preferences?",
      description: "Select all that apply to your preferred work style.",
      type: "checkbox",
      options: [
        { id: "structured", label: "Structured and organized work" },
        { id: "flexible", label: "Flexible and adaptable schedule" },
        { id: "team", label: "Team-based collaboration" },
        { id: "independent", label: "Independent work" },
        { id: "fast-paced", label: "Fast-paced environment" },
        { id: "steady", label: "Steady and predictable pace" },
        { id: "travel", label: "Regular travel opportunities" },
        { id: "local", label: "Local work with minimal travel" },
        { id: "creative", label: "Creative problem-solving" },
        { id: "analytical", label: "Analytical and detail-oriented" },
        { id: "customer-facing", label: "Customer-facing interactions" },
        { id: "behind-scenes", label: "Behind-the-scenes work" },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  useEffect(() => {
    if (user) {
      fetchPreviousAssessments();
    }
  }, [user]);

  const fetchPreviousAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from("career_assessments")
        .select("*")
        .eq("user_id", user?.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setPreviousAssessments(data || []);
    } catch (error) {
      console.error("Error fetching previous assessments:", error);
      toast.error("Failed to load previous assessments");
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      setDeletingId(assessmentId);

      // Delete the assessment (which includes the career matches)
      const { error: assessmentError } = await supabase
        .from("career_assessments")
        .delete()
        .eq("id", assessmentId);

      if (assessmentError) throw assessmentError;

      // Update the local state
      setPreviousAssessments((prev) =>
        prev.filter((a) => a.id !== assessmentId)
      );
      toast.success("Assessment deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNext = () => {
    // Validate current step
    const currentAnswer = answers[currentQuestion.id];

    if (
      currentQuestion.type === "text" &&
      (!currentAnswer || currentAnswer.trim() === "")
    ) {
      toast.error("Please enter your career goal");
      return;
    }

    if (
      !currentAnswer ||
      (Array.isArray(currentAnswer) && currentAnswer.length === 0)
    ) {
      toast.error("Please select at least one option");
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit the quiz
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const currentValues = answers[currentQuestion.id] || [];

    let newValues;
    if (checked) {
      newValues = [...currentValues, id];
    } else {
      newValues = currentValues.filter((value: string) => value !== id);
    }

    setAnswers({
      ...answers,
      [currentQuestion.id]: newValues,
    });
  };

  const handleRadioChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleTextChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to save your results");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No active session");
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/careers/career-analysis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            answers: {
              interests: answers.interests || [],
              skills: answers.skills || [],
              work_environment: answers.environment || "",
              work_life_balance: answers.values || "",
              experience_level: answers.experience || "",
              goals: answers.career_goal || "",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to analyze career matches");
      }

      const data = await response.json();

      if (!data.careers) {
        console.error("No careers data returned from server");
        throw new Error("No career matches generated");
      }

      // get the id of the current career assessment
      const { data: assessmentData } = await supabase
        .from("career_assessments")
        .select("id")
        .single();

      const assessmentId = assessmentData.id;

      // Save career matches to user's profile
      const { error: matchesError } = await supabase
        .from("career_matches")
        .upsert({
          user_id: user.id,
          matches: data.careers,
          generated_at: new Date().toISOString(),
          assessment_id: assessmentId,
        });

      if (matchesError) {
        console.error("Error saving career matches:", matchesError);
        throw new Error("Failed to save career matches");
      }

      toast.success("Career assessment completed!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (error instanceof Error) {
        if (error.message === "Failed to fetch") {
          toast.error(
            "Could not connect to the server. Please check if the server is running."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to process your results. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Career Assessment Quiz
        </h1>

        {/* Previous Assessments Section */}
        {user && previousAssessments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Previous Assessments
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previousAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {new Date(assessment.completed_at).toLocaleDateString()}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAssessment(assessment.id)}
                      disabled={deletingId === assessment.id}
                    >
                      {deletingId === assessment.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Career Goal:</p>
                      <p>{assessment.answers.career_goal}</p>
                    </div>
                    {assessment.career_matches &&
                      assessment.career_matches.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Top Match:</p>
                          <p className="text-sm text-muted-foreground">
                            {assessment.career_matches[0].title} (
                            {assessment.career_matches[0].matchPercentage}%
                            match)
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "text" && (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                className="min-h-[100px]"
              />
            )}

            {currentQuestion.type === "checkbox" && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={(answers[currentQuestion.id] || []).includes(
                        option.id
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === "radio" && (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleRadioChange}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {currentStep === totalSteps - 1
                ? loading
                  ? "Analyzing..."
                  : "Submit"
                : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
