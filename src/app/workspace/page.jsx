'use client'

import React from 'react'
import CourseList from './_components/CourseList'
import EnrolledCourseList from './_components/EnrolledCourseList'

const WorkspacePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Global CSS for shimmer effect */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div>
          <EnrolledCourseList />
        </div>
        <div className="mt-4">
          <CourseList />
        </div>
      </div>
    </div>
  )
}

export default WorkspacePage