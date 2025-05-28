import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
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
  Zap
} from "lucide-react";

export function TimelineSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  // Auto-cycle through steps for demonstration
  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % timelineSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [inView]);

  const timelineSteps = [
    {
      step: "01",
      title: "Choose Your Topic",
      description: "Tell us what you want to learn and we'll create the perfect learning path for you.",
      icon: Search,
      gradient: "from-slate-600 to-slate-800",
      iconColor: "text-slate-700",
      iconHoverColor: "text-slate-900",
      bgColor: "bg-rose-100",
      bgHoverColor: "bg-slate-200",
      features: ["AI Topic Matching", "Skill Assessment", "Custom Learning Path"]
    },
    {
      step: "02", 
      title: "AI Creates Your Course",
      description: "Our advanced AI generates personalized content, videos, and exercises just for you.",
      icon: Cpu,
      gradient: "from-blue-600 to-blue-800",
      iconColor: "text-blue-600",
      iconHoverColor: "text-blue-800",
      bgColor: "bg-blue-50",
      bgHoverColor: "bg-blue-100",
      features: ["Smart Content Generation", "Video Curation", "Interactive Exercises"]
    },
    {
      step: "03",
      title: "Start Learning",
      description: "Dive into interactive lessons with videos, quizzes, and hands-on projects.",
      icon: PlayCircle,
      gradient: "from-emerald-600 to-emerald-800",
      iconColor: "text-emerald-600",
      iconHoverColor: "text-emerald-800",
      bgColor: "bg-emerald-50",
      bgHoverColor: "bg-emerald-100",
      features: ["Interactive Lessons", "Progress Tracking", "Real-time Feedback"]
    },
    {
      step: "04",
      title: "Get Certified",
      description: "Complete your course and earn a certificate to showcase your new skills.",
      icon: Award,
      gradient: "from-amber-600 to-amber-800",
      iconColor: "text-amber-600",
      iconHoverColor: "text-amber-800",
      bgColor: "bg-amber-50",
      bgHoverColor: "bg-amber-100",
      features: ["Industry Certificates", "Skill Validation", "Portfolio Building"]
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id='how-it-works'>
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-20"></div>
      
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-r from-slate-100/60 to-blue-100/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-r from-blue-100/40 to-slate-100/60 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Professional Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-3 bg-white text-slate-700 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-slate-300 shadow-sm"
            whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            <span>Our Process</span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How SkillSprint
            <br />
            <span className="text-slate-700">Transforms Learning</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our enterprise-grade AI platform delivers personalized learning experiences 
            at scale, trusted by leading organizations worldwide.
          </motion.p>
        </motion.div>

        {/* Professional Timeline */}
        <div ref={ref} className="relative">
          {/* Elegant Connection Line */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent transform -translate-y-1/2"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 2, delay: 0.8 }}
          />
          
          {/* Professional Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6 + (index * 0.2),
                  ease: [0.16, 1, 0.3, 1]
                }}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                {/* External Step Number Badge - Positioned outside top-left */}
                <motion.div 
                  className={`absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br ${step.gradient} text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-20 border-4 border-white`}
                  animate={{
                    scale: activeStep === index ? [1, 1.1, 1] : 1,
                    boxShadow: activeStep === index ? [
                      "0 10px 25px rgba(0, 0, 0, 0.15)",
                      "0 15px 35px rgba(0, 0, 0, 0.25)",
                      "0 10px 25px rgba(0, 0, 0, 0.15)"
                    ] : "0 10px 25px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: activeStep === index ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  {step.step}
                </motion.div>

                {/* Enhanced Professional Step Card */}
                <motion.div 
                  className="relative bg-white rounded-3xl p-10 pt-12 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Professional Icon Container with Individual Colors */}
                  <motion.div 
                    className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:${step.bgHoverColor} transition-colors duration-300`}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <step.icon className={`w-8 h-8 ${step.iconColor} group-hover:${step.iconHoverColor} transition-colors duration-300`} />
                  </motion.div>

                  {/* Enhanced Content Section */}
                  <div className="relative z-10">
                    <motion.h3 
                      className="text-2xl font-bold text-slate-900 mb-5 group-hover:text-slate-800 transition-colors duration-300 leading-tight"
                    >
                      {step.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-slate-600 leading-relaxed mb-8 text-lg font-medium"
                    >
                      {step.description}
                    </motion.p>
                  </div>

                  {/* Professional Features List */}
                  <AnimatePresence>
                    {hoveredStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t ${step.bgColor.replace('bg-', 'border-')} pt-6 space-y-3 mt-2`}
                      >
                        {step.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                            className="flex items-center space-x-3 text-slate-600 py-1"
                          >
                            <div className={`w-2 h-2 ${step.iconColor.replace('text-', 'bg-')} rounded-full flex-shrink-0`}></div>
                            <span className="text-sm font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Elegant Arrow Connector */}
                  {index < timelineSteps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
                      animate={{
                        x: activeStep === index ? [0, 4, 0] : 0,
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Mobile Connector */}
                {index < timelineSteps.length - 1 && (
                  <motion.div 
                    className="lg:hidden flex justify-center mt-8 mb-4"
                    animate={{
                      y: activeStep === index ? [0, 3, 0] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Professional CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-4 bg-slate-50 rounded-2xl px-8 py-4 border border-slate-200"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)"
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex -space-x-2">
              {timelineSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  className="w-10 h-10 bg-slate-900 rounded-xl border-2 border-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-slate-900 font-semibold text-lg">Ready to get started?</p>
              <p className="text-slate-600 text-sm">Join thousands of learners worldwide</p>
            </div>
          </motion.div>
        </motion.div>

        
        
      </div>
    </section>
  );
}