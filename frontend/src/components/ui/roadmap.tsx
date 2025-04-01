import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Code,
  Database,
  Globe,
  Layout,
  Server,
  Settings,
  Terminal,
} from "lucide-react";

interface RoadmapNode {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  difficulty?: "beginner" | "intermediate" | "advanced";
  children?: RoadmapNode[];
  isCompleted?: boolean;
}

interface RoadmapProps {
  data: RoadmapNode[];
  onNodeClick?: (nodeId: string) => void;
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "from-green-500 to-green-600";
    case "intermediate":
      return "from-blue-500 to-blue-600";
    case "advanced":
      return "from-purple-500 to-purple-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

const RoadmapNode: React.FC<{
  node: RoadmapNode;
  level?: number;
  onNodeClick?: (nodeId: string) => void;
}> = ({ node, level = 0, onNodeClick }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = level === 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-4",
        level > 0 && "ml-6 mt-2"
      )}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => onNodeClick?.(node.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all duration-200",
          isRoot
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : cn(
                "bg-gradient-to-r",
                getDifficultyColor(node.difficulty),
                "text-white hover:shadow-md"
              ),
          node.isCompleted && "ring-2 ring-green-500"
        )}
      >
        {node.icon}
        <div>
          <span className="text-sm font-medium whitespace-pre">
            {node.title}
          </span>
          {node.description && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              className="text-xs text-white/80 mt-1 overflow-hidden"
            >
              {node.description}
            </motion.p>
          )}
        </div>
        {node.difficulty && !isRoot && (
          <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">
            {node.difficulty}
          </span>
        )}
      </motion.div>

      {hasChildren && (
        <div className="flex flex-col gap-2">
          {node.children.map((child, index) => (
            <React.Fragment key={child.id}>
              <div className="relative">
                <div
                  className={cn(
                    "absolute left-[-12px] top-1/2 h-6 w-px",
                    child.isCompleted
                      ? "bg-green-500"
                      : "bg-neutral-300 dark:bg-neutral-600"
                  )}
                />
                <RoadmapNode
                  node={child}
                  level={level + 1}
                  onNodeClick={onNodeClick}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export const Roadmap: React.FC<RoadmapProps> = ({ data = [], onNodeClick }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-6">
        <div className="flex flex-col gap-8">
          {data.map((node) => (
            <RoadmapNode key={node.id} node={node} onNodeClick={onNodeClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
