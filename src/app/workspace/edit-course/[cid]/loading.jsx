"use client";

const LoadingComponent = () => {

  return (
     <div className="max-w-6xl mx-auto animate-pulse">
      {/* Banner skeleton */}
      <div className="h-64 md:h-80 bg-gray-200 rounded-xl mb-8"></div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          {/* Overview skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Categories skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex flex-wrap gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-24"></div>
              ))}
            </div>
          </div>
          
          {/* Module list skeleton - with timeline */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              {/* Module skeletons */}
              <div className="space-y-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative">
                    {/* Circle */}
                    <div className="absolute left-4 top-5 transform -translate-x-1/2">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    </div>
                    
                    {/* Module card */}
                    <div className="ml-10 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-5 flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="flex items-center space-x-3">
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column skeleton */}
        <div className="lg:w-1/3">
          <div className="space-y-6">
            {/* Course action card skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
              
              <div className="mt-6 space-y-3">
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
            
            {/* What you'll learn skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-3 mt-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;