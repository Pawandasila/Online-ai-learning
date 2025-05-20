'use client';

import React from "react";

const CourseListLoading = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      {/* Skeleton image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <div className="absolute inset-0 shimmer"></div>
      </div>

      <div className="p-5">
        {/* Skeleton title */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2 shimmer-content"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16 shimmer-content"></div>
        </div>

        {/* Skeleton description */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2 shimmer-content"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 shimmer-content"></div>

        {/* Skeleton stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-5/6 shimmer-content"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 shimmer-content"></div>
          <div className="h-4 bg-gray-200 rounded w-full col-span-2 shimmer-content"></div>
        </div>

        {/* Skeleton button */}
        <div className="h-12 bg-gray-200 rounded-lg w-full mt-4 shimmer-content"></div>
      </div>
    </div>
  );
};

export default CourseListLoading;