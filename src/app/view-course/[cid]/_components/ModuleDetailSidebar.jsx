"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  BookOpen, 
  Clock, 
  Video, 
  Tag, 
  Download, 
  Link as LinkIcon,
  FileText,
  CheckCircle,
  X,
  Play,
  BookOpen as BookOpenIcon
} from "lucide-react";

const ModuleDetailSidebar = ({ moduleDetail, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const focusableElements = useRef([]);
  
  // Check for mobile screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!moduleDetail) return;
    
    const handleKeyDown = (e) => {
      // Close on escape key
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'Tab') {
        // Get all focusable elements inside the sidebar
        const elements = sidebarRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.current = Array.from(elements);
        
        if (elements.length === 0) return;
        
        // If shift+tab, move focus backward
        if (e.shiftKey) {
          if (document.activeElement === elements[0]) {
            elements[elements.length - 1].focus();
            e.preventDefault();
          }
        } else {
          // If tab, move focus forward
          if (document.activeElement === elements[elements.length - 1]) {
            elements[0].focus();
            e.preventDefault();
          }
        }
      }
    };
    
    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    
    // Set initial focus to close button
    if (sidebarRef.current) {
      const closeButton = sidebarRef.current.querySelector('button[aria-label="Close module detail"]');
      if (closeButton) {
        setTimeout(() => {
          closeButton.focus();
        }, 100);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moduleDetail, onClose]);
  
  if (!moduleDetail) return null;
  
  const { moduleIndex, moduleData } = moduleDetail;
  const moduleNumber = moduleIndex + 1;
  
  // Extract topics from module data
  const topics = moduleData.topics || moduleData.content || [];
  
  // Extract videos if available
  const videos = moduleData.youtubeVideos || [];
  
  // Extract tags if available
  const tags = moduleData.tags || [];
  
  // Duration
  const duration = moduleData.duration || "1-2 hours";
  
  return (
    <AnimatePresence mode="wait">
      {/* Overlay for mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}
      
      <motion.div
        ref={sidebarRef}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={`module-detail-sidebar fixed lg:sticky top-0 right-0 h-screen z-40 bg-white border-l border-gray-200 shadow-lg flex flex-col rounded-l-xl lg:rounded-none optimized-animation ${
          isMobile ? 'w-[95%] max-w-[360px]' : 'w-[320px]'
        }`}
      >
        {/* Header with close button */}
        <div className="py-4 px-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <BookOpenIcon size={18} className="text-blue-600" />
            <span>Module {moduleNumber} Detail</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 p-1 rounded-full"
            aria-label="Close module detail"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Module title */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-medium text-gray-800 leading-tight">
            {moduleData.chapterName?.replace(/Module \d+: /i, '')}
          </h3>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{duration}</span>
            </div>
            {videos.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <Video size={14} className="mr-1 text-red-500" />
                <span>{videos.length} videos</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-grow overflow-y-auto px-5 py-4">
          {/* Topics section */}
          <section className="mb-6">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center">
              <FileText size={14} className="mr-2" />
              Topics
            </h4>
            <div className="space-y-2.5">
              {Array.isArray(topics) && topics.length > 0 ? (
                topics.map((topic, index) => {
                  const topicTitle = typeof topic === 'string' ? topic : topic.topic;
                  
                  return (
                    <motion.div 
                      key={index}
                      className="p-3 rounded-md border-l-4 border-blue-400 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer flex items-center shadow-sm"
                      whileHover={{ x: 5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          // Here you can add functionality when a topic is activated via keyboard
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 text-blue-700 shadow-sm">
                        <span className="text-xs font-semibold">{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{topicTitle}</p>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 italic">No topics available</p>
              )}
            </div>
          </section>
          
          {/* Videos section */}
          {videos.length > 0 && (
            <section className="mb-6">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center">
                <Video size={14} className="mr-2 text-red-500" />
                Video Resources
              </h4>
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <a
                    key={index}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-3 rounded-md border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    aria-label={`Watch video: ${video.title}`}
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-red-100 rounded-md flex items-center justify-center text-red-500 flex-shrink-0 mr-3 group-hover:bg-red-200 transition-colors">
                        <Play size={16} className="ml-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">{video.title}</p>
                        <p className="text-xs text-gray-500 mt-1">YouTube Video</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
          
          {/* Tags section */}
          {tags.length > 0 && (
            <section className="mb-6">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center">
                <Tag size={14} className="mr-2" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* Resources section - if any */}
          {moduleData.resources && moduleData.resources.length > 0 && (
            <section className="mb-6">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3 flex items-center">
                <Download size={14} className="mr-2" />
                Resources
              </h4>
              <div className="space-y-2">
                {moduleData.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2.5 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                    aria-label={`Open resource: ${resource.title || `Resource ${index + 1}`}`}
                  >
                    <LinkIcon size={14} className="mr-2 text-blue-600" />
                    <span className="text-sm text-blue-600 truncate hover:underline">
                      {resource.title || `Resource ${index + 1}`}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Footer action */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button 
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-md"
            aria-label="Start learning this module"
          >
            <Play size={16} className="fill-white" />
            <span>Start Learning</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModuleDetailSidebar;
