"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import AppHeader from "../../workspace/_components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChapterSidebar from "./_components/ChapterListSidebar";
import CourseContent from "./_components/CourseContent";
import ModuleDetailSidebar from "./_components/ModuleDetailSidebar";
import { useParams } from "next/navigation";
import axios from "axios";

const CoursePage = () => {
  const { cid } = useParams();
  const [enrolledCoursesInfo, setEnrolledCoursesInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeModuleDetail, setActiveModuleDetail] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mainContentRef = useRef(null);

  // For touch gestures
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close module detail with Escape
      if (e.key === "Escape" && activeModuleDetail) {
        setActiveModuleDetail(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeModuleDetail]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const mobile = windowWidth < 768;
      const tablet = windowWidth >= 768 && windowWidth < 1280;

      setIsMobile(mobile);
      setIsTablet(tablet);

      // On small screens, don't show both sidebars at once
      if ((mobile || tablet) && activeModuleDetail) {
        // Consider if we should hide the chapter list when showing module detail
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeModuleDetail]);

  useEffect(() => {
    getEnrolledCoursesById();
  }, [cid]);

  const getEnrolledCoursesById = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/enroll-course?cid=${cid}`);
      console.log("Enrolled Courses Result:", result.data);
      if (result.data?.success && result.data.data) {
        setEnrolledCoursesInfo(result.data.data);
      } else {
        setError("No courses found");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setError("Failed to load courses");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="course-view-container min-h-screen bg-gray-50 flex flex-col">
      <SidebarProvider>
        {loading ? (
          <div className="loading-screen flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-3"></div>
              <p className="text-lg text-gray-600 font-medium">
                Loading course content...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-screen">
            <div className="bg-red-50 p-8 rounded-xl shadow-md max-w-md">
              <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => getEnrolledCoursesById()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="course-layout flex h-screen overflow-hidden">
            {/* Timeline Sidebar */}
            <ChapterSidebar
              enrolledCoursesInfo={enrolledCoursesInfo}
              setActiveModuleDetail={setActiveModuleDetail}
            />

            {/* Main Content - animates width when module detail is shown */}
            <motion.main
              className={`main-content-area flex flex-col overflow-hidden optimized-animation ${
                isMobile
                  ? "w-full"
                  : isTablet
                  ? activeModuleDetail
                    ? "hidden"
                    : "w-full"
                  : activeModuleDetail
                  ? "w-[calc(100vw-640px)]"
                  : "w-[calc(100vw-320px)]"
              }`}
              animate={{
                width: isMobile
                  ? "100%"
                  : isTablet
                  ? activeModuleDetail
                    ? "0%"
                    : "100%"
                  : activeModuleDetail
                  ? "calc(100vw - 640px)"
                  : "calc(100vw - 320px)",
              }}
              transition={{
                type: prefersReducedMotion ? "tween" : "spring",
                stiffness: 350,
                damping: 30,
                duration: prefersReducedMotion ? 0.1 : undefined,
              }}
              style={{ opacity }}
            >
              <AppHeader hideSidebar={true} />
              <div
                className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full"
                ref={mainContentRef}
              >
                <motion.div
                  initial={{ opacity: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale:
                      activeModuleDetail && !prefersReducedMotion ? 0.98 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`content-container bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-sm ${
                    activeModuleDetail
                      ? "with-detail border border-blue-100"
                      : ""
                  }`}
                >
                  <CourseContent courseData={enrolledCoursesInfo} />
                </motion.div>
              </div>
            </motion.main>

            {/* Module Detail Sidebar - shows when a module is selected */}
            <AnimatePresence mode="wait">
              {activeModuleDetail && (
                <ModuleDetailSidebar
                  key="module-detail-sidebar"
                  moduleDetail={activeModuleDetail}
                  onClose={() => setActiveModuleDetail(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </SidebarProvider>
    </div>
  );
};

export default CoursePage;
