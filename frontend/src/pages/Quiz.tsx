import React from "react";
import CareerQuiz from "@/components/CareerQuiz";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <CareerQuiz />
    </div>
  );
};

export default QuizPage;
