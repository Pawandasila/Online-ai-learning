"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, BarChart2, Loader2Icon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const EnrolledCourseCard = ({ course, progress, completedChapters }) => {
  const progressValue = parseInt(progress) || 0;

  const moduleCount = course?.courseJson?.course?.noOfModules || 0;

  const completedModulesCount = completedChapters?.length || 0;

  const [loading, setLoading] = useState(false);

  const onClickLoad = async () => {
    setLoading(true);
  };

  const difficultyLevel =
    course?.difficultyLevel?.charAt(0).toUpperCase() +
      course?.difficultyLevel?.slice(1) || "Beginner";

  const categories = Array.isArray(course?.courseJson?.course?.categories)
    ? course.courseJson.course.categories
    : course?.categories?.split(",").map((cat) => cat.trim()) || [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Course Banner Image */}
      <div className="relative w-full h-48">
        {course?.bannerImageUrl ? (
          <Image
            src={course.bannerImageUrl}
            alt={course.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold px-4 text-center">
              {course.name}
            </h3>
          </div>
        )}

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          {difficultyLevel}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{course.name}</h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        {/* Progress Bar using shadcn/ui */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Course Progress
            </span>
            <span className="text-sm font-medium text-blue-600">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-gray-600">
            <BookOpen size={16} className="mr-2" />
            <span className="text-sm">{moduleCount} Modules</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BarChart2 size={16} className="mr-2" />
            <span className="text-sm">
              {completedModulesCount}/{moduleCount} Completed
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {typeof category === "string" ? category.trim() : category}
            </span>
          ))}
          {categories.length > 2 && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              +{categories.length - 2} more
            </span>
          )}
        </div>

        {/* Continue Learning Button */}
        <Link href={`/workspace/course/${course.cid}`}>
          <button
            onClick={() => onClickLoad()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
          >
            {progressValue > 0 ? "Continue Learning" : "Start Learning"}
            {loading ? (
              <Loader2Icon className="size-5 animate-spin ml-1" />
            ) : (
              <ChevronRight size={18} className="ml-1" />
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
