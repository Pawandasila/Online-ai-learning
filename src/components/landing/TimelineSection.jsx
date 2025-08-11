import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Target,
  Search,
  UserPlus,
  Cpu,
  PlayCircle,
  CheckSquare,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  Lightbulb,
  Rocket,
  Brain
} from "lucide-react";

export function TimelineSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // Mouse tracking for interactive background effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Ensure component is mounted before starting auto-cycle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-cycle through steps for demonstration
  useEffect(() => {
    if (inView && mounted) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % timelineSteps.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [inView, mounted]);

  const timelineSteps = [
    {
      step: "01",
      title: "Choose Your Learning Path",
      description: "Tell us what you want to master and we'll create a personalized learning journey designed specifically for your goals and skill level.",
      icon: Search,
      gradient: "from-purple-600 to-indigo-700",
      iconColor: "text-purple-600",
      iconHoverColor: "text-purple-800",
      bgColor: "bg-purple-50",
      bgHoverColor: "bg-purple-100",
      glowColor: "purple",
      features: ["AI Topic Analysis", "Skill Level Assessment", "Custom Learning Roadmap", "Goal Setting & Tracking"],
      stats: { time: "2 min", accuracy: "99%" },
      demo: "Topic analysis in progress..."
    },
    {
      step: "02", 
      title: "AI Generates Your Course",
      description: "Our cutting-edge AI creates comprehensive course content with interactive lessons, real-world projects, and personalized exercises tailored to your learning style.",
      icon: Brain,
      gradient: "from-blue-600 to-cyan-700",
      iconColor: "text-blue-600",
      iconHoverColor: "text-blue-800",
      bgColor: "bg-blue-50",
      bgHoverColor: "bg-blue-100",
      glowColor: "blue",
      features: ["Smart Content Generation", "Video & Audio Creation", "Interactive Simulations", "Adaptive Difficulty"],
      stats: { time: "30 sec", quality: "Expert-level" },
      demo: "Generating course modules..."
    },
    {
      step: "03",
      title: "Interactive Learning Experience",
      description: "Engage with immersive lessons featuring multimedia content, hands-on labs, real-time feedback, and collaborative learning opportunities.",
      icon: Rocket,
      gradient: "from-emerald-600 to-teal-700",
      iconColor: "text-emerald-600",
      iconHoverColor: "text-emerald-800",
      bgColor: "bg-emerald-50",
      bgHoverColor: "bg-emerald-100",
      glowColor: "emerald",
      features: ["Interactive Simulations", "Real-time Code Editor", "Peer Collaboration", "AI-Powered Hints"],
      stats: { engagement: "94%", completion: "87%" },
      demo: "Active learning session..."
    },
    {
      step: "04",
      title: "Master & Get Certified",
      description: "Complete advanced projects, take industry-standard assessments, and earn recognized certifications that showcase your expertise to employers.",
      icon: Award,
      gradient: "from-amber-600 to-orange-700",
      iconColor: "text-amber-600",
      iconHoverColor: "text-amber-800",
      bgColor: "bg-amber-50",
      bgHoverColor: "bg-amber-100",
      glowColor: "amber",
      features: ["Industry Certifications", "Portfolio Projects", "Skill Validation", "Career Guidance"],
      stats: { certified: "50k+", hired: "78%" },
      demo: "Certification ready!"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-32 bg-gradient-to-br from-slate-50 via-white to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 relative overflow-hidden" 
      id='how-it-works'
    >
      {/* Enhanced Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"></div>
      
      {/* Interactive Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: mousePosition.x * 50,
            y: mousePosition.y * 30,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            top: `${20 + mousePosition.y * 10}%`,
            right: `${20 + mousePosition.x * 10}%`,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 dark:from-emerald-800/30 dark:to-teal-800/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
            x: -mousePosition.x * 40,
            y: -mousePosition.y * 25,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          style={{
            bottom: `${25 + mousePosition.y * 8}%`,
            left: `${15 + mousePosition.x * 8}%`,
          }}
        />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-1/4 animate-float" style={{ animationDelay: '0s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="absolute bottom-32 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-purple-700 dark:text-purple-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>Our Revolutionary Process</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                AI Learning
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-lg opacity-70 rounded-lg animate-pulse" />
            </span>
            <br />
            <span className="text-slate-700 dark:text-slate-300">Transforms Lives</span>
          </motion.h2>
          
          <motion.div 
            className="max-w-3xl mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience the future of education with our AI-powered platform that adapts to your unique learning style,
              <span className="font-semibold text-purple-600 dark:text-purple-400"> delivering personalized knowledge at unprecedented scale</span>.
            </p>
            
            {/* Stats preview */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">2M+</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Courses Generated</div>
              </div>
              <div className="w-px h-12 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Success Rate</div>
              </div>
              <div className="w-px h-12 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">30s</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg. Generation</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Vertical Timeline */}
        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* Vertical Connection Line */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-blue-300 to-emerald-300 dark:from-purple-600 dark:via-blue-600 dark:to-emerald-600 transform -translate-x-1/2 rounded-full"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={inView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 2, delay: 0.8 }}
          >
            {/* Active progress indicator */}
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 rounded-full shadow-lg"
              animate={{ 
                height: `${((activeStep + 1) / timelineSteps.length) * 100}%` 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </motion.div>
          
          {/* Timeline Steps */}
          <div className="relative space-y-24">
            {timelineSteps.map((step, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} w-full`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6 + (index * 0.2),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {/* Timeline Node */}
                  <motion.div 
                    className={`absolute left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br ${step.gradient} text-white rounded-full flex items-center justify-center font-black text-2xl shadow-2xl z-30 border-4 border-white dark:border-slate-900`}
                    animate={{
                      scale: activeStep === index ? [1, 1.1, 1] : 1,
                      boxShadow: activeStep === index ? [
                        `0 20px 40px rgba(147, 51, 234, 0.3)`,
                        `0 25px 50px rgba(147, 51, 234, 0.4)`,
                        `0 20px 40px rgba(147, 51, 234, 0.3)`
                      ] : "0 15px 35px rgba(0, 0, 0, 0.15)"
                    }}
                    transition={{ 
                      duration: activeStep === index ? 2 : 0.3, 
                      repeat: activeStep === index ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {step.step}
                    {activeStep === index && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    className={`relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 max-w-md w-full transition-all duration-500 ${
                      activeStep === index 
                        ? `border-${step.glowColor}-300 dark:border-${step.glowColor}-600 shadow-${step.glowColor}-500/20` 
                        : `border-slate-200 dark:border-slate-700 shadow-lg`
                    } ${isLeft ? 'mr-12' : 'ml-12'}`}
                    animate={{
                      y: activeStep === index ? -4 : 0,
                      scale: activeStep === index ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Glow effect for active step */}
                    {activeStep === index && (
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-br from-${step.glowColor}-50/80 to-${step.glowColor}-100/80 dark:from-${step.glowColor}-950/40 dark:to-${step.glowColor}-900/40 rounded-3xl`}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    {/* Live indicator for active step */}
                    {activeStep === index && (
                      <motion.div 
                        className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold z-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        ACTIVE
                      </motion.div>
                    )}

                    {/* Arrow pointing to timeline */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 ${
                      isLeft ? '-right-3' : '-left-3'
                    } w-6 h-6 bg-white dark:bg-slate-800 border-2 ${
                      activeStep === index 
                        ? `border-${step.glowColor}-300 dark:border-${step.glowColor}-600` 
                        : 'border-slate-200 dark:border-slate-700'
                    } rotate-45 transition-colors duration-300`} />
                    
                    {/* Icon Container */}
                    <motion.div 
                      className={`w-20 h-20 ${step.bgColor} dark:${step.bgColor.replace('bg-', 'dark:bg-').replace('-50', '-900/30')} rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 z-10`}
                      animate={activeStep === index ? { 
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <step.icon className={`w-10 h-10 ${step.iconColor} transition-colors duration-300`} />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      <motion.h3 
                        className={`text-2xl font-black leading-tight transition-colors duration-300 ${
                          activeStep === index 
                            ? `text-${step.glowColor}-700 dark:text-${step.glowColor}-300` 
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {step.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium"
                      >
                        {step.description}
                      </motion.p>

                      {/* Stats display */}
                      <div className="flex items-center gap-4 pt-2">
                        {step.stats && Object.entries(step.stats).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${step.iconColor.replace('text-', 'bg-')} rounded-full`} />
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              {key}: {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Demo text for active step */}
                      {activeStep === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{step.demo}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="text-center mt-32"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.div 
            className="inline-flex flex-col items-center space-y-6 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-slate-800/90 dark:to-purple-950/90 backdrop-blur-xl rounded-3xl px-12 py-10 border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 60px rgba(147, 51, 234, 0.15)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon showcase */}
            <div className="flex items-center justify-center -space-x-3 mb-2">
              {timelineSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg z-${i + 10}`}
                  whileHover={{ 
                    scale: 1.2, 
                    zIndex: 50,
                    rotate: 5,
                  }}
                  transition={{ duration: 0.2 }}
                  animate={{
                    y: Math.sin(Date.now() * 0.002 + i) * 2,
                  }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ready to Transform Your Learning?</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">
                Join over <span className="font-bold text-purple-600">2 million learners</span> who have already revolutionized their education with AI
              </p>
              
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Start Learning Now
                  </span>
                </motion.button>
                
                <motion.button
                  className="group px-8 py-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-600 text-purple-600 dark:text-purple-400 rounded-2xl font-bold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    See Demo
                  </span>
                </motion.button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">2M+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">98% Success</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        
      </div>
      
      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(3deg); }
          66% { transform: translateY(-5px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}