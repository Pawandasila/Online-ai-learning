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
import CelebrationAnimation from "./_components/CelebrationAnimation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const CoursePage = () => {
  const { cid } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enrolledCoursesInfo, setEnrolledCoursesInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeModuleDetail, setActiveModuleDetail] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);  const [isTablet, setIsTablet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Handle URL parameters for chapter and topic navigation
  // URL structure: ?chapter=0&topic=1
  // - chapter: corresponds to activeModuleIndex (the chapter/module index)
  // - topic: corresponds to activeTopicIndex (the topic index within the chapter)
  useEffect(() => {
    const chapterParam = searchParams.get('chapter');
    const topicParam = searchParams.get('topic');
    
    if (chapterParam !== null) {
      const chapterIndex = parseInt(chapterParam, 10);
      if (!isNaN(chapterIndex) && chapterIndex >= 0) {
        setActiveModuleIndex(chapterIndex);
      }
    }
    
    if (topicParam !== null) {
      const topicIndex = parseInt(topicParam, 10);
      if (!isNaN(topicIndex) && topicIndex >= 0) {
        setActiveTopicIndex(topicIndex);
      }
    }
  }, [searchParams]);

  // Update URL when chapter or topic changes
  const updateUrl = (chapterIndex, topicIndex) => {
    const params = new URLSearchParams(searchParams);
    params.set('chapter', chapterIndex.toString());
    params.set('topic', topicIndex.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    getEnrolledCoursesById();
  }, [cid]);
  const getEnrolledCoursesById = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/enroll-course?cid=${cid}`);
      console.log("Enrolled Courses Result:", result.data);
      if (result.data?.success && result.data.data) {
        // Transform the data structure to match what the components expect
        const transformedData = {
          courses: {
            ...result.data.data,
            courseContent: result.data.data.courseContent
          },
          enrollCourses: {
            progress: result.data.data.progress,
            completedChapters: result.data.data.completedChapters,
            isCompleted: result.data.data.isCompleted,
            certificate: result.data.data.certificate,
            status: result.data.data.status
          }
        };
        setEnrolledCoursesInfo(transformedData);
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
  };  const handleSubModuleClick = (moduleIndex, topicIndex) => {
    setActiveModuleIndex(moduleIndex);
    setActiveTopicIndex(topicIndex);
    updateUrl(moduleIndex, topicIndex);

    // On mobile, close the sidebar after clicking a topic
    if (isMobile || isTablet) {
      const sidebarToggle = document.querySelector(
        'button[aria-label="Close sidebar"]'
      );
      if (sidebarToggle) {
        sidebarToggle.click();
      }
    }
  };
  
  // Handle chapter completion
  const handleChapterCompletion = async (chapterIndex) => {
    try {
      const totalChapters = enrolledCoursesInfo?.courses?.noOfModules || 1;
      
      const response = await axios.put('/api/enroll-course', {
        courseId: cid,
        chapterIndex: chapterIndex,
        totalChapters: totalChapters
      });

      if (response.data?.success) {
        // Update the local state with the new progress data
        setEnrolledCoursesInfo(prevData => ({
          ...prevData,
          enrollCourses: {
            ...prevData.enrollCourses,
            completedChapters: response.data.data.completedChapters,
            progress: response.data.data.progress.toString(),
            isCompleted: response.data.data.isCompleted,
            certificate: response.data.data.certificateUrl || prevData.enrollCourses.certificate
          }
        }));        // Show celebration animation if course is completed
        if (response.data.data.isCompleted) {
          setShowCelebration(true);
          // Show success message after celebration animation completes
          setTimeout(() => {
            toast.success("🎉 Congratulations! Course completed!", {
              description: response.data.message,
              duration: 5000,
            });
          }, 4500); // Wait for animation to complete (4s) + small buffer
        } else {
          // For regular chapter completion, show immediate feedback
          toast.success("✅ Chapter completed!", {
            description: response.data.message,
            duration: 3000,
          });
        }
      }    } catch (error) {
      console.error('Error completing chapter:', error);
      toast.error("❌ Failed to complete chapter", {
        description: "Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="course-view-container min-h-screen flex flex-col">
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
        ) : (          <div className="course-layout course-layout-flex">
            {/* Timeline Sidebar */}
            <div className="sidebar-container">              <ChapterSidebar
                enrolledCoursesInfo={enrolledCoursesInfo}
                setActiveModuleDetail={setActiveModuleDetail}
                handleSubModuleClick={handleSubModuleClick}
                onChapterComplete={handleChapterCompletion}
              />
            </div>            {/* Main Content - seamlessly connects to module detail sidebar */}
            <motion.main
              className={`main-content-area flex flex-col overflow-hidden optimized-animation relative z-10 ${
                activeModuleDetail ? 'has-sidebar' : 'no-sidebar'
              }`}
              initial={{ opacity: 0.8 }}
              animate={{
                opacity: 1,
                x: isMobile && activeModuleDetail ? "-340px" : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: prefersReducedMotion ? 0.1 : 0.5,
              }}
              style={{ opacity }}
            >
              <div
                className={`flex-1 overflow-y-auto w-full custom-scrollbar ${
                  activeModuleDetail ? 'pr-0' : 'p-3'
                }`}
                ref={mainContentRef}
              >
                <motion.div
                  initial={{ opacity: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: 0.1,
                  }}
                  className={`content-container ${
                    activeModuleDetail
                      ? 'content-with-sidebar bg-white p-6 sm:p-8 md:p-10 shadow-md border border-gray-200'
                      : 'content-without-sidebar glass-effect p-6 sm:p-8 md:p-10 shadow-xl border border-white/20'
                  }`}
                >                  <CourseContent
                    courseData={enrolledCoursesInfo}
                    activeModuleIndex={activeModuleIndex}
                    activeTopicIndex={activeTopicIndex}                    setActiveModuleIndex={(index) => {
                      setActiveModuleIndex(index);
                      updateUrl(index, activeTopicIndex);
                    }}
                    setActiveTopicIndex={(index) => {
                      setActiveTopicIndex(index);
                      updateUrl(activeModuleIndex, index);
                    }}
                    onChapterComplete={handleChapterCompletion}
                  />
                </motion.div>
              </div>
            </motion.main>

            {/* Module Detail Sidebar - shows when a module is selected */}
            <div className="detail-sidebar-container">
              <AnimatePresence mode="wait">
                {activeModuleDetail && (
                  <ModuleDetailSidebar
                    key="module-detail-sidebar"
                    moduleDetail={activeModuleDetail}
                    onClose={() => setActiveModuleDetail(null)}
                    handleSubModuleClick={handleSubModuleClick}
                  />
                )}
              </AnimatePresence>
            </div>          </div>
        )}
      </SidebarProvider>
        {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationAnimation
            isVisible={showCelebration}
            onComplete={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
