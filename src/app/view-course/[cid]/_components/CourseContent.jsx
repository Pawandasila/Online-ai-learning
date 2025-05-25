import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Clock,
  Video,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  User,
  Star,
  ExternalLink,
  Calendar,
  Code,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CourseContent = ({
  courseData,
  activeModuleIndex = 0,
  activeTopicIndex = 0,
  setActiveModuleIndex,
  setActiveTopicIndex,
  onChapterComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const contentRef = useRef(null);
  const topicPillsRef = useRef(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [completingChapter, setCompletingChapter] = useState(false);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Set up automatic progress tracking
  useEffect(() => {
    if (courseData?.enrollCourses?.progress) {
      setProgress(parseInt(courseData.enrollCourses.progress, 10));
    }
  }, [courseData]);

  // Update current module and topic when indices change
  useEffect(() => {
    const course = courseData?.courses || {};
    const courseModules = course?.courseContent?.enrichedModules || [];

    if (courseModules.length > 0 && activeModuleIndex !== undefined) {
      const module = courseModules[activeModuleIndex] || courseModules[0];
      setCurrentModule(module);

      const moduleTopics = module.topics || module.content || [];
      setTopics(moduleTopics);

      if (Array.isArray(moduleTopics) && moduleTopics.length > 0) {
        const topicIndex = Math.min(
          activeTopicIndex || 0,
          moduleTopics.length - 1
        );
        setCurrentTopic(moduleTopics[topicIndex]);
      } else {
        setCurrentTopic(null);
      }
    }
  }, [courseData, activeModuleIndex, activeTopicIndex]);

  // Add keyboard navigation for topic pills
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!topicPillsRef.current) return;

      // Handle left/right arrow keys for topic navigation
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const course = courseData?.courses || {};
        const courseModules = course?.courseContent?.enrichedModules || [];
        if (courseModules.length === 0) return;

        const currentModule = courseModules[activeModuleIndex] || {};
        const topics = currentModule.topics || currentModule.content || [];
        if (!Array.isArray(topics) || topics.length === 0) return;

        e.preventDefault();

        if (e.key === "ArrowLeft") {
          // Go to previous topic or previous module's last topic
          if (activeTopicIndex > 0) {
            setActiveTopicIndex(activeTopicIndex - 1);
          } else if (activeModuleIndex > 0) {
            const prevModuleTopics =
              courseModules[activeModuleIndex - 1]?.topics ||
              courseModules[activeModuleIndex - 1]?.content ||
              [];
            setActiveModuleIndex(activeModuleIndex - 1);
            setActiveTopicIndex(prevModuleTopics.length - 1);
          }
        } else if (e.key === "ArrowRight") {
          // Go to next topic or next module's first topic
          if (activeTopicIndex < topics.length - 1) {
            setActiveTopicIndex(activeTopicIndex + 1);
          } else if (activeModuleIndex < courseModules.length - 1) {
            setActiveModuleIndex(activeModuleIndex + 1);
            setActiveTopicIndex(0);
          }
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeModuleIndex,
    activeTopicIndex,
    courseData,
    setActiveModuleIndex,
    setActiveTopicIndex,
  ]);

  // Update progress when module/topic changes
  useEffect(() => {
    const totalModules =
      courseData?.courses?.courseContent?.enrichedModules?.length || 1;
    const newProgress = Math.min(
      Math.round(((activeModuleIndex + 1) / totalModules) * 100),
      100
    );

    // Only update if the new progress is higher than current
    if (newProgress > progress) {
      setProgress(newProgress);
      // Here you would normally call an API to update the progress
      // updateCourseProgress(newProgress);
    }
  }, [activeModuleIndex, activeTopicIndex, courseData, progress]);
    const isChapterCompleted = (chapterIndex) => {
    const completedChapters =
      courseData?.enrollCourses?.completedChapters || [];
    return (
      Array.isArray(completedChapters) &&
      completedChapters.includes(chapterIndex)
    );
  };
  
  // Helper function to check if the completion button should be shown
  const shouldShowCompletionButton = () => {
    // Only show the button if:
    // 1. We have valid module and topic data
    // 2. We're viewing the actual content (not just the sidebar)
    // 3. We have a valid module index
    // 4. We're on the LAST topic of the current chapter
    // 5. The chapter hasn't been completed yet
    
    if (!currentModule || !currentTopic || activeModuleIndex === undefined || activeTopicIndex === undefined) {
      return false;
    }
    
    const topics = currentModule.topics || currentModule.content || [];
    const isLastTopic = activeTopicIndex === topics.length - 1;
    const isNotCompleted = !isChapterCompleted(activeModuleIndex);
    
    return isLastTopic && isNotCompleted;
  };

  // Handle chapter completion
  const handleCompleteChapter = async () => {
    if (!onChapterComplete || completingChapter) return;

    try {
      setCompletingChapter(true);
      await onChapterComplete(activeModuleIndex);
    } catch (error) {
      console.error("Error completing chapter:", error);
    } finally {
      setCompletingChapter(false);
    }
  };

  if (!courseData) {
    return (
      <div className="text-center py-20">
        <div className="bg-white rounded-xl shadow-sm p-12 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Course Data
          </h2>
          <p className="text-gray-500">
            Course content is not available at this time.
          </p>
        </div>
      </div>
    );
  }

  const course = courseData.courses || {};
  const courseModules = course?.courseContent?.enrichedModules || [];

  if (courseModules.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white rounded-xl shadow-sm p-12 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {course.name}
          </h2>
          <p className="text-gray-500">
            No modules are available for this course yet.
          </p>
        </div>
      </div>
    );
  }

  const topicContent =
    typeof currentTopic === "string"
      ? currentTopic
      : currentTopic?.content || currentTopic?.topic;

  const nextTopic = () => {
    if (activeTopicIndex < topics.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    } else if (activeModuleIndex < courseModules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveTopicIndex(0);
    }
  };

  const prevTopic = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(activeTopicIndex - 1);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
      const prevModuleTopics =
        courseModules[activeModuleIndex - 1]?.topics ||
        courseModules[activeModuleIndex - 1]?.content ||
        [];
      setActiveTopicIndex(prevModuleTopics.length - 1);
    }
  };

  const formatContent = (content) => {
    if (!content) return null;

    return content.split("\n\n").map((paragraph, i) => (
      <div key={i} className="mb-4">
        {paragraph.includes("*") ? (
          <ul className="list-disc pl-5 space-y-2">
            {paragraph.split("\n").map((line, j) => (
              <React.Fragment key={j}>
                {line.startsWith("*") && (
                  <li className="text-gray-700">{line.substring(1).trim()}</li>
                )}
                {!line.startsWith("*") && line.trim() !== "" && (
                  <p className="text-gray-700">{line}</p>
                )}
              </React.Fragment>
            ))}
          </ul>
        ) : paragraph.startsWith("###") ? (
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
            {paragraph.replace(/^###\s*/, "")}
          </h3>
        ) : paragraph.startsWith("##") ? (
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            {paragraph.replace(/^##\s*/, "")}
          </h2>
        ) : paragraph.startsWith("#") ? (
          <h1 className="text-3xl font-extrabold text-gray-900 mt-10 mb-6">
            {paragraph.replace(/^#\s*/, "")}
          </h1>
        ) : paragraph.startsWith("```") ? (
          <div className="bg-gray-800 text-gray-100 p-4 rounded-md my-4 font-mono text-sm overflow-x-auto">
            <pre>{paragraph.replace(/^```(.*)\n/, "").replace(/```$/, "")}</pre>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{paragraph}</p>
        )}
      </div>
    ));
  };
  // Function to get YouTube video ID from topic
  const getYoutubeVideoId = () => {
    if (currentTopic?.videoId) {
      return currentTopic.videoId;
    }

    // Check if the current module has videos and find by topic name
    if (
      currentModule?.youtubeVideos &&
      currentModule.youtubeVideos.length > 0
    ) {
      const topicTitle =
        typeof currentTopic === "string" ? currentTopic : currentTopic?.topic;
      const matchingVideo = currentModule.youtubeVideos.find(
        (video) => video.title && topicTitle && video.title.includes(topicTitle)
      );
      return matchingVideo?.videoId;
    }

    return null;
  };

  // Function to get iframe URL from topic
  const getIframeUrl = () => {
    if (currentTopic?.iframeUrl) {
      return currentTopic.iframeUrl;
    }

    if (currentTopic?.url && currentTopic.url.includes("iframe")) {
      return currentTopic.url;
    }

    return null;
  };

  const videoId = getYoutubeVideoId();
  const iframeUrl = getIframeUrl();

  return (
    <div className="course-content-container" ref={contentRef}>
      {/* Progress Bar */}
      <div className="mb-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Course Progress
          </span>
          <span className="text-sm font-medium text-gray-700">
            {courseData?.enrollCourses?.progress || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${courseData?.enrollCourses?.progress || 0}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            {courseData?.enrollCourses?.completedChapters?.length || 0} of{" "}
            {courseModules.length} chapters completed
          </span>
          <span>{courseModules.length} Modules</span>

          {courseData?.enrollCourses?.isCompleted && (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Course Completed!
            </span>
          )}
        </div>
      </div>
      {/* Header with module title and navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            <span className="text-lg font-semibold text-blue-600 block sm:inline sm:mr-2">
              Module {activeModuleIndex + 1}:
            </span>

            {currentModule?.chapterName?.replace(/Module \d+: /i, "")}
          </h1>

          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Clock size={14} />
              <span>{currentModule?.duration || "1-2 hours"}</span>
            </div>
            {currentModule?.youtubeVideos &&
              currentModule.youtubeVideos.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Video size={14} className="text-red-500" />
                  <span>{currentModule.youtubeVideos.length} videos</span>
                </div>
              )}
          </div>
        </div>

        {/* Progress bar */}
        {/* <div className="w-full bg-gray-200 rounded-full h-2 mb-1 mt-4">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 30, 
              duration: prefersReducedMotion ? 0.1 : 0.8
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-6">
          <span>{progress}% Complete</span>
          <span>{courseModules.length} Modules</span>
        </div> */}
      </div>
      {/* Topics Navigation Pills */}
      {Array.isArray(topics) && topics.length > 1 && (
        <div
          className="flex gap-1 mb-6 overflow-x-auto pb-2 custom-scrollbar"
          ref={topicPillsRef}
        >
          {topics.map((topic, index) => {
            const isActive = activeTopicIndex === index;
            const topicTitle = typeof topic === "string" ? topic : topic.topic;

            return (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setActiveTopicIndex(index);
                  setTimeout(() => setIsAnimating(false), 300);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100"
                } border flex items-center gap-2`}
              >
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-semibold border border-current">
                  {index + 1}
                </span>
                <span className="truncate max-w-[180px]">{topicTitle}</span>
              </button>
            );
          })}
        </div>
      )}
      {/* Main Content Area */}
      <div className="content-wrapper relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeModuleIndex}-${activeTopicIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
              duration: prefersReducedMotion ? 0.1 : 0.3,
            }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            {/* Topic Content */}
            <div className="prose prose-blue max-w-none mb-6">
              {typeof currentTopic === "string" ? (
                <div className="text-gray-700">{currentTopic}</div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentTopic?.topic || "Topic Content"}
                  </h2>
                  {formatContent(topicContent)}
                </>
              )}
            </div>{" "}
            {/* YouTube Video or General Iframe */}
            {(videoId || iframeUrl) && (
              <div className="mt-6 mb-8">
                <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
                  {videoId ? (
                    <div className="youtube-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 md:h-80 lg:h-96"
                      ></iframe>
                    </div>
                  ) : iframeUrl ? (
                    <div className="iframe-container">
                      <iframe
                        src={iframeUrl}
                        title="Topic content"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 md:h-80 lg:h-96 border-none"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      ></iframe>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {typeof currentTopic === "string"
                    ? currentTopic
                    : currentTopic?.topic ||
                      "Interactive content for this topic"}
                </p>
              </div>
            )}
            {/* Notes section */}
            <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="text-md font-semibold text-blue-800 mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Important Notes
              </h4>
              <div className="text-sm text-blue-700">
                <p>
                  Remember to apply these concepts through practical exercises.
                  For any questions, use the discussion forum or reach out to
                  your instructor.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>{" "}
      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevTopic}
          disabled={activeModuleIndex === 0 && activeTopicIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            activeModuleIndex === 0 && activeTopicIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
          aria-label="Previous topic"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>{" "}
        
        <div className="flex items-center gap-3">
          {shouldShowCompletionButton() ? (            <button
              onClick={handleCompleteChapter}
              disabled={completingChapter}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                completingChapter
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {completingChapter ? "Marking as Read..." : "Mark as Read"}
            </button>
          ) : isChapterCompleted(activeModuleIndex) ? (            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Chapter Read</span>
            </div>
          ) : null}
        </div>
        <button
          onClick={nextTopic}
          disabled={
            activeModuleIndex === courseModules.length - 1 &&
            activeTopicIndex === topics.length - 1
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            activeModuleIndex === courseModules.length - 1 &&
            activeTopicIndex === topics.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label="Next topic"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
