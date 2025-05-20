"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  BookOpen,
  Clock,
  Users,
  BarChart,
} from "lucide-react";
import Link from "next/link";

const CourseCard = ({ course }) => {
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -8,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: {
        bg: "bg-emerald-600",
        progress: "bg-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-700",
        text: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-800",
      },
      intermediate: {
        bg: "bg-blue-600",
        progress: "bg-blue-500",
        button: "bg-blue-600 hover:bg-blue-700",
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-800",
      },
      moderate: {
        bg: "bg-amber-600",
        progress: "bg-amber-500",
        button: "bg-amber-600 hover:bg-amber-700",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-800",
      },
      advanced: {
        bg: "bg-purple-600",
        progress: "bg-purple-500",
        button: "bg-purple-600 hover:bg-purple-700",
        text: "text-purple-600",
        badge: "bg-purple-100 text-purple-800",
      },
    };
    return colors[level?.toLowerCase()] || colors.beginner;
  };

  const courseName =
    course?.name || course?.courseJson?.course?.name || "Untitled Course";
  const description =
    course?.description || course?.courseJson?.course?.description || "";
  const difficultyLevel =
    course?.difficultyLevel ||
    course?.courseJson?.course?.difficultyLevel ||
    "beginner";
  const categories =
    course?.categories ||
    (course?.courseJson?.course?.categories &&
    Array.isArray(course?.courseJson?.course?.categories)
      ? course.courseJson.course.categories[0]
      : course?.courseJson?.course?.categories || "Programming");
  const moduleCount =
    course?.noOfModules || course?.courseJson?.course?.noOfModules || 0;

  const getTotalHours = () => {
    if (course?.courseJson?.course?.modules) {
      let totalMinutes = 0;
      course.courseJson.course.modules.forEach((module) => {
        if (module.duration) {
          const durationStr = module.duration;
          const hours = durationStr.includes("hour")
            ? parseInt(durationStr.split(" ")[0])
            : 0;
          totalMinutes += hours * 60;
        }
      });
      return (totalMinutes / 60).toFixed(1);
    }
    return moduleCount * 2; 
  };

  
  const progress = 0;

  const colorClasses = getDifficultyColor(difficultyLevel);

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-white shadow-md"
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 ${colorClasses.bg} opacity-10`}></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0.8 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {course.bannerImageUrl ? (
            <img
              src={course.bannerImageUrl}
              alt={courseName}
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-xl ${colorClasses.bg} flex items-center justify-center shadow-lg`}
            >
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          )}
        </motion.div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold line-clamp-2">{courseName}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${colorClasses.badge} font-medium`}
          >
            {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{moduleCount} Modules</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{getTotalHours()} Hours</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm col-span-2">
            <BarChart className="w-4 h-4 mr-1" />
            <span>{categories}</span>
          </div>
        </div>

        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Progress</span>
              <span className={`font-medium ${colorClasses.text}`}>
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${colorClasses.progress}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        )}

        <Link href={`/courses/${course.id}`}>
          <motion.button
            className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${colorClasses.button} transition-colors duration-200`}
            variants={buttonVariants}
            whileTap={{ scale: 0.98 }}
          >
            {progress > 0 ? "Continue Learning" : "Start Learning"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
