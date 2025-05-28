"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  BarChart,
  Tag,
  ChevronDown,
  Video,
  CheckCircle,
  Layers,
  Play,
  Award,
  ArrowRight,
  Info,
  Loader2Icon,
} from "lucide-react";
import LoadingComponent from "../loading";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CourseInfo = ({ course, loading, error, viewCourse }) => {  const [expandedModule, setExpandedModule] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const moduleRefs = useRef([]);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const router = useRouter();

  // Fix: Access the correct data structure for course and modules
  const courseData = course?.courseJson?.course || {};

  // Fix: Access modules from the correct path in the data structure
  const courseModules = courseData?.modules || [];

  console.log("CourseInfo received course:", course);
  console.log("CourseInfo courseData:", courseData);
  console.log("CourseInfo courseModules:", courseModules);

  useEffect(() => {
    if (expandedModule !== null && moduleRefs.current[expandedModule]) {
      moduleRefs.current[expandedModule].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [expandedModule]);
  if (loading) return <LoadingComponent />;
  if (error)
    return <div className="p-6 bg-red-50 text-red-600 rounded-lg">{error}</div>;

  const toggleModule = (index) => {
    if (expandedModule === index) {
      setExpandedModule(null);
    } else {
      setExpandedModule(index);
      setActiveStep(index);
    }
  };  const generateCourseContent = async () => {
    // Create a loading toast and get its ID
    const toastId = toast.loading("Generating AI course content...", {
      description: "This may take a few minutes. Please wait.",
    });

    try {
      setLoadingInfo(true);      console.log("Original course data:", course);

      // Fix: Ensure we have the correct course data structure for the API
      // The API expects: data.course.courseJson.course.modules (array)
      
      // Get the number of modules from the course data
      const numberOfModules = course?.noOfModules || courseData?.noOfModules || 5;
      
      // Try to get the actual AI-generated modules from the course structure
      let modulesToUse = null;
      
      // Check various possible locations for the modules
      if (course?.courseJson?.course?.modules && Array.isArray(course.courseJson.course.modules)) {
        modulesToUse = course.courseJson.course.modules;
        console.log("Using modules from course.courseJson.course.modules");
      } else if (course?.courseJson?.modules && Array.isArray(course.courseJson.modules)) {
        modulesToUse = course.courseJson.modules;
        console.log("Using modules from course.courseJson.modules");
      } else if (courseData?.modules && Array.isArray(courseData.modules)) {
        modulesToUse = courseData.modules;
        console.log("Using modules from courseData.modules");
      }

      // If we still don't have modules, create basic structure as fallback
      if (!modulesToUse || modulesToUse.length === 0) {
        console.log("No existing modules found, creating basic structure");
        modulesToUse = Array.from({ length: numberOfModules }, (_, index) => ({
          moduleName: `Module ${index + 1}`,
          chapterName: `Module ${index + 1}: Introduction to ${course?.name || course?.courseName || 'Subject'}`,
          duration: "2 hours",
          about: `This module covers fundamental concepts related to ${course?.name || course?.courseName || 'the subject'}.`,
          topics: [`Introduction to ${course?.name || course?.courseName || 'Subject'}`, "Basic concepts", "Practical examples"]
        }));
      } else {
        console.log(`Found ${modulesToUse.length} existing AI-generated modules:`, modulesToUse.map(m => m.moduleName));
      }

      const courseDataToSend = {
        courseId: course?.cid || course?.courseId,
        name: course?.name || course?.courseName,
        cid: course?.cid || course?.courseId,
        courseJson: {
          course: {
            name: course?.name || course?.courseName,
            description: course?.description || course?.courseDescription,
            noOfModules: numberOfModules,
            difficultyLevel: course?.difficultyLevel || "beginner",
            categories: Array.isArray(course?.categories) 
              ? course.categories 
              : (typeof course?.categories === 'string' 
                ? course.categories.split(',').map(cat => cat.trim()) 
                : ["General"]),
            includeVideo: course?.includeVideo !== undefined ? course.includeVideo : true,
            modules: modulesToUse
          }
        },
        bannerImageUrl: course?.bannerImageUrl,
        createdAt: course?.createdAt,
        updatedAt: course?.updatedAt
      };      console.log("Sending course data to API:", courseDataToSend);
      console.log("Modules being sent:", modulesToUse);
      console.log("Module names being sent:", modulesToUse.map(m => m.moduleName));
      console.log("Module topics being sent:", modulesToUse.map(m => ({ name: m.moduleName, topics: m.topics })));

      // Start the API request to generate course content
      const result = await axios.post("/api/generate-ai-course", { 
        course: courseDataToSend 
      });

      // Dismiss the loading toast and show success
      toast.dismiss(toastId);
      toast.success("Course generated successfully!", {
        description: "Redirecting to your workspace...",
      });

      console.log("Generation result:", result.data);
      router.push("/workspace");
    } catch (err) {
      // Dismiss the loading toast and show error
      toast.dismiss(toastId);

      const responseData = err.response?.data;
      const isOverloaded = responseData?.isOverloaded;

      console.error("Generation error:", err);
      console.error("Error response:", responseData);

      if (isOverloaded) {
        toast.error("AI Service Temporarily Unavailable", {
          description:
            responseData?.suggestion ||
            "The AI service is currently experiencing high demand. Please try again in a few minutes.",
          duration: 6000,
          action: {
            label: "Retry",
            onClick: () => generateCourseContent(),
          },
        });
      } else {
        toast.error("Failed to generate course", {
          description:
            responseData?.details || 
            responseData?.error || 
            err.message || 
            "An unknown error occurred",
        });
      }
    } finally {
      setLoadingInfo(false);
    }
  };

  const continueLearning = () => {
    const courseId = course?.courseId || course?.cid;
    router.push(`/view-course/${courseId}`);
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const totalHours =
    courseModules && Array.isArray(courseModules)
      ? courseModules.reduce((total, module) => {
          if (!module) return total;
          const durationParts = module.duration?.split(" ");
          const hours = parseInt(durationParts?.[0]) || 0;
          return total + hours;
        }, 0)
      : 0;

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative h-64 md:h-80 overflow-hidden rounded-xl shadow-lg mb-8">
        <motion.img
          src={course?.bannerImageUrl || "/default-course-banner.jpg"}
          alt={courseData?.name || course?.courseName}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end">
          <div className="p-6 md:p-10 text-white">
            <motion.div
              className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium mb-3"
              variants={itemVariants}
            >
              {Array.isArray(courseData?.categories)
                ? courseData?.categories[0]
                : courseData?.categories || 
                  (typeof course?.categories === 'string' 
                    ? course.categories.split(',')[0].trim()
                    : course?.categories)}
            </motion.div>
            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-2 leading-tight"
              variants={itemVariants}
            >
              {courseData?.name || course?.courseName || "Course Title"}
            </motion.h1>
            <motion.p
              className="text-white/80 md:w-3/4 mt-3 text-base md:text-lg"
              variants={itemVariants}
            >
              {(courseData?.description || course?.courseDescription)
                ? (courseData?.description || course?.courseDescription).split(".")[0] + "."
                : "No description available."}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Course Details */}
        <motion.div className="lg:w-2/3 space-y-8" variants={itemVariants}>
          {/* Course Overview */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Course Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {courseData?.description || course?.courseDescription || "No description available."}
            </p>

            {/* Course Stats (redesigned) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
              <motion.div
                className="flex flex-col items-center justify-center text-center p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-bold text-xl text-gray-800">{totalHours}</p>
                <p className="text-xs text-gray-500 uppercase mt-1">Hours</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center text-center p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-bold text-xl text-gray-800">
                  {courseData?.noOfModules || course?.noOfModules || 0}
                </p>
                <p className="text-xs text-gray-500 uppercase mt-1">Modules</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center text-center p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <p className="font-bold text-xl text-gray-800 capitalize">
                  {courseData?.difficultyLevel || course?.difficultyLevel || "Beginner"}
                </p>
                <p className="text-xs text-gray-500 uppercase mt-1">
                  Difficulty
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center text-center p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <Video className="h-6 w-6 text-amber-600" />
                </div>
                <p className="font-bold text-xl text-gray-800">
                  {course?.includeVideo !== undefined ? (course.includeVideo ? "Yes" : "No") : "Yes"}
                </p>
                <p className="text-xs text-gray-500 uppercase mt-1">Videos</p>
              </motion.div>
            </div>
          </div>

          {/* Categories - Redesigned */}
          {(courseData?.categories || course?.categories) && (
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 md:p-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-600" />
                Course Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(courseData?.categories) ? (
                  courseData?.categories.map((category, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {category}
                    </motion.span>
                  ))
                ) : typeof course?.categories === 'string' ? (
                  course.categories.split(',').map((category, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {category.trim()}
                    </motion.span>
                  ))
                ) : (
                  <motion.span
                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {courseData?.categories || course?.categories}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}

          {/* Module List - Following Wireframe */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 md:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Course Curriculum
            </h2>

            {/* Check if course content exists */}
            {courseModules && Array.isArray(courseModules) && courseModules.length > 0 ? (
              /* Module Timeline - Based on Wireframe */
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200 z-0"></div>

                {/* Modules in Timeline Format */}
                <div className="space-y-8">
                  {courseModules.map((module, index) => (
                    <div
                      key={index}
                      ref={(el) => (moduleRefs.current[index] = el)}
                      className="relative"
                    >
                      {/* Module Card */}
                      <motion.div
                        className={`ml-10 bg-white border ${
                          activeStep === index
                            ? "border-blue-300 ring-2 ring-blue-100"
                            : "border-gray-200"
                        } rounded-lg shadow-sm overflow-hidden`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Module Header */}
                        <button
                          className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50"
                          onClick={() => toggleModule(index)}
                        >
                          <div className="flex items-center">
                            <h3 className="font-medium text-lg text-gray-800">
                              {module.chapterName
                                ? module.chapterName.replace(/Module \d+: /, "")
                                : "Unnamed Module"}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {module.duration || "TBD"}
                            </span>
                            <motion.div
                              animate={{
                                rotate: expandedModule === index ? 180 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          </div>
                        </button>

                        {/* Module Content */}
                        <AnimatePresence>
                          {expandedModule === index && (
                            <motion.div
                              className="border-t border-gray-200 bg-gray-50 p-5"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <h4 className="font-medium text-gray-500 mb-3">
                                Topics Covered:
                              </h4>
                              <ul className="space-y-3">
                                {module.topics &&
                                Array.isArray(module.topics) ? (
                                  module.topics.map((topic, topicIndex) => (
                                    <motion.li
                                      key={topicIndex}
                                      className="flex items-start bg-white p-3 rounded-lg border border-gray-100"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: topicIndex * 0.05 }}
                                    >
                                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700">
                                        {topic}
                                      </span>
                                    </motion.li>
                                  ))
                                ) : (
                                  <li className="text-gray-500 italic p-3">
                                    No topics available for this module.
                                  </li>
                                )}
                              </ul>
                              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                                <motion.button
                                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Play className="h-4 w-4" />
                                  Start Module
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Timeline Circle Marker */}
                      <div className="absolute left-4 top-5 transform -translate-x-1/2">
                        <motion.div
                          className={`w-8 h-8 rounded-full ${
                            activeStep === index ? "bg-blue-600" : "bg-gray-200"
                          } flex items-center justify-center z-10`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <span className="text-white font-medium text-sm">
                            {index + 1}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  ))}

                  {/* Final marker */}
                  <div className="relative h-6">
                    <div className="absolute left-4 top-0 transform -translate-x-1/2">
                      <motion.div
                        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Show message when no content is generated yet */
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Course Content Not Generated Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Click "Generate AI Course Content" to create the detailed curriculum and modules.
                </p>
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateCourseContent}
                  disabled={loadingInfo}
                >
                  {loadingInfo ? (
                    <Loader2Icon className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  {loadingInfo ? "Generating..." : "Generate Course Content"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column - Course Actions */}
        <motion.div className="lg:w-1/3" variants={itemVariants}>
          <div className="sticky top-8 space-y-6">
            {/* Course Action Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Begin Your Learning Journey
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Master {courseData?.name || course?.courseName || "this course"} with this comprehensive course.
                  </p>

                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <span className="text-gray-600">Total Duration</span>
                    <span className="font-medium">{totalHours} Hours</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <span className="text-gray-600">Difficulty Level</span>
                    <span className="font-medium capitalize">
                      {courseData?.difficultyLevel || course?.difficultyLevel || "Beginner"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-medium">
                      {courseData?.noOfModules || course?.noOfModules || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <motion.button
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={
                      viewCourse ? continueLearning : generateCourseContent
                    }
                    disabled={loadingInfo}
                  >
                    {loadingInfo ? (
                      <Loader2Icon className="h-5 w-5 animate-spin" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    {viewCourse
                      ? "Continue Learning"
                      : loadingInfo
                      ? "Generating..."
                      : "Generate AI Course Content"}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* What You'll Learn Card */}
            {courseModules && courseModules.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  What You'll Learn
                </h3>
                <ul className="space-y-3">
                  {courseModules?.slice(0, 4).flatMap((module, idx) =>
                    module?.topics?.slice(0, 1).map((topic, topicIdx) => (
                      <motion.li
                        key={`${idx}-${topicIdx}`}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (idx + topicIdx) * 0.1 }}
                      >
                        <div className="mr-3 mt-1">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        </div>
                        <span className="text-gray-700">{topic}</span>
                      </motion.li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* Course Recommendations */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Recommended For
              </h3>
              <ul className="space-y-3">
                <motion.li
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">
                    Software Engineers looking to transition to AI/ML
                  </span>
                </motion.li>
                <motion.li
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Info className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Data Scientists upgrading their skills
                  </span>
                </motion.li>
                <motion.li
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Info className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">
                    Students with programming knowledge
                  </span>
                </motion.li>
              </ul>
            </div>

            {/* Call to Action */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 md:p-8 text-white"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <h3 className="text-xl font-bold mb-4">
                Start Your AI Journey Today
              </h3>
              <p className="mb-6 text-blue-100">
                Join thousands of learners mastering AI, ML, and Deep Learning
                skills.
              </p>
              <motion.button
                className="w-full bg-white text-blue-700 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="h-5 w-5" />
                Get Started Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseInfo;
