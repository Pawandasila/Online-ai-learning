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
  Download,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CourseContent = ({ courseData }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const contentRef = useRef(null);
  const topicPillsRef = useRef(null);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set up automatic progress tracking
  useEffect(() => {
    if (courseData?.enrollCourses?.progress) {
      setProgress(parseInt(courseData.enrollCourses.progress, 10));
    }
  }, [courseData]);

  // Add keyboard navigation for topic pills
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!topicPillsRef.current) return;
      
      // Handle left/right arrow keys for topic navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const course = courseData?.courses || {};
        const courseModules = course?.courseContent?.enrichedModules || [];
        if (courseModules.length === 0) return;
        
        const currentModule = courseModules[activeModule] || {};
        const topics = currentModule.topics || currentModule.content || [];
        if (!Array.isArray(topics) || topics.length === 0) return;
        
        e.preventDefault();
        
        if (e.key === 'ArrowLeft') {
          // Go to previous topic or previous module's last topic
          if (activeTopic > 0) {
            setActiveTopic(activeTopic - 1);
          } else if (activeModule > 0) {
            const prevModuleTopics = courseModules[activeModule - 1]?.topics || 
                                   courseModules[activeModule - 1]?.content || [];
            setActiveModule(activeModule - 1);
            setActiveTopic(prevModuleTopics.length - 1);
          }
        } else if (e.key === 'ArrowRight') {
          // Go to next topic or next module's first topic
          if (activeTopic < topics.length - 1) {
            setActiveTopic(activeTopic + 1);
          } else if (activeModule < courseModules.length - 1) {
            setActiveModule(activeModule + 1);
            setActiveTopic(0);
          }
        }
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModule, activeTopic, courseData]);

  // Update progress when module/topic changes
  useEffect(() => {
    const totalModules = courseData?.courses?.courseContent?.enrichedModules?.length || 1;
    const newProgress = Math.min(
      Math.round(((activeModule + 1) / totalModules) * 100),
      100
    );
    
    // Only update if the new progress is higher than current
    if (newProgress > progress) {
      setProgress(newProgress);
      // Here you would normally call an API to update the progress
      // updateCourseProgress(newProgress);
    }
  }, [activeModule, activeTopic, progress]);

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

  const currentModule = courseModules[activeModule] || {};
  const topics = currentModule.topics || currentModule.content || [];
  const currentTopic = Array.isArray(topics) ? topics[activeTopic] : null;

  const topicContent =
    typeof currentTopic === "string"
      ? null
      : currentTopic?.content || currentTopic?.topic;
  
  const nextTopic = () => {
    if (activeTopic < topics.length - 1) {
      setActiveTopic(activeTopic + 1);
    } else if (activeModule < courseModules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveTopic(0);
    }
  };

  const prevTopic = () => {
    if (activeTopic > 0) {
      setActiveTopic(activeTopic - 1);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      const prevModuleTopics =
        courseModules[activeModule - 1]?.topics ||
        courseModules[activeModule - 1]?.content ||
        [];
      setActiveTopic(prevModuleTopics.length - 1);
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
                  <li className="text-gray-700">
                    {line.substring(1).trim()}
                  </li>
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

  return (
    <div className="course-content-container" ref={contentRef}>
      {/* Header with module title and navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            <span className="text-lg font-semibold text-blue-600 block sm:inline sm:mr-2">
              Module {activeModule + 1}:
            </span>{" "}
            {currentModule.chapterName?.replace(/Module \d+: /i, "")}
          </h1>
          
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Clock size={14} />
              <span>{currentModule.duration || "1-2 hours"}</span>
            </div>
            {currentModule.youtubeVideos && currentModule.youtubeVideos.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Video size={14} className="text-red-500" />
                <span>{currentModule.youtubeVideos.length} videos</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1 mt-4">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-6">
          <span>{progress}% Complete</span>
          <span>{courseModules.length} Modules</span>
        </div>
      </div>

      {/* Topics Navigation Pills */}
      {Array.isArray(topics) && topics.length > 1 && (
        <div 
          className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
          ref={topicPillsRef}
        >
          {topics.map((topic, index) => {
            const isActive = activeTopic === index;
            const topicTitle = typeof topic === "string" ? topic : topic.topic;
            
            return (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setActiveTopic(index);
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
            key={`${activeModule}-${activeTopic}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            {/* Topic Content */}
            <div className="prose prose-blue max-w-none">
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
            </div>

            {/* If current topic has YouTube video */}
            {currentTopic?.videoId && (
              <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Video className="h-5 w-5 text-red-500 mr-2" />
                  Video Resource
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentTopic.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
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
                  For any questions, use the discussion forum or reach out to your instructor.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevTopic}
          disabled={activeModule === 0 && activeTopic === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            activeModule === 0 && activeTopic === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
          aria-label="Previous topic"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
            title="Share this module"
            aria-label="Share this module"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
            title="Download resources"
            aria-label="Download resources"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={nextTopic}
          disabled={
            activeModule === courseModules.length - 1 &&
            activeTopic === topics.length - 1
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            activeModule === courseModules.length - 1 &&
            activeTopic === topics.length - 1
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
