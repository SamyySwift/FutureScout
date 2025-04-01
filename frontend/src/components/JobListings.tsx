
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Building, Clock, BookmarkPlus, ExternalLink } from 'lucide-react';

const JobListings = () => {
  const jobs = [
    {
      title: "Data Scientist",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$110,000 - $140,000",
      posted: "2 days ago",
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"]
    },
    {
      title: "Machine Learning Engineer",
      company: "AI Solutions Ltd.",
      location: "Remote",
      type: "Full-time",
      salary: "$125,000 - $150,000",
      posted: "1 week ago",
      skills: ["TensorFlow", "PyTorch", "Python", "Deep Learning"]
    },
    {
      title: "Data Analyst",
      company: "DataDriven Co.",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80,000 - $95,000",
      posted: "3 days ago",
      skills: ["SQL", "Excel", "Tableau", "Statistical Analysis"]
    },
    {
      title: "Data Science Intern",
      company: "StartupX",
      location: "Austin, TX",
      type: "Internship",
      salary: "$25/hr",
      posted: "Just now",
      skills: ["Python", "Statistics", "R", "Data Analysis"]
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Opportunities</h2>
        <Button variant="outline">Set Job Alerts</Button>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search jobs..." className="pl-9" />
            </div>
            
            <Select defaultValue="location">
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">All Locations</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="type">
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {job.company}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="mb-2">{job.type}</Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {job.posted}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {job.salary}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="default">
                Apply Now
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button variant="outline">Load More Jobs</Button>
      </div>
    </div>
  );
};

export default JobListings;
