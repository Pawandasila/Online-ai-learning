"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Rocket,
  Shield,
  Users,
  Crown,
  Star,
  Zap,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Brain,
  Target,
  Heart,
  Gift
} from "lucide-react";

export function CTASection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  // Mouse tracking for interactive effects
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

  // Benefits data
  const benefits = [
    { icon: Shield, text: "No credit card required", color: "text-emerald-400" },
    { icon: Clock, text: "Start in 30 seconds", color: "text-blue-400" },
    { icon: Award, text: "Industry certifications", color: "text-amber-400" },
    { icon: Users, text: "2M+ active learners", color: "text-purple-400" },
    { icon: TrendingUp, text: "98% success rate", color: "text-rose-400" },
    { icon: Globe, text: "Learn anywhere, anytime", color: "text-cyan-400" }
  ];

  // Floating elements data
  const floatingElements = [
    { icon: Brain, delay: 0, color: "text-purple-300" },
    { icon: Target, delay: 1, color: "text-blue-300" },
    { icon: Star, delay: 2, color: "text-amber-300" },
    { icon: Heart, delay: 3, color: "text-rose-300" },
    { icon: Zap, delay: 4, color: "text-cyan-300" }
  ];
  return (
    <section 
      ref={sectionRef}
      className="py-32 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 text-white relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"
          animate={{
            background: [
              "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))",
              "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))",
              "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Interactive orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: mousePosition.x * 100,
            y: mousePosition.y * 50,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            top: `${10 + mousePosition.y * 20}%`,
            right: `${10 + mousePosition.x * 10}%`,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
            x: -mousePosition.x * 80,
            y: -mousePosition.y * 40,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            bottom: `${20 + mousePosition.y * 15}%`,
            left: `${20 + mousePosition.x * 8}%`,
          }}
        />

        {/* Floating decorative elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute w-16 h-16 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center ${
              index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'
            }`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay
            }}
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
              right: index > 2 ? `${10 + (index - 3) * 20}%` : 'auto',
            }}
          >
            <element.icon className={`w-8 h-8 ${element.color}`} />
          </motion.div>
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced Badge */}
          <motion.div 
            className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full text-sm font-bold mb-8 border border-white/30 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span>🚀 Limited Time Offer - Start Free Today!</span>
            <motion.div
              className="w-2 h-2 bg-emerald-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Enhanced Heading */}
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-7xl font-black mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Ready to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                Transform
              </span>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-cyan-400/20 blur-xl rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
            <br />
            Your Future?
            <motion.div
              className="inline-block ml-4"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              🎯
            </motion.div>
          </motion.h2>
          
          {/* Enhanced Description */}
          <motion.div
            className="space-y-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-medium">
              Join over <span className="font-black text-yellow-400">2 million learners</span> who have revolutionized their careers 
              with our AI-powered personalized education platform.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold">Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <span className="font-semibold">100% Free to Start</span>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button 
                  size="lg" 
                  className="group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white px-12 py-6 font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl overflow-hidden border-2 border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-3">
                    <Rocket className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    Start Your Journey FREE
                    <motion.div
                      animate={isHovered ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </SignUpButton>

            <motion.button
              className="group px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ▶️
                </motion.div>
              </div>
              <div className="text-left">
                <div className="font-bold">Watch Demo</div>
                <div className="text-sm text-white/70">See how it works</div>
              </div>
            </motion.button>
          </motion.div>
          
          {/* Enhanced Benefits Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300`}>
                  <benefit.icon className={`w-4 h-4 ${benefit.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span className="text-white/90 font-semibold text-sm group-hover:text-white transition-colors duration-300">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof & Trust Badges */}
          <motion.div
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Star Rating */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: star * 0.1 }}
                  >
                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-yellow-400">4.9/5</div>
                <div className="text-sm text-white/70">From 50K+ reviews</div>
              </div>
            </div>

            {/* User Avatars */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-12 h-12 rounded-full border-3 border-white shadow-lg ${
                      i === 1 ? 'bg-gradient-to-br from-purple-500 to-blue-500' :
                      i === 2 ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                      i === 3 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                      i === 4 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      i === 5 ? 'bg-gradient-to-br from-indigo-500 to-purple-500' :
                      'bg-gradient-to-br from-cyan-500 to-blue-500'
                    }`}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    animate={{
                      y: Math.sin(Date.now() * 0.001 + i) * 3,
                    }}
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-3 border-white flex items-center justify-center text-white font-bold text-sm">
                  +2M
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-white">Join the community</div>
                <div className="text-sm text-white/70">of successful learners</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs font-medium">
              <span>🔒 100% Secure & Private</span>
              <span>⚡ Instant Access</span>
              <span>🎯 Personalized Learning</span>
              <span>🏆 Industry Certified</span>
              <span>💎 Premium Quality</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
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
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}
