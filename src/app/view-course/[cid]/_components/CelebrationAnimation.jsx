import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Award, Crown, Zap } from 'lucide-react';

const CelebrationAnimation = ({ isVisible, onComplete, title = "Chapter Completed!" }) => {
  const [particles, setParticles] = useState([]);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate floating particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        type: ['sparkle', 'star', 'zap', 'circle'][Math.floor(Math.random() * 4)],
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#A78BFA', '#F472B6'][Math.floor(Math.random() * 7)],
        size: 8 + Math.random() * 8
      }));

      // Generate confetti pieces
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: -10,
        delay: Math.random() * 0.8,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#A78BFA', '#F472B6', '#34D399'][Math.floor(Math.random() * 8)],
        rotation: Math.random() * 360,
        size: 4 + Math.random() * 8
      }));

      setParticles(newParticles);
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const renderParticle = (particle) => {
    let ParticleComponent;
    switch (particle.type) {
      case 'sparkle':
        ParticleComponent = Sparkles;
        break;
      case 'star':
        ParticleComponent = Star;
        break;
      case 'zap':
        ParticleComponent = Zap;
        break;
      default:
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${particle.size}px ${particle.color}40`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 0.8, 0],
              opacity: [0, 1, 0.8, 0.6, 0],
              y: [0, -100, -200, -300],
              x: [0, Math.sin(particle.id) * 50]
            }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        );
    }

    return (
      <motion.div
        key={particle.id}
        className="absolute"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          filter: `drop-shadow(0 0 ${particle.size}px ${particle.color})`
        }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ 
          scale: [0, 1, 1.1, 0.9, 0],
          opacity: [0, 1, 0.8, 0.6, 0],
          y: [0, -80, -160, -240],
          x: [0, Math.sin(particle.id) * 40],
          rotate: [0, 180, 360, 540]
        }}
        transition={{ 
          duration: particle.duration,
          delay: particle.delay,
          ease: "easeOut"
        }}
      >
        <ParticleComponent 
          size={particle.size} 
          style={{ color: particle.color }}
        />
      </motion.div>
    );
  };

  const renderConfetti = (piece) => (
    <motion.div
      key={piece.id}
      className="absolute"
      style={{
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        width: `${piece.size}px`,
        height: `${piece.size}px`,
        backgroundColor: piece.color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px'
      }}
      initial={{ 
        scale: 0, 
        opacity: 1, 
        rotate: piece.rotation 
      }}
      animate={{ 
        scale: [0, 1, 1],
        y: [0, window.innerHeight + 100],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [piece.rotation, piece.rotation + 360 * 3],
        opacity: [1, 1, 0]
      }}
      transition={{ 
        duration: 3 + Math.random() * 2,
        delay: piece.delay,
        ease: "easeOut"
      }}
    />
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.1), rgba(0, 0, 0, 0.7))'
            }}
          />

          {/* Main celebration card with glassmorphism */}
          <motion.div
            className="relative backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-10 max-w-lg w-full mx-4 text-center shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
            initial={{ scale: 0.2, opacity: 0, y: 100, rotateX: -90 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.2, opacity: 0, y: 100, rotateX: 90 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.23, 1, 0.32, 1],
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3), transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255, 107, 107, 0.3), transparent 50%)',
                  'radial-gradient(circle at 50% 20%, rgba(69, 179, 209, 0.3), transparent 50%)',
                  'radial-gradient(circle at 50% 80%, rgba(167, 139, 250, 0.3), transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3), transparent 50%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating crown with pulse effect */}
            <motion.div
              className="relative z-10 mb-6"
              initial={{ scale: 0, rotate: -180, y: -50 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 150 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  boxShadow: '0 10px 30px rgba(255, 215, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="w-10 h-10 text-white drop-shadow-lg" />
                
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-yellow-300"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Animated title with gradient text */}
            <motion.h2
              className="relative z-10 text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
              {title}
            </motion.h2>

            {/* Subtitle with typewriter effect */}
            <motion.p
              className="relative z-10 text-white/90 text-lg mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              Outstanding achievement! 🎉
            </motion.p>

            {/* Progress indicator with animated badges */}
            <motion.div
              className="relative z-10 flex items-center justify-center space-x-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1 + i * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Award className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </motion.div>

            {/* Continue message */}
            <motion.p
              className="relative z-10 text-white/70 text-sm font-medium mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
            >
              Keep up the amazing work! ✨
            </motion.p>

            {/* Floating decorative elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
                style={{
                  top: `${20 + (i % 3) * 30}%`,
                  left: `${10 + (i % 2) * 80}%`,
                  filter: 'blur(0.5px)'
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Corner sparkles */}
            {[
              { pos: 'top-2 left-2', delay: 0 },
              { pos: 'top-2 right-2', delay: 0.5 },
              { pos: 'bottom-2 left-2', delay: 1 },
              { pos: 'bottom-2 right-2', delay: 1.5 }
            ].map((sparkle, i) => (
              <motion.div
                key={i}
                className={`absolute ${sparkle.pos}`}
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: sparkle.delay
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
              </motion.div>
            ))}

            {/* Particle overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {particles.map(renderParticle)}
            </div>
          </motion.div>

          {/* Confetti overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map(renderConfetti)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default CelebrationAnimation;