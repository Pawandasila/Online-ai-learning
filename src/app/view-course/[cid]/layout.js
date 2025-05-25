"use client";

import React from 'react';
import { motion } from "framer-motion";
import './course-styles.css';

function CourseLayout({ children }) {
  return (
    <motion.div 
      className="course-layout-container bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen relative prose-course"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Design elements for visual enhancement */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-100/40 to-indigo-100/40 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-l from-blue-100/40 to-indigo-100/40 -z-10"></div>
      
      {/* Decorative circles */}
      <div className="hidden lg:block absolute top-10 right-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -z-10"></div>
      <div className="hidden lg:block absolute bottom-10 left-10 w-64 h-64 bg-indigo-200/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Main content */}
      <div className="relative z-0">
        {children}
      </div>
    </motion.div>
  );
}

export default CourseLayout;