import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

const Layout = () => {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user, loading } = useAuth();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent sidebar from closing
    setProfileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeProfileMenu = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("click", closeProfileMenu);
    } else {
      document.removeEventListener("click", closeProfileMenu);
    }

    return () => {
      document.removeEventListener("click", closeProfileMenu);
    };
  }, [profileMenuOpen]);

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
            <Link
              to="/dashboard"
              className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
            >
              <Compass className="h-7 w-7 shrink-0" />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-extrabold whitespace-pre text-black dark:text-white text-xl"
                >
                  Future Scout
                </motion.span>
              )}
            </Link>
            <div className="mt-8 flex flex-col gap-2">
              {[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                  icon: <LayoutDashboard className="h-5 w-5 ml-2 shrink-0" />,
                },
                {
                  label: "Career Quiz",
                  href: "/dashboard/quiz",
                  icon: <Brain className="h-5 w-5 ml-2 shrink-0" />,
                },
                {
                  label: "Learning Path",
                  href: "/dashboard/learning-path",
                  icon: <GraduationCap className="h-5 w-5 ml-2 shrink-0" />,
                },
                {
                  label: "Jobs & Internships",
                  href: "/dashboard/jobs",
                  icon: <Briefcase className="h-5 w-5 ml-2 shrink-0" />,
                },
                {
                  label: "Resume Optimizer",
                  href: "/dashboard/resume-optimizer",
                  icon: <User className="h-5 w-5 ml-2 shrink-0" />,
                },
              ].map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <SidebarLink
              link={{
                label: user?.user_metadata?.full_name || "User",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
              onClick={toggleProfileMenu}
            />

            {profileMenuOpen && (
              <div className="absolute bottom-12 left-0 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-md z-50">
                <ul className="flex flex-col">
                  <li>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800"
                    >
                      <User className="h-5 w-5" /> View Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-800"
                    >
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
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
