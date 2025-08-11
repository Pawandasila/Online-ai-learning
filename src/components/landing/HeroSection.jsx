"use client";
import { useState, useEffect, useRef } from "react";
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
  ArrowRight,
  Globe,
  Clock,
  Shield,
  Lightbulb,
  Palette,
  Code,
  Database,
} from "lucide-react";

export function HeroSection() {
  const [currentModule, setCurrentModule] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const heroRef = useRef(null);

  const phrases = ["AI-Powered Learning", "Personalized Courses", "Smart Education"];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModule((prev) => (prev === 4 ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Typing animation effect
  useEffect(() => {
    const phrase = phrases[currentPhrase];
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= phrase.length) {
        setTypedText(phrase.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentPhrase]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30 overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div 
          className="absolute w-72 h-72 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse transition-all duration-1000"
          style={{
            top: `${20 + mousePosition.y * 10}%`,
            left: `${10 + mousePosition.x * 5}%`,
          }}
        />
        <div
          className="absolute w-96 h-96 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse transition-all duration-1000"
          style={{ 
            animationDelay: "1s",
            bottom: `${20 + mousePosition.y * 8}%`,
            right: `${10 + mousePosition.x * 6}%`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/10 to-blue-100/10 dark:from-purple-900/10 dark:to-blue-900/10 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) rotate(${mousePosition.x * 360}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        
      </div>

      <div className="relative z-10 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <div className={`text-center lg:text-left space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-full border border-purple-200/60 dark:border-purple-700/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
                <ChevronRight className="w-3 h-3 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Enhanced Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-5xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">

                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                      Genius Learning
                    </span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-70 rounded-lg animate-pulse" />
                  </span>
                  <br />
                  <span className="relative">
                     Courses
                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                      <path d="M2 10C50 2 100 2 198 10" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <br />
                  <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-slate-600 dark:text-slate-400 font-bold">
                    with AI Magic 
                    <span className="inline-block animate-bounce ml-2">✨</span>
                  </span>
                </h1>
                
                {/* Subtitle with stats */}
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Generate in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Expert-validated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Any topic, any level</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Transform any topic into a comprehensive learning experience with our cutting-edge AI. 
                  Generate custom courses, interactive exercises, and personalized learning paths 
                  <span className="font-semibold text-purple-600 dark:text-purple-400"> tailored specifically for you</span>.
                </p>
                
                {/* Key features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  {[
                    "Instant course generation",
                    "Interactive quizzes & exercises", 
                    "Progress tracking & analytics",
                    "Multi-format content support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-3">
                    <Rocket className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                <button className="group relative px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-2xl font-bold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Watch Demo
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">2 min</span>
                  </span>
                </button>
              </div>

              {/* Enhanced Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex -space-x-3">
                    {[
                      { bg: "from-purple-500 to-blue-500", delay: "0s" },
                      { bg: "from-pink-500 to-purple-500", delay: "0.1s" },
                      { bg: "from-blue-500 to-cyan-500", delay: "0.2s" },
                      { bg: "from-green-500 to-blue-500", delay: "0.3s" },
                      { bg: "from-orange-500 to-pink-500", delay: "0.4s" },
                    ].map((avatar, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.bg} border-3 border-white dark:border-slate-900 shadow-lg hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer`}
                        style={{ animationDelay: avatar.delay }}
                      />
                    ))}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-3 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm hover:scale-110 transition-all duration-300 cursor-pointer">
                      +12K
                    </div>
                  </div>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      50,000+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                      Happy Learners Worldwide
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform duration-200"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      4.9
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                      Average Rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 opacity-60 hover:opacity-90 transition-opacity duration-300">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Trusted by</span>
                <div className="flex items-center gap-4">
                  {["Google", "Microsoft", "OpenAI", "Meta"].map((company) => (
                    <span key={company} className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300 cursor-pointer">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Course Preview */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Enhanced Glow Effect */}
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              
              {/* Floating action indicators */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Live Course
                </div>
              </div>

              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 dark:border-slate-700/60 p-6 sm:p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                        <Brain className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        AI Course Generator
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">React Development</span>
                        <Award className="w-4 h-4 text-yellow-500 animate-bounce" />
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-bold">
                          PRO
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Course stats */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800 dark:text-slate-200">12h 30m</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Duration</div>
                  </div>
                </div>

                {/* Enhanced Overall Progress */}
                <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-blue-950/40 rounded-2xl border border-purple-100 dark:border-purple-800/40 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-t-2xl" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        Overall Progress
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        68%
                      </span>
                      <div className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-bold">
                        +11% this week
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full rounded-full shadow-lg transition-all duration-2000 ease-out relative overflow-hidden"
                      style={{ width: "68%" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mt-2">
                    <span>8/12 modules completed</span>
                    <span>~4h remaining</span>
                  </div>
                </div>

                {/* Enhanced Course Modules */}
                <div className="space-y-3 mb-6">
                  {[
                    {
                      title: "Introduction to React",
                      progress: 100,
                      status: "completed",
                      icon: CheckCircle,
                      color: "text-emerald-500",
                      time: "45min",
                      difficulty: "Beginner",
                    },
                    {
                      title: "Components & Props",
                      progress: 85,
                      status: "active",
                      icon: Zap,
                      color: "text-blue-500",
                      time: "1h 20min",
                      difficulty: "Intermediate",
                    },
                    {
                      title: "State Management",
                      progress: 45,
                      status: "in-progress",
                      icon: Target,
                      color: "text-orange-500",
                      time: "2h 15min",
                      difficulty: "Advanced",
                    },
                    {
                      title: "Advanced Hooks",
                      progress: 0,
                      status: "upcoming",
                      icon: BookOpen,
                      color: "text-slate-400",
                      time: "1h 45min",
                      difficulty: "Expert",
                    },
                  ].map((module, index) => {
                    const Icon = module.icon;
                    const isActive = currentModule === index + 1;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl transition-all duration-500 cursor-pointer group relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 border-2 border-purple-200 dark:border-purple-700 shadow-lg scale-105"
                            : "bg-slate-50/80 dark:bg-slate-800/50 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-102"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse" />
                        )}
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/80 dark:bg-slate-800/80' : 'bg-white dark:bg-slate-700'} shadow-sm group-hover:shadow-md transition-shadow`}>
                                <Icon className={`w-5 h-5 ${module.color} ${isActive ? 'animate-pulse' : ''}`} />
                              </div>
                              <div>
                                <span className={`font-bold text-sm ${isActive ? "text-purple-700 dark:text-purple-300" : "text-slate-800 dark:text-slate-200"}`}>
                                  {module.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{module.time}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    module.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                                    module.difficulty === 'Intermediate' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                                    module.difficulty === 'Advanced' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                  }`}>
                                    {module.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                {module.progress}%
                              </span>
                              {module.status === "active" && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-emerald-500 animate-pulse" />
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                </div>
                              )}
                              {module.status === "completed" && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                                module.progress === 100
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                  : module.progress > 0
                                  ? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                                  : "bg-slate-300 dark:bg-slate-600"
                              }`}
                              style={{ width: `${module.progress}%` }}
                            >
                              {module.progress > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/60 to-white/30 -translate-x-full animate-shimmer" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Enhanced Continue Button */}
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Continue Learning
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">24</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">12</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">98%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}
