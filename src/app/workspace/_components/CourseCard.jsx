'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Clock, Play } from 'lucide-react'

const CourseCard = ({ course }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  }

  // Set color classes based on course.color
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-600',
        progress: 'bg-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600'
      },
      teal: {
        bg: 'bg-teal-600',
        progress: 'bg-teal-500',
        button: 'bg-teal-600 hover:bg-teal-700',
        text: 'text-teal-600'
      },
      purple: {
        bg: 'bg-purple-600',
        progress: 'bg-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-purple-600'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(course.color)
  
  return (
    <motion.div 
      className="overflow-hidden rounded-xl bg-white shadow-md"
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 ${colorClasses.bg} opacity-10`}></div>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0.8 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {course.image && course.image.includes('http') ? (
            <img 
              src={course.image} 
              alt={course.title} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <div className={`w-24 h-24 rounded-xl ${colorClasses.bg} flex items-center justify-center shadow-lg`}>
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <span>By {course.instructor}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Progress</span>
            <span className={`font-medium ${colorClasses.text}`}>{course.progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${colorClasses.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        <motion.button
          className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${colorClasses.button} transition-colors duration-200`}
          variants={buttonVariants}
          whileTap={{ scale: 0.98 }}
        >
          {course.status === 'not-started' ? 'Start Learning' : 'Continue Learning'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CourseCard