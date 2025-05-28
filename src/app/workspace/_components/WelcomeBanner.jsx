import React from "react";
import { useUser } from "@clerk/nextjs";

const WelcomeBanner = () => {
  const { user, isLoaded } = useUser();
  
  const getUserName = () => {
    if (!isLoaded || !user) return "User";
    return user.fullName || user.firstName || user.username || "User";
  };

  return (
    <div className="p-4 mt-4 mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-xl font-medium">
            Welcome back, {isLoaded ? getUserName() : "..."}
          </h2>
          <p className="text-blue-100 mt-1">
            Your workspace is ready for today's tasks
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors">
            New Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
