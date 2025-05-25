// Example component showing how to use the course progress API
import React, { useState, useEffect } from 'react';
import { 
  completeChapter, 
  getCourseEnrollment, 
  isChapterCompleted, 
  calculateProgress,
  downloadCertificate 
} from '@/lib/course-progress';
import { CheckCircle, Download, Award } from 'lucide-react';
import { toast } from 'sonner';

const CourseProgressExample = ({ courseId }) => {
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingChapter, setCompletingChapter] = useState(null);

  useEffect(() => {
    loadEnrollmentData();
  }, [courseId]);

  const loadEnrollmentData = async () => {
    try {
      setLoading(true);
      const response = await getCourseEnrollment(courseId);
      setEnrollmentData(response.data);
    } catch (error) {
      console.error('Failed to load enrollment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChapter = async (chapterIndex) => {
    if (!enrollmentData || completingChapter === chapterIndex) return;

    try {
      setCompletingChapter(chapterIndex);
      
      const response = await completeChapter(
        courseId, 
        chapterIndex, 
        enrollmentData.noOfModules
      );

      // Update local state with the response
      setEnrollmentData(prev => ({
        ...prev,
        completedChapters: response.data.completedChapters,
        progress: response.data.progress,
        isCompleted: response.data.isCompleted,
        certificate: response.data.certificateUrl || prev.certificate,
      }));

      // Show success message
      alert(response.message);
      
    } catch (error) {
      console.error('Failed to complete chapter:', error);
      alert('Failed to complete chapter. Please try again.');
    } finally {
      setCompletingChapter(null);
    }
  };

  const handleDownloadCertificate = () => {
    if (enrollmentData?.certificate) {
      downloadCertificate(enrollmentData.certificate, enrollmentData.courseName);
    }
  };

  if (loading) {
    return <div className="p-4">Loading course progress...</div>;
  }

  if (!enrollmentData) {
    return <div className="p-4">Failed to load course data.</div>;
  }

  const progressPercentage = calculateProgress(
    enrollmentData.completedChapters, 
    enrollmentData.noOfModules
  );

  // Mock chapters data (replace with actual course content)
  const chapters = Array.from({ length: enrollmentData.noOfModules }, (_, index) => ({
    id: index,
    title: `Chapter ${index + 1}`,
    description: `Description for chapter ${index + 1}`,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {enrollmentData.courseName}
        </h1>
        
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {enrollmentData.completedChapters?.length || 0} of {enrollmentData.noOfModules} chapters completed
          </p>
        </div>

        {/* Certificate Section */}
        {enrollmentData.isCompleted && enrollmentData.certificate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="text-green-600 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Congratulations! Course Completed
                  </h3>
                  <p className="text-green-600">
                    You have successfully completed this course. Download your certificate!
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadCertificate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={16} />
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.map((chapter) => {
          const isCompleted = isChapterCompleted(enrollmentData.completedChapters, chapter.id);
          const isCurrentlyCompleting = completingChapter === chapter.id;
          
          return (
            <div
              key={chapter.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                isCompleted 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {chapter.description}
                  </p>
                </div>
                
                <div className="ml-4">
                  {isCompleted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={20} />
                      <span className="ml-2 text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteChapter(chapter.id)}
                      disabled={isCurrentlyCompleting}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                        isCurrentlyCompleting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isCurrentlyCompleting ? 'Completing...' : 'Mark Complete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgressExample;
