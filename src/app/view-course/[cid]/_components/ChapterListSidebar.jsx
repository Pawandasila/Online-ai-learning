"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ChevronRight, 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  Clock,
  X,
  Menu,
  Play,
  FileText,
  Video,
  Star
} from "lucide-react";

const ChapterSidebar = ({ enrolledCoursesInfo, setActiveModuleDetail }) => {
  // Get course and enrollment data from props
  const course = enrolledCoursesInfo?.courses || {};
  const enrolledCourse = enrolledCoursesInfo?.enrollCourses || {};
  
  // Get course modules from the enriched modules in courseContent
  const courseModules = course?.courseContent?.enrichedModules || [];
  const [activeModule, setActiveModule] = useState(null);
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
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        // Find all module headers
        const moduleHeaders = sidebarRef.current?.querySelectorAll('.module-header');
        if (!moduleHeaders || moduleHeaders.length === 0) return;
        
        // Find currently focused element
        const currentFocusedIndex = Array.from(moduleHeaders).findIndex(
          el => el === document.activeElement
        );
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = currentFocusedIndex < moduleHeaders.length - 1 ? currentFocusedIndex + 1 : 0;
        } else {
          nextIndex = currentFocusedIndex > 0 ? currentFocusedIndex - 1 : moduleHeaders.length - 1;
        }
        
        moduleHeaders[nextIndex].focus();
      }
      
      // Close sidebar on Escape in mobile view
      if (e.key === 'Escape' && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeModule]);
  
  // Get course progress
  useEffect(() => {
    if (enrolledCourse && enrolledCourse.progress) {
      setProgress(parseInt(enrolledCourse.progress, 10));
    }
  }, [enrolledCourse]);
  
  // For synchronizing with URL parameters
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg rounded-full p-2 transition-all hover:bg-gray-100"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`chapter-sidebar fixed lg:sticky top-0 left-0 h-screen z-40 lg:z-30 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden flex flex-col optimized-animation ${isMobile ? 'w-[85%] max-w-[320px]' : 'w-[320px]'}`}
            aria-label="Course chapter navigation"
          >
            {/* Sidebar Header */}
            <div className="py-4 px-6 border-b border-gray-100 flex items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <Image
                src="/logo.svg"
                alt="SkillSprint Logo"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillSprint
              </h1>
              
              {isMobile && (
                <button 
                  className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Course Info Banner */}
            <div className="py-4 px-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <h2 className="font-semibold text-gray-800 mb-1 truncate">
                {course.name}
              </h2>
              
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{courseModules?.length || 0} Modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course?.courseJson?.course?.duration || "2-4"} Hours</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-right text-gray-500">{progress}% Complete</p>
            </div>
            
            {/* Course Modules */}
            <div className="flex-grow overflow-y-auto" ref={sidebarRef}>
              <div className="py-3 px-5 sticky top-0 bg-white z-10 border-b border-gray-100">
                <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Course Modules</h3>
              </div>
              
              {/* Timeline Content */}
              <div className="timeline px-3 pb-8 pt-2 overflow-y-auto">
                {courseModules.length > 0 ? (
                  <div className="relative">
                    {/* Timeline main line */}
                    <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-blue-100 via-blue-300 to-indigo-200 rounded-full" />
                    
                    {courseModules.map((module, moduleIndex) => {
                      const isActive = activeModule === moduleIndex;
                      const isCompleted = progress >= ((moduleIndex + 1) / courseModules.length) * 100;
                      const hasTopics = module.topics && module.topics.length > 0;
                      
                      return (
                        <div key={moduleIndex} className="mb-3">
                          {/* Module Header */}
                          <motion.div
                            onClick={() => {
                              // Toggle selected module
                              const newActiveModule = isActive ? null : moduleIndex;
                              setActiveModule(newActiveModule);
                              
                              // Send selected module data to parent for detail view
                              if (newActiveModule !== null) {
                                updateModuleDetail({
                                  moduleIndex: moduleIndex,
                                  moduleData: module
                                });
                              } else {
                                updateModuleDetail(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle keyboard activation
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                
                                // Toggle selected module
                                const newActiveModule = isActive ? null : moduleIndex;
                                setActiveModule(newActiveModule);
                                
                                // Send selected module data to parent for detail view
                                if (newActiveModule !== null) {
                                  updateModuleDetail({
                                    moduleIndex: moduleIndex,
                                    moduleData: module
                                  });
                                } else {
                                  updateModuleDetail(null);
                                }
                              }
                            }}
                            className={`relative flex items-start py-3 pl-12 pr-4 rounded-lg cursor-pointer transition-all ${
                              isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                            } module-header optimized-animation`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isActive}
                            aria-label={`Module ${moduleIndex + 1}: ${module.chapterName?.replace(/Module \d+: /i, '')}`}
                          >
                            {/* Timeline Node */}
                            <div 
                              className={`absolute left-5 top-4 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-green-500 border-green-500 shadow-md shadow-green-200' 
                                  : isActive 
                                    ? 'bg-blue-500 border-blue-500 shadow-md shadow-blue-200' 
                                    : 'bg-white border-gray-300'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-white" />
                              ) : isActive ? (
                                <Play className="h-3 w-3 text-white fill-white" />
                              ) : (
                                <span className="text-xs font-bold text-gray-500">{moduleIndex + 1}</span>
                              )}
                            </div>
                            
                            {/* Module Content */}
                            <div className="flex-grow">
                              <p className={`font-medium text-base ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                                {module.chapterName?.replace(/Module \d+: /i, '')}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                <span>{module.duration || "1-2 hours"}</span>
                                {module.youtubeVideos && module.youtubeVideos.length > 0 && (
                                  <div className="flex items-center ml-3">
                                    <Video size={14} className="mr-1 text-indigo-500" />
                                    <span>{module.youtubeVideos.length} videos</span>
                                  </div>
                                )}
                                {hasTopics && (
                                  <div className="flex items-center ml-3">
                                    <FileText size={14} className="mr-1 text-gray-500" />
                                    <span>{module.topics.length} topics</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Info icon that this has details */}
                            <div className="flex-shrink-0 pt-1 ml-2">
                              <ChevronRight size={18} className="text-gray-400" />
                            </div>
                          </motion.div>
                        </div>
                      );                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-10 text-gray-500">
                    <p>No modules available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
              <Link
                href="/workspace"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
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
