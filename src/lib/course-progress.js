// Utility functions for course progress management

/**
 * Complete a chapter and update progress
 * @param {string} courseId - The course ID
 * @param {number} chapterIndex - The index of the completed chapter
 * @param {number} totalChapters - Total number of chapters in the course
 * @returns {Promise<Object>} - API response
 */
export async function completeChapter(courseId, chapterIndex, totalChapters) {
  try {
    const response = await fetch('/api/enroll-course', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId,
        chapterIndex,
        totalChapters,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete chapter');
    }

    return data;
  } catch (error) {
    console.error('Error completing chapter:', error);
    throw error;
  }
}

/**
 * Get enrollment details for a specific course
 * @param {string} courseId - The course ID
 * @returns {Promise<Object>} - Course enrollment data
 */
export async function getCourseEnrollment(courseId) {
  try {
    const response = await fetch(`/api/enroll-course?cid=${courseId}`, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch course enrollment');
    }

    return data;
  } catch (error) {
    console.error('Error fetching course enrollment:', error);
    throw error;
  }
}

/**
 * Get all enrolled courses for the current user
 * @returns {Promise<Object>} - List of enrolled courses
 */
export async function getAllEnrolledCourses() {
  try {
    const response = await fetch('/api/enroll-course', {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch enrolled courses');
    }

    return data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
}

/**
 * Check if a chapter is completed
 * @param {Array} completedChapters - Array of completed chapter indices
 * @param {number} chapterIndex - The chapter index to check
 * @returns {boolean} - Whether the chapter is completed
 */
export function isChapterCompleted(completedChapters, chapterIndex) {
  return Array.isArray(completedChapters) && completedChapters.includes(chapterIndex);
}

/**
 * Calculate progress percentage
 * @param {Array} completedChapters - Array of completed chapter indices
 * @param {number} totalChapters - Total number of chapters
 * @returns {number} - Progress percentage (0-100)
 */
export function calculateProgress(completedChapters, totalChapters) {
  if (!Array.isArray(completedChapters) || totalChapters === 0) {
    return 0;
  }
  return Math.round((completedChapters.length / totalChapters) * 100);
}

/**
 * Download certificate
 * @param {string} certificateUrl - URL of the certificate
 * @param {string} courseName - Name of the course for filename
 */
export function downloadCertificate(certificateUrl, courseName) {
  if (!certificateUrl) {
    throw new Error('Certificate not available');
  }

  const link = document.createElement('a');
  link.href = certificateUrl;
  link.download = `${courseName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
