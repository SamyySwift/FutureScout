import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Compass,
  Award,
  BookOpen,
  Zap,
  GraduationCap,
  BrainCircuit,
  Briefcase,
} from "lucide-react";
import HeroImage from "@/components/HeroImage";
import FeatureCard from "@/components/FeatureCard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authType, setAuthType] = React.useState<"login" | "signup">("login");
  const { user, signOut } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    setAuthType("signup");
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthType("login");
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleAuthSuccess = () => {
    navigate("/dashboard");
    setShowAuthModal(false);
  };

  const handleAuthButtonClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white overflow-hidden relative">
      {/* Gradient background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="w-full py-6 px-8 flex items-center justify-between relative z-20 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            FutureScout
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#features"
            className="text-gray-300 hover:text-purple-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 hover:text-purple-500 transition-colors"
          >
            How It Works
          </a>
          {user ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => signOut()}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Log in
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                SignUp
              </Button>
            </>
          )}
        </div>
        <Button
          className="md:hidden"
          variant="outline"
          size="icon"
          onClick={handleAuthButtonClick}
        >
          <Compass className="h-5 w-5" />
        </Button>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-purple-600 p-4 rounded-lg shadow-2xl">
              <Zap className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Career Guidance
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover your perfect career path with personalized AI
            recommendations and expert guidance
          </p>
          {/* <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div> */}
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Career Assessment</h3>
            <p className="text-gray-400">
              Take our AI-powered career assessment to discover careers that
              match your skills and interests
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
            <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
            <p className="text-gray-400">
              Get personalized learning paths and course recommendations to
              achieve your career goals
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
            <p className="text-gray-400">
              Find relevant job opportunities that align with your skills and
              career aspirations
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-20 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Discover Your Perfect
            <span className="text-career-purple"> Career Path</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            AI-powered career recommendations based on your skills, interests,
            and market trends. Find your dream job and get a personalized
            learning roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard/quiz")}
            >
              Take Career Quiz
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2 mt-12 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HeroImage />
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-16 md:py-24 bg-[#0D0B14] relative overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powerful AI-Driven Features
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Leverage the power of artificial intelligence to make informed
              career decisions and chart your professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Career Matching
              </h3>
              <p className="text-gray-400">
                Get personalized career recommendations based on your skills,
                interests, and personality.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Learning Paths
              </h3>
              <p className="text-gray-400">
                Discover courses and certifications that will help you achieve
                your career goals.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Job Finder
              </h3>
              <p className="text-gray-400">
                Find relevant job and internship opportunities matched to your
                profile.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Resume Builder
              </h3>
              <p className="text-gray-400">
                Create a professional resume with AI-powered suggestions for
                improvement.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Industry Insights
              </h3>
              <p className="text-gray-400">
                Get real-time data on job market trends, in-demand skills, and
                salary benchmarks.
              </p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Compass className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Mentorship
              </h3>
              <p className="text-gray-400">
                Connect with industry mentors who can guide you on your career
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 bg-[#0D0B14] relative overflow-hidden"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform makes it easy to discover your ideal
              career path in just a few steps.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="path-connector hidden md:block"></div>

            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-16 relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Take the Career Assessment
                  </h3>
                  <p className="text-gray-400">
                    Answer questions about your skills, interests, values, and
                    work preferences to help our AI understand you better.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src="/images/assesment.jpg"
                    alt="Career Assessment Interface"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-16 relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-gray-400">
                    Our AI analyzes your profile and provides tailored career
                    recommendations with detailed insights.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 mr-0 md:mr-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src="/images/recommendation.jpg"
                    alt="AI Career Recommendations Dashboard"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Explore Your Learning Path
                  </h3>
                  <p className="text-gray-400">
                    Discover the skills, courses, and certifications you need to
                    succeed in your chosen career.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-12">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src="/images/explore.jpg"
                    alt="Interactive Learning Path"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Your Ideal Career Path?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who have found their dream careers
            using FutureScout. Start your journey today!
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started For Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-6 w-6 text-career-purple" />
                <span className="text-xl font-bold">FutureScout</span>
              </div>
              <p className="text-slate-400">
                AI-powered career guidance for the modern professional.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Career Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2023 FutureScout. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          type={authType}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Index;
