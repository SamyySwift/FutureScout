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
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-career-purple" />
          <span className="text-2xl font-bold">FutureScout</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#features"
            className="text-gray-600 hover:text-career-purple transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-career-purple transition-colors"
          >
            How It Works
          </a>
          {user ? (
            <>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => signOut()}>Log out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogin}>
                Log in
              </Button>
              <Button onClick={handleGetStarted}>Get Started</Button>
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
          <p className="text-lg md:text-xl text-white mb-8">
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
              onClick={() => navigate("/quiz")}
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
      <section id="features" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful AI-Driven Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Leverage the power of artificial intelligence to make informed
              career decisions and chart your professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-10 w-10 text-career-purple" />}
              title="Career Matching"
              description="Get personalized career recommendations based on your skills, interests, and personality."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-career-purple" />}
              title="Learning Paths"
              description="Discover courses and certifications that will help you achieve your career goals."
            />
            <FeatureCard
              icon={<Briefcase className="h-10 w-10 text-career-purple" />}
              title="Job Finder"
              description="Find relevant job and internship opportunities matched to your profile."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-career-purple" />}
              title="Resume Builder"
              description="Create a professional resume with AI-powered suggestions for improvement."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-career-purple" />}
              title="Industry Insights"
              description="Get real-time data on job market trends, in-demand skills, and salary benchmarks."
            />
            <FeatureCard
              icon={<Compass className="h-10 w-10 text-career-purple" />}
              title="Mentorship"
              description="Connect with industry mentors who can guide you on your career journey."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes it easy to discover your ideal
              career path in just a few steps.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="path-connector hidden md:block"></div>

            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-16 relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="career-card">
                  <div className="w-12 h-12 bg-career-purple text-white rounded-full flex items-center justify-center font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Take the Career Assessment
                  </h3>
                  <p className="text-gray-600">
                    Answer questions about your skills, interests, values, and
                    work preferences to help our AI understand you better.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-12">
                <img
                  src="/placeholder.svg"
                  alt="Career Assessment"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-16 relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
                <div className="career-card">
                  <div className="w-12 h-12 bg-career-purple text-white rounded-full flex items-center justify-center font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-gray-600">
                    Our AI analyzes your profile and provides tailored career
                    recommendations with detailed insights.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 mr-0 md:mr-12">
                <img
                  src="/placeholder.svg"
                  alt="Career Recommendations"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center relative">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="career-card">
                  <div className="w-12 h-12 bg-career-purple text-white rounded-full flex items-center justify-center font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Explore Your Learning Path
                  </h3>
                  <p className="text-gray-600">
                    Discover the skills, courses, and certifications you need to
                    succeed in your chosen career.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-12">
                <img
                  src="/placeholder.svg"
                  alt="Learning Path"
                  className="rounded-lg shadow-md w-full"
                />
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
