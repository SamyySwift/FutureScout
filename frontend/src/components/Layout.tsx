import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Compass,
  LogOut,
  Brain,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Compass className="h-7 w-7 shrink-0" />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-extrabold whitespace-pre text-black dark:text-white text-xl"
      >
        Future Scout
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Compass className="h-7 w-7 shrink-0" />
    </Link>
  );
};

const Layout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    // Only redirect to home if not authenticated and not loading
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Career Quiz",
      href: "/dashboard/quiz",
      icon: (
        <Brain className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Learning Path",
      href: "/dashboard/learning-path",
      icon: (
        <GraduationCap className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Jobs & Internships",
      href: "/dashboard/jobs",
      icon: (
        <Briefcase className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Resume Optimizer",
      href: "/dashboard/resume-optimizer",
      icon: (
        <User className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // {
    //   label: "Profile",
    //   href: "/dashboard/settings",
    //   icon: (
    //     <User className="h-5 w-5 ml-2 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },
    {
      label: "Sign Out",
      href: "/",
      icon: <LogOut className="h-5 w-5 ml-2 shrink-0 text-red-500" />,
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-neutral-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the layout if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={(e) => {
                    if (link.label === "Sign Out") {
                      e.preventDefault();
                      handleSignOut();
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.user_metadata?.full_name || "User",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
