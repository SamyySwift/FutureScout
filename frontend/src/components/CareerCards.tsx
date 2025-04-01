import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CareerMatch {
  title: string;
  description: string;
  matchPercentage: number;
  salaryRange: string;
  growthPotential: string;
  keySkills: string[];
}

const CareerCards = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCareerMatches();
    }
  }, [user]);

  const fetchCareerMatches = async () => {
    try {
      // First get the most recent career assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("career_assessments")
        .select("*")
        .eq("user_id", user?.id)
        .order("completed_at", { ascending: false })
        .limit(1);

      if (assessmentError) throw assessmentError;

      if (!assessmentData || assessmentData.length === 0) {
        setMatches([]);
        return;
      }

      // Then get the career matches for this assessment
      const { data: matchesData, error: matchesError } = await supabase
        .from("career_matches")
        .select("matches")
        .eq("user_id", user?.id)
        .order("generated_at", { ascending: false })
        .limit(1);

      if (matchesError) throw matchesError;

      if (matchesData && matchesData.length > 0 && matchesData[0].matches) {
        setMatches(matchesData[0].matches);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("Error fetching career matches:", error);
      toast.error("Failed to load career matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please sign in to view your career matches
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              No career matches found. Take the career assessment quiz to get
              personalized recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent font-bold">
                {match.title}
              </span>
              <span className="text-sm font-bold">
                {match.matchPercentage}% Match
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-md mb-4 text-gray-600">{match.description}</p>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Salary Range:</p>
                <p className="text-sm text-muted-foreground">
                  {match.salaryRange}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Growth Potential:</p>
                <p className="text-sm text-muted-foreground">
                  {match.growthPotential}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Key Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {match.keySkills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="text-xs bg-purple-500 from-orange-500 to-purple-500 text-white font-semibold px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CareerCards;
