"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Video,
  Tag,
  FileText,
  CheckCircle,
  X,
  Play,
  BookOpen as BookOpenIcon,
  ArrowRight,
} from "lucide-react";

const ModuleDetailSidebar = ({
  moduleDetail,
  onClose,
  handleSubModuleClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const focusableElements = useRef([]);
  const [hoveredTopic, setHoveredTopic] = useState(null);

  // Check for mobile screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!moduleDetail) return;

    const handleKeyDown = (e) => {
      // Close on escape key
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
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
    document.addEventListener("keydown", handleKeyDown);

    // Set initial focus to close button
    if (sidebarRef.current) {
      const closeButton = sidebarRef.current.querySelector(
        'button[aria-label="Close module detail"]'
      );
      if (closeButton) {
        setTimeout(() => {
          closeButton.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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

  const handleTopicClick = (topicIndex) => {
    if (handleSubModuleClick) {
      handleSubModuleClick(moduleIndex, topicIndex);
      if (isMobile) {
        onClose();
      }
    }  };

  return (
    <>
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
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1,
        }}
        className="module-detail-sidebar fixed lg:absolute top-0 right-0 h-screen z-40 bg-white border-l border-gray-200 lg:shadow-none shadow-xl flex flex-col rounded-l-2xl lg:rounded-none w-[360px] overflow-hidden"
      >
        <div className="py-5 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
              <BookOpenIcon size={18} className="text-gray-600" />
            </div>
            <div>
              <span className="text-lg">Module {moduleNumber}</span>
              <div className="text-xs text-gray-500 font-normal">
                Module Details
              </div>
            </div>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-50 p-2 rounded-xl group"
            aria-label="Close module detail"
          >
            <X
              size={18}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>
        {/* Content area */}
        <div className="flex-grow overflow-y-auto px-6 py-5 custom-scrollbar bg-white">
          {/* Topics section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Topics
              </h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {Array.isArray(topics) ? topics.length : 0}
              </span>
            </div>
            <div className="space-y-3">
              {Array.isArray(topics) && topics.length > 0 ? (
                topics.map((topic, index) => {
                  const topicTitle =
                    typeof topic === "string" ? topic : topic.topic;

                  return (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${
                        hoveredTopic === index
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-blue-300 bg-white hover:bg-blue-50"
                      } transition-all duration-300 cursor-pointer flex items-center shadow-sm hover:shadow-sm group border border-gray-100 hover:border-blue-200`}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(index)}
                      tabIndex={0}
                      role="button"
                      onMouseEnter={() => setHoveredTopic(index)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleTopicClick(index);
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="flex-1 mr-3">
                        <span className="block text-sm font-semibold text-gray-800 leading-relaxed">
                          {topicTitle}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Topic {index + 1}
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0.5, x: -3 }}
                        animate={{
                          opacity: hoveredTopic === index ? 1 : 0.5,
                          x: hoveredTopic === index ? 0 : -3,
                          scale: hoveredTopic === index ? 1.1 : 1,
                        }}
                        className="text-blue-600 p-1 rounded-full bg-blue-100 group-hover:bg-blue-200"
                      >
                        <ArrowRight size={14} />
                      </motion.div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                  <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No topics available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    This module doesn't have topics yet
                  </p>
                </div>
              )}
            </div>
          </section>
          {/* Video resources section */}
          {videos.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Video Resources
                </h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {videos.length}
                </span>
              </div>
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl bg-white border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all duration-300 flex items-center cursor-pointer shadow-sm hover:shadow-md group"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleTopicClick(
                        moduleIndex,
                        topics.findIndex(
                          (t) =>
                            (typeof t === "string" ? t : t.topic) ===
                            video.title
                        ) !== -1
                          ? topics.findIndex(
                              (t) =>
                                (typeof t === "string" ? t : t.topic) ===
                                video.title
                            )
                          : 0
                      )
                    }
                  >
                    {" "}
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Play size={18} className="text-white ml-0.5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-semibold text-gray-800 line-clamp-2 leading-relaxed">
                        {video.title}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Video Content
                      </div>
                    </div>
                    <div className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
          {/* Tags section */}
          {tags.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Related Topics
                </h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {tags.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 text-sm font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 transition-all cursor-pointer"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold"
            >
              <CheckCircle size={18} />
              <span>Mark Module as Complete</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border border-gray-200 hover:border-gray-300 font-medium"
            >
              <BookOpenIcon size={16} />
              <span>View Full Content</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModuleDetailSidebar;
