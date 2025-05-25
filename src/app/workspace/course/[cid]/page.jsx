"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, BookOpen, ArrowLeft } from "lucide-react";
import CourseInfo from "../../edit-course/[cid]/_components/CourseInfo";
import Link from "next/link";
import { toast } from "sonner";

export default function CoursePage() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const courseId = params.cid;

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/?cid=${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course. Please try again later.");
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading course...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Link 
            href="/workspace"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/workspace"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to workspace
          </Link>
        </div>
        
        {course ? (
          <CourseInfo course={course} loading={false} error={null} viewCourse={true} />
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Course not found
            </h2>
            <p className="text-gray-500 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/workspace"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to workspace
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}