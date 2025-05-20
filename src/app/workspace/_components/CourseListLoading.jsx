'use client';

import React from "react";

const CourseListLoading = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md relative">
      {/* Skeleton image */}
      <div className="h-48 overflow-hidden bg-gray-200 relative">
        <div className="shimmer"></div>
      </div>

      <div className="p-5">
        {/* Skeleton title */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2 relative overflow-hidden">
            <div className="shimmer"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded-full w-16 relative overflow-hidden">
            <div className="shimmer"></div>
          </div>
        </div>

        {/* Skeleton description */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2 relative overflow-hidden">
          <div className="shimmer"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 relative overflow-hidden">
          <div className="shimmer"></div>
        </div>

        {/* Skeleton stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden">
            <div className="shimmer"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-4/6 relative overflow-hidden">
            <div className="shimmer"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full col-span-2 relative overflow-hidden">
            <div className="shimmer"></div>
          </div>
        </div>

        {/* Skeleton button */}
        <div className="h-12 bg-gray-200 rounded-lg w-full mt-4 relative overflow-hidden">
          <div className="shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseListLoading;