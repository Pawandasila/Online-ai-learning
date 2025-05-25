"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  Clock,
  X,
  Menu,
  Play,
  FileText,
  Video,
} from "lucide-react";

const ChapterSidebar = ({
  enrolledCoursesInfo,
  setActiveModuleDetail,
  handleSubModuleClick,
}) => {
  // Get course and enrollment data from props
  const course = enrolledCoursesInfo?.courses || {};
  const enrolledCourse = enrolledCoursesInfo?.enrollCourses || {};

  // Get course modules from the enriched modules in courseContent
  const courseModules = course?.courseContent?.enrichedModules || [];
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeModuleDetail, setLocalActiveModuleDetail] = useState(null);
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Track course progress
  const [progress, setProgress] = useState(0);

  // Keep local state in sync with parent state
  const updateModuleDetail = (detail) => {
    setLocalActiveModuleDetail(detail);
    if (setActiveModuleDetail) {
      setActiveModuleDetail(detail);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!sidebarOpen) return;

      // Handle keyboard navigation
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();

        // Find all module headers
        const moduleHeaders =
          sidebarRef.current?.querySelectorAll(".module-header");
        if (!moduleHeaders || moduleHeaders.length === 0) return;

        // Find currently focused element
        const currentFocusedIndex = Array.from(moduleHeaders).findIndex(
          (el) => el === document.activeElement
        );

        let nextIndex;
        if (e.key === "ArrowDown") {
          nextIndex =
            currentFocusedIndex < moduleHeaders.length - 1
              ? currentFocusedIndex + 1
              : 0;
        } else {
          nextIndex =
            currentFocusedIndex > 0
              ? currentFocusedIndex - 1
              : moduleHeaders.length - 1;
        }

        moduleHeaders[nextIndex].focus();
      }

      // Close sidebar on Escape in mobile view
      if (e.key === "Escape" && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen, isMobile]);

  useEffect(() => {
    // Handle responsive behavior
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);

      // Close sidebar on mobile, open on desktop
      if (isMobileView) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [activeModule]);

  // Get course progress
  useEffect(() => {
    if (enrolledCourse && enrolledCourse.progress) {
      setProgress(parseInt(enrolledCourse.progress, 10));
    }
  }, [enrolledCourse]);

  // For synchronizing with URL parameters
  const pathname = usePathname();

  // Handle sub-module click
  const onTopicClick = (moduleIndex, topicIndex, moduleData, topicData) => {
    setActiveModule(moduleIndex);
    setActiveTopic(`${moduleIndex}-${topicIndex}`);

    if (handleSubModuleClick) {
      handleSubModuleClick(moduleIndex, topicIndex);
    }
  };

  console.log(course?.courseJson?.course)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 lg:hidden glass-effect shadow-xl rounded-2xl p-3 transition-all duration-300 hover:shadow-2xl border border-white/20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <motion.div
          animate={{ rotate: sidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarOpen ? (
            <X size={22} className="text-gray-700" />
          ) : (
            <Menu size={22} className="text-gray-700" />
          )}
        </motion.div>
      </motion.button>
      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`chapter-sidebar fixed lg:sticky top-0 left-0 h-screen z-40 lg:z-30 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden flex flex-col optimized-animation ${
              isMobile ? "w-[85%] max-w-[280px]" : "w-[280px]"
            }`}
            aria-label="Course chapter navigation"
          >
            {isMobile && (
              <button
                className="ml-auto text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 p-2 rounded-lg transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}

            {/* Course Info Banner */}
            <div className="py-2 px-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-blue-100">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-blue-100">
                <h2 className="font-semibold text-center text-gray-800 truncate text-lg">
                  {course.name}
                </h2>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md">
                    <BookOpen size={14} className="text-blue-600" />
                    <span className="font-medium">
                      {courseModules?.length || 0} Modules
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-md">
                    <Clock size={14} className="text-indigo-600" />
                    <span className="font-medium">
                      {course?.courseJson?.course?.duration} Hours
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {progress}% Complete
                  </p>
                </div>
              </div>
            </div>
            {/* Course Modules */}
            <div
              className="flex-grow overflow-y-auto bg-gradient-to-b from-white to-gray-50"
              ref={sidebarRef}
            >
              <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-100">
                <h3 className=" text-center font-semibold text-sm text-gray-600 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 bg-blue-500 rounded-full"></div>
                  Course Modules
                </h3>
              </div>
              {/* Timeline Content */}
              <div className="timeline px-3 pb-6 pt-3 overflow-y-auto">
                {courseModules.length > 0 ? (
                  <div className="relative">
                    {/* Timeline main line */}
                    <div className="absolute left-7 top-0 h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-indigo-300 rounded-full opacity-60" />

                    {courseModules.map((module, moduleIndex) => {
                      const isActive = activeModule === moduleIndex;
                      const isCompleted =
                        progress >=
                        ((moduleIndex + 1) / courseModules.length) * 100;
                      const topics = module.topics || module.content || [];

                      return (
                        <div key={moduleIndex} className="mb-4">
                          {/* Module Header */}
                          <motion.div
                            onClick={() => {
                              // Toggle selected module
                              const newActiveModule = isActive
                                ? null
                                : moduleIndex;
                              setActiveModule(newActiveModule);

                              // Send selected module data to parent for detail view
                              if (newActiveModule !== null) {
                                updateModuleDetail({
                                  moduleIndex: moduleIndex,
                                  moduleData: module,
                                });
                              } else {
                                updateModuleDetail(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle keyboard activation
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                // Toggle selected module
                                const newActiveModule = isActive
                                  ? null
                                  : moduleIndex;
                                setActiveModule(newActiveModule);

                                // Send selected module data to parent for detail view
                                if (newActiveModule !== null) {
                                  updateModuleDetail({
                                    moduleIndex: moduleIndex,
                                    moduleData: module,
                                  });
                                } else {
                                  updateModuleDetail(null);
                                }
                              }
                            }}
                            className={`relative flex items-start py-3 pl-12 pr-4 rounded-xl cursor-pointer transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md border border-blue-200"
                                : "hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                            } module-header optimized-animation group`}
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isActive}
                            aria-label={`Module ${
                              moduleIndex + 1
                            }: ${module.chapterName?.replace(
                              /Module \d+: /i,
                              ""
                            )}`}
                          >
                            {/* Timeline Node */}
                            <div
                              className={`absolute left-6 top-4 h-7 w-7 rounded-full border-3 flex items-center justify-center z-10 transition-all duration-300 shadow-lg ${
                                isCompleted
                                  ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300"
                                  : isActive
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300"
                                  : "bg-white border-gray-300 group-hover:border-blue-300"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-white" />
                              ) : isActive ? (
                                <Play className="h-3.5 w-3.5 text-white fill-white ml-0.5" />
                              ) : (
                                <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600">
                                  {moduleIndex + 1}
                                </span>
                              )}
                            </div>

                            {/* Module Content */}
                            <div className="flex-grow">
                              <p
                                className={`font-semibold text-base leading-tight mb-1 ${
                                  isActive ? "text-blue-700" : "text-gray-800"
                                }`}
                              >
                                {module.chapterName?.replace(
                                  /Module \d+: /i,
                                  ""
                                )}
                              </p>
                              <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock size={14} className="text-gray-400" />
                                  <span>{module.duration || "1-2 hours"}</span>
                                </div>
                                {module.youtubeVideos &&
                                  module.youtubeVideos.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Video
                                        size={14}
                                        className="text-red-500"
                                      />
                                      <span>
                                        {module.youtubeVideos.length} videos
                                      </span>
                                    </div>
                                  )}
                                {topics.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <BookOpen
                                      size={14}
                                      className="text-blue-500"
                                    />
                                    <span>{topics.length} topics</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Toggle Icon */}
                            <div className="flex-shrink-0 pt-1 ml-3">
                              <motion.div
                                animate={{ rotate: isActive ? 90 : 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className={`${
                                  isActive
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-blue-500"
                                }`}
                              >
                                <ChevronRight size={18} />
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <BookOpen size={48} className="text-gray-300 mb-3" />
                    <p className="text-center">No modules available</p>
                    <p className="text-sm text-center text-gray-400 mt-1">
                      Check back later for updates
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 via-white to-blue-50">
              <Link
                href="/workspace"
                className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-200 bg-white hover:bg-blue-50 py-2.5 px-4 rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md group"
              >
                <LayoutDashboard className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChapterSidebar;
