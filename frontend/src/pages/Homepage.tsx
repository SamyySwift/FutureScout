import React, { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import HeroImage from "@/components/HeroImage";
import FeatureCard from "@/components/FeatureCard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authType, setAuthType] = React.useState<"login" | "signup">("login");
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
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

        <div className="items-center gap-8 hidden md:flex">
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
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
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
                onClick={handleLogin}
                className="bg-transparent border border-white hover:bg-purple-500"
              >
                Log in
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md border border-gray-700"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-[200px] bg-gradient-to-br from-purple-600 to-purple-900 border-b border-gray-800 shadow-md py-4 px-6 flex flex-col gap-4 z-50">
          <a
            href="#features"
            className="text-gray-300 hover:text-purple-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 hover:text-purple-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            How It Works
          </a>
          {user ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/dashboard");
                  toggleMobileMenu();
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  signOut();
                  toggleMobileMenu();
                }}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  handleLogin();
                  toggleMobileMenu();
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Log in
              </Button>
              <Button
                onClick={() => {
                  handleGetStarted();
                  toggleMobileMenu();
                }}
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      )}

      {/* Main content */}

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
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 transition-opacity"
            >
              Get Started
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
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
                <BrainCircuit className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Career Assessment
              </h3>
              <p className="text-gray-400">
                Take our AI-powered career assessment to discover careers that
                match your skills and interests
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform makes it easy to discover your career path
              in just a few steps.
            </p>
          </div>

          <div className="w-full ">
            <StickyScroll content={content} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Your Ideal Career Path?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Join others who have found their dream careers using FutureScout.
            Start your journey today!
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-transparent border border-white"
          >
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

const content = [
  {
    title: " Take the Career Assessment",
    description:
      "Answer questions about your skills, interests, values, and work preferences to help our AI understand you better.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Take the Career Assessment
      </div>
    ),
  },
  {
    title: "Get Personalized Recommendations",
    description:
      "Our AI analyzes your profile and provides tailored career recommendations with detailed insights.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Explore Your Learning Path",
    description:
      "Discover the skills, courses, and certifications you need to succeed in your chosen career.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
        Explore Your Learning Path
      </div>
    ),
  },
  {
    title: "Resume Optimization",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Resume Builder
      </div>
    ),
  },
];

export default Index;
