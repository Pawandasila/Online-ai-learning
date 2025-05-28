"use client";
import { useState, useEffect } from "react";
import { 
  Zap,
  Brain,
  Video,
  TrendingUp,
  Users,
  GraduationCap,
  Target,
  ArrowRight,
  Sparkles,
  Play,
  Award,
  BookOpen,
  Globe
} from "lucide-react";

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Brain,
      title: "AI Course Generation",
      description: "Automatically generate comprehensive courses on any topic with structured modules, lessons, and adaptive learning paths tailored to your needs.",
      gradient: "from-purple-500 to-purple-700",
      bgGradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30",
      stats: "50K+ courses generated",
      badge: "🧠 Smart AI"
    },
    {
      icon: Video,
      title: "Interactive Video Learning", 
      description: "Curated video content with interactive elements, quizzes, and hands-on exercises for an immersive learning experience.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-800/30",
      stats: "100K+ video lessons",
      badge: "🎥 Engaging"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your learning journey with detailed progress insights, performance metrics, and personalized recommendations.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-800/30",
      stats: "Real-time tracking",
      badge: "📊 Data-Driven"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners worldwide, join study groups, share achievements, and collaborate in interactive learning spaces.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/30",
      stats: "500K+ active learners",
      badge: "🌍 Connected"
    },
    {
      icon: GraduationCap,
      title: "Verified Certificates",
      description: "Earn industry-recognized certificates upon completion to showcase your expertise and advance your career.",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-800/30",
      stats: "Industry recognized",
      badge: "🏆 Certified"
    },
    {
      icon: Target,
      title: "Adaptive Learning Paths",
      description: "Personalized learning experiences that adapt to your pace, learning style, and goals for maximum efficiency.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/30",
      stats: "Personalized for you",
      badge: "🎯 Adaptive"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-700/50 shadow-lg mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Powerful Features
            </span>
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Everything You Need to{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Excel
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-lg opacity-70 rounded-lg" />
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform provides comprehensive learning tools designed to accelerate your journey from beginner to expert in record time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative p-6 lg:p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border transition-all duration-500 cursor-pointer ${
                  isActive || isHovered
                    ? 'border-purple-200 dark:border-purple-700 shadow-2xl shadow-purple-500/20 scale-105'
                    : 'border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl'
                } transform hover:scale-105`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 rounded-3xl transition-opacity duration-500 ${
                  isActive || isHovered ? 'opacity-100' : 'group-hover:opacity-50'
                }`} />
                
                {/* Badge */}
                <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-full px-3 py-1 shadow-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {feature.badge}
                  </span>
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 ${
                    isActive || isHovered ? 'scale-110 rotate-3' : 'group-hover:scale-110'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className={`text-xl lg:text-2xl font-bold transition-all duration-300 ${
                      isActive || isHovered 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                        : 'text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {feature.stats}
                      </span>
                      <ArrowRight className={`w-5 h-5 text-purple-500 transition-all duration-300 ${
                        isActive || isHovered ? 'transform translate-x-1' : 'group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 ${
                  isActive || isHovered ? 'opacity-20' : ''
                }`} style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer transform hover:scale-105">
            <Play className="w-6 h-6" />
            <span className="font-semibold text-lg">Explore All Features</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}