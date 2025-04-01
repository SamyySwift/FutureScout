import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CareerMatch } from "@/types/database";
import CareerCards from "@/components/CareerCards";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);

  useEffect(() => {
    if (user) {
      fetchCareerMatches();
    }
  }, [user]);

  const fetchCareerMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("career_matches")
        .select("matches")
        .eq("user_id", user?.id)
        .order("generated_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].matches) {
        // The matches are stored in the JSON column
        setCareerMatches(data[0].matches);
      } else {
        setCareerMatches([]);
      }
    } catch (error) {
      console.error("Error fetching career matches:", error);
      toast.error("Failed to load career matches");
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
              Please sign in to view your dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-md font-bold m-4">
        Welcome,{" "}
        <span className="text-gray-700  font-light">
          {user.user_metadata.full_name}
        </span>
      </h1>
      <div className="container mx-auto py-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Career Matches</h1>
          </div>
          <CareerCards />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
