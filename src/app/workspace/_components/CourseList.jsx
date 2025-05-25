'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { Plus, Loader2 } from "lucide-react";
import AddNewCourse from "./AddNewCourse";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import CourseListLoading from "./CourseListLoading";

const CourseList = () => {
  const [courseList, setCourseList] = useState([]);

  const [loading, setLoading] = useState(true);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      getCourse();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  


  const getCourse = async () => {
    setLoading(true);
    const toastId = toast.loading("Loading your courses...");

    try {
      const response = await axios.get("/api/courses");

      if (Array.isArray(response.data)) {
        setCourseList(response.data);
        toast.dismiss(toastId);
        if (response.data.length > 0) {
          toast.success(`Loaded ${response.data.length} courses`);
        }
        console.log(response.data);
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to load courses properly");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error loading courses");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Increased delay to ensure skeleton animations are visible
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!isLoaded) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4">

      <motion.h2
        className="font-bold text-3xl mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Learning Journey
      </motion.h2>

      {loading ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, delay: index * 0.05 }
                }
              }}
            >
              <CourseListLoading />
            </motion.div>
          ))}
        </motion.div>
      ) : courseList.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courseList.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl shadow-md p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-6" />
            </svg>
          </motion.div>
          <motion.h3
            className="text-xl font-semibold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            No courses yet
          </motion.h3>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Explore our catalog and enroll in courses to start your learning
            journey.
          </motion.p>
          <motion.button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <AddNewCourse>
              <div className="flex items-center cursor-pointer justify-center">
                <Plus className="mr-2" size={18} />
                Create Your First Course
              </div>
            </AddNewCourse>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CourseList;