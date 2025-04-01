interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  subtopics: {
    id: string;
    title: string;
    description: string;
  }[];
}

interface RoadmapData {
  topics: RoadmapTopic[];
}

const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

// Fetch existing roadmap for a user
export const fetchUserRoadmap = async (
  userId: string
): Promise<RoadmapData | null> => {
  try {
    const response = await fetch(`${API_URL}/api/roadmap/user/${userId}`);

    if (response.status === 404) {
      return null; // No roadmap found
    }

    if (!response.ok) {
      throw new Error("Failed to fetch roadmap");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user roadmap:", error);
    throw error;
  }
};

// Generate new roadmap
export const generateRoadmap = async (
  careerPath: string,
  currentSkills: string[],
  userId: string
): Promise<RoadmapData> => {
  try {
    const response = await fetch(`${API_URL}/api/roadmap/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ careerPath, currentSkills, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate roadmap");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};

// Delete roadmap for a user
export const resetUserRoadmap = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/roadmap/user/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to reset roadmap");
    }
  } catch (error) {
    console.error("Error resetting roadmap:", error);
    throw error;
  }
};
