import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; data: Session | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null; data: Session | null }>;
  signOut: () => Promise<void>;
  updateUserInfo: (updatedInfo: {
    full_name?: string;
  }) => Promise<{ error: Error | null }>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LAST_PATH_KEY = "lastPath";
const saveLastPath = (path: string) => {
  if (path && path !== "/" && !path.includes("/auth")) {
    localStorage.setItem(LAST_PATH_KEY, path);
  }
};
const getLastPath = (): string =>
  localStorage.getItem(LAST_PATH_KEY) || "/dashboard";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname) {
      saveLastPath(location.pathname);
    }
  }, [location.pathname, user]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === "SIGNED_IN") {
        // navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        navigate("/");
        localStorage.removeItem(LAST_PATH_KEY);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (currentSession && location.pathname === "/") {
        navigate(getLastPath());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      return { error: response.error, data: response.data.session };
    } catch (error) {
      setLoading(false);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Unknown error during sign in"),
        data: null,
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      return { error: response.error, data: response.data.session };
    } catch (error) {
      setLoading(false);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Unknown error during sign up"),
        data: null,
      };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  // update user info
  const updateUserInfo = async (updatedInfo: { full_name?: string }) => {
    if (!user) {
      return { error: new Error("No user logged in") };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updatedInfo,
      });

      if (error) throw error;

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              user_metadata: { ...prevUser.user_metadata, ...updatedInfo },
            }
          : null
      );

      return { error: null };
    } catch (error) {
      console.error("Failed to update user info:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Failed to update user info"),
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    updateUserInfo,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
