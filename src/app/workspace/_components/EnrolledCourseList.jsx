'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import EnrolledCourseCard from './EnrolledCourseCard'
import EnrolledCourseListLoading from './EnrolledCourseListLoading'

const EnrolledCourseList = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getEnrolledCourses()
    }, [])

    const getEnrolledCourses = async () => {
        try {
            setLoading(true)
            const result = await axios.get('/api/enroll-course')
            console.log("Enrolled courses data:", result.data.data)
            if (result.data?.success && result.data) {
                setEnrolledCourses(result.data.data)
            } else {
                setError('No courses found')
            }
        } catch (error) {
            console.error('Error fetching enrolled courses:', error)
            setError('Failed to load courses')
        } finally {
            // Add a slight delay to ensure smooth transition
            setTimeout(() => {
                setLoading(false)
            }, 800)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-2xl font-bold mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                My Enrolled Courses
            </motion.h1>
            
            {loading ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {[...Array(3)].map((_, index) => (
                        <motion.div
                            key={`skeleton-${index}`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.3, delay: index * 0.05 }
                                }
                            }}
                        >
                            <EnrolledCourseListLoading />
                        </motion.div>
                    ))}
                </motion.div>
            ) : error ? (
                <motion.div 
                    className="text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-red-500">{error}</p>
                    <button 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={getEnrolledCourses}
                    >
                        Try Again
                    </button>
                </motion.div>
            ) : enrolledCourses.length === 0 ? (
                <motion.div 
                    className="text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {enrolledCourses.map((courseData, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.3, delay: index * 0.05 }
                                }
                            }}
                        >
                            <EnrolledCourseCard 
                                course={courseData.courses}
                                progress={courseData.enrollCourses.progress}
                                completedChapters={courseData.enrollCourses.completedChapters}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

export default EnrolledCourseList