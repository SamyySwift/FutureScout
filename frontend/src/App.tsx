import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Quiz from "@/components/CareerQuiz";
import LearningPath from "@/components/LearningPath";
import JobSearch from "@/components/JobSearch";
import Settings from "@/components/Settings";
import NotFound from "@/components/NotFound";
import Homepage from "@/pages/Homepage";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="learning-path" element={<LearningPath />} />
              <Route path="jobs" element={<JobSearch />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
