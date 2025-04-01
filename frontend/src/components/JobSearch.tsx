import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, MapPin, Building2 } from "lucide-react";
import { toast } from "sonner";
import type { JobListing } from "@/types/database";

const JobSearch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState<string>("all");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, jobType, location]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (jobType !== "all") {
        params.append("type", jobType);
      }
      if (location) {
        params.append("location", location);
      }
      if (user?.id) {
        params.append("userId", user.id);
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load job listings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{job.type}</Badge>
                <Badge variant="outline">{job.location}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="space-y-2">
                {job.salary_range && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Salary:</span>
                    <span>{job.salary_range}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span>Posted:</span>
                  <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
              {job.requirements && job.requirements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <div className="p-4 pt-0">
              <Button className="w-full" asChild>
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                No jobs found matching your criteria
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobSearch;
