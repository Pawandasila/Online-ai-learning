"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  BarChart2,
  Loader2Icon,
  Award,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CertificateViewer from "@/components/CertificateViewer";

const EnrolledCourseCard = ({ course, progress, completedChapters }) => {
  console.log("EnrolledCourseCard course:", course);

  // Handle cases where course might be undefined
  if (!course) {
    return null;
  }

  const progressValue = parseInt(progress) || 0;

  // Get module count from the API response structure
  const moduleCount =
    course?.noOfModules || course?.courseJson?.course?.noOfModules || 0;

  const completedModulesCount = completedChapters?.length || 0;
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completing, setCompleting] = useState(false);
  const onClickLoad = async () => {
    setLoading(true);
  };

  // Test function to simulate course completion (for development)
  const handleTestCompletion = async () => {
    setCompleting(true);
    try {
      const response = await fetch('/api/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.courseId || course.cid,
        }),
      });
      
      if (response.ok) {
        window.location.reload(); // Refresh to show updated state
      }
    } catch (error) {
      console.error('Error completing course:', error);
    } finally {
      setCompleting(false);
    }
  };

  const difficultyLevel =
    course?.difficultyLevel?.charAt(0).toUpperCase() +
      course?.difficultyLevel?.slice(1) || "Beginner";

  // Handle categories from API response - it's a string that needs to be split
  let categories = [];
  if (typeof course?.categories === "string") {
    categories = course.categories.split(",").map((cat) => cat.trim());
  } else if (Array.isArray(course?.courseJson?.course?.categories)) {
    categories = course.courseJson.course.categories;
  } else if (Array.isArray(course?.categories)) {
    categories = course.categories;
  }
  // Use courseName from API response
  const courseName =
    course?.courseName || course?.courseJson?.course?.name || "Untitled Course";
  const courseDescription =
    course?.courseDescription ||
    course?.courseJson?.course?.description ||
    "No description available";

  // Check if course is completed and has certificate
  const isCompleted =
    course?.isCompleted === true || course?.isCompleted === "true";
  const hasCertificate =
    course?.certificate && course.certificate.trim() !== "";
  const showCertificateButton = isCompleted && hasCertificate;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Course Banner Image */}
      <div className="relative w-full h-48">
        {course?.bannerImageUrl ? (
          <Image
            src={course.bannerImageUrl}
            alt={courseName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold px-4 text-center">
              {courseName}
            </h3>          </div>
        )}
        
        {/* Difficulty Badge and Completion Status */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            {difficultyLevel}
          </div>
          {isCompleted && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center">
              <Award size={14} className="mr-1" />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{courseName}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{courseDescription}</p>
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
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {typeof category === "string" ? category.trim() : category}
              </span>
            ))}
            {categories.length > 2 && (              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                +{categories.length - 2} more
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Continue Learning Button */}
          <Link href={`/workspace/course/${course.courseId}`} className="block">
            <button
              onClick={() => onClickLoad()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {progressValue > 0 ? "Continue Learning" : "Start Learning"}
              {loading ? (
                <Loader2Icon className="w-5 h-5 animate-spin ml-2" />
              ) : (
                <ChevronRight size={18} className="ml-2" />
              )}
            </button>
          </Link>          {/* Certificate Button - Show only if course is completed and has certificate */}
          {showCertificateButton && (
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Award size={18} className="mr-2" />
              View Certificate
            </button>
          )}

          {/* Test Completion Button - Only show for development/testing if not completed */}
          {!isCompleted && process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleTestCompletion}
              disabled={completing}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 text-sm"
            >
              {completing ? (
                <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Award size={16} className="mr-2" />
              )}
              {completing ? "Completing..." : "Test Complete Course"}
            </button>
          )}
        </div>
        {/* Certificate Viewer Modal */}
        <CertificateViewer
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          certificateUrl={course?.certificate}
          courseName={courseName}
          completionDate={course?.completedAt || course?.updatedAt}
        />
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
