"use client";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Rocket,
  Play,
  Star,
  Brain,
  Users,
  Award,
  ChevronRight,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  Zap,
} from "lucide-react";

export function HeroSection() {
  const [currentModule, setCurrentModule] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModule((prev) => (prev === 4 ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/10 to-blue-100/10 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  AI-Powered Learning Revolution
                </span>
                <ChevronRight className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Create{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Genius
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-lg opacity-70 rounded-lg" />
                  </span>
                  <br />
                  Learning Courses
                  <br />
                  <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-slate-600 dark:text-slate-400 font-semibold">
                    with AI Magic ✨
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Transform any topic into a comprehensive learning experience.
                Our AI generates custom courses with curated content, exercises,
                and progress tracking tailored specifically for you.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Start Learning Free
                  </span>
                </button>

                <button className="group px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-2xl font-semibold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white dark:border-slate-900 shadow-lg"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      50,000+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Happy Learners
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      4.9
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Average Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Course Preview */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60" />

              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      AI Course Generator
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span>React Development</span>
                      <Award className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Overall Progress
                    </span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      57%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full shadow-sm transition-all duration-1000 ease-out"
                      style={{ width: "57%" }}
                    />
                  </div>
                </div>

                {/* Course Modules */}
                <div className="space-y-3 mb-6">
                  {[
                    {
                      title: "Introduction to React",
                      progress: 100,
                      status: "completed",
                      icon: CheckCircle,
                      color: "text-emerald-500",
                    },
                    {
                      title: "Components & Props",
                      progress: 85,
                      status: "active",
                      icon: Zap,
                      color: "text-blue-500",
                    },
                    {
                      title: "State Management",
                      progress: 45,
                      status: "in-progress",
                      icon: Target,
                      color: "text-orange-500",
                    },
                    {
                      title: "Advanced Hooks",
                      progress: 0,
                      status: "upcoming",
                      icon: BookOpen,
                      color: "text-slate-400",
                    },
                  ].map((module, index) => {
                    const Icon = module.icon;
                    const isActive = currentModule === index;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-700 shadow-md"
                            : "bg-slate-50/80 dark:bg-slate-800/50 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${module.color}`} />
                            <span
                              className={`font-semibold ${
                                isActive
                                  ? "text-purple-700 dark:text-purple-300"
                                  : "text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {module.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                              {module.progress}%
                            </span>
                            {module.status === "active" && (
                              <TrendingUp className="w-4 h-4 text-emerald-500 animate-pulse" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              module.progress === 100
                                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                : module.progress > 0
                                ? "bg-gradient-to-r from-blue-400 to-purple-600"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Button */}
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
