# Course Progress API Documentation

## Overview
This API handles course enrollment progress tracking, chapter completion, and automatic certificate generation when courses are completed.

## Database Schema
The `enrollCourses` table includes the following fields:
- `id`: Primary key (auto-generated)
- `cid`: Course ID (references courses table)
- `userEmail`: User's email (references users table)
- `status`: Enrollment status (default: 'true')
- `completedChapters`: JSON array of completed chapter indices
- `progress`: Progress percentage as string (0-100)
- `isCompleted`: Boolean indicating if course is completed
- `certificate`: URL of the generated certificate

## API Endpoints

### PUT /api/enroll-course
Marks a chapter as completed and updates progress.

**Request Body:**
```json
{
  "courseId": "string",
  "chapterIndex": "number",
  "totalChapters": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter completed successfully!",
  "data": {
    "enrollment": {
      "id": 1,
      "cid": "course-123",
      "userEmail": "user@example.com",
      "status": "true",
      "completedChapters": [0, 1, 2],
      "progress": "75",
      "isCompleted": false,
      "certificate": null
    },
    "progress": 75,
    "isCompleted": false,
    "completedChapters": [0, 1, 2],
    "certificateUrl": null
  }
}
```

**Features:**
- Automatically calculates progress percentage
- Prevents duplicate chapter completions
- Generates certificate when progress reaches 100%
- Uploads certificate to Cloudinary
- Marks course as completed when all chapters are done

### GET /api/enroll-course
Retrieves enrollment data for courses.

**Query Parameters:**
- `cid` (optional): Specific course ID

**Response for specific course:**
```json
{
  "success": true,
  "data": {
    "courseId": "course-123",
    "courseName": "Course Title",
    "courseDescription": "Course description",
    "noOfModules": 10,
    "enrollmentId": 1,
    "completedChapters": [0, 1, 2],
    "progress": "30",
    "isCompleted": false,
    "certificate": null
  }
}
```

## Frontend Integration

### Using the Course Progress Utilities

```javascript
import { 
  completeChapter, 
  getCourseEnrollment, 
  isChapterCompleted,
  calculateProgress,
  downloadCertificate 
} from '@/lib/course-progress';

// Complete a chapter
const handleCompleteChapter = async (chapterIndex) => {
  try {
    const response = await completeChapter(courseId, chapterIndex, totalChapters);
    console.log('Chapter completed:', response.message);
    
    if (response.data.isCompleted) {
      alert('Congratulations! Course completed!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Check if chapter is completed
const isCompleted = isChapterCompleted(completedChapters, chapterIndex);

// Calculate progress
const progress = calculateProgress(completedChapters, totalChapters);

// Download certificate
if (certificateUrl) {
  downloadCertificate(certificateUrl, courseName);
}
```

### Example React Component Usage

```jsx
import CourseProgressExample from '@/components/CourseProgressExample';

function CoursePage({ courseId }) {
  return (
    <div>
      <CourseProgressExample courseId={courseId} />
    </div>
  );
}
```

## Certificate Generation

The system automatically generates a professional certificate when a course is completed:

**Features:**
- Custom design with course name and user name
- Completion date
- Unique certificate ID
- Automatic upload to Cloudinary
- Professional styling with borders and gradients

**Certificate includes:**
- "Certificate of Completion" title
- User's full name
- Course name
- Completion date
- Certificate ID for verification
- AI Learning Platform branding

## Environment Variables

Add these to your `.env.local` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Error Handling

The API handles various error scenarios:
- User not authenticated
- Course not found
- User not enrolled in course
- Invalid request data
- Certificate generation failures (non-blocking)

## Progress Calculation

Progress is calculated as:
```
progress = (completedChapters.length / totalChapters) * 100
```

The course is marked as completed when progress reaches 100%.

## Security

- User authentication required for all operations
- Users can only access their own enrollment data
- Course enrollment verified before allowing progress updates
- Certificate generation is server-side only

## Testing the API

### Complete a Chapter
```bash
curl -X PUT http://localhost:3000/api/enroll-course \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "your-course-id",
    "chapterIndex": 0,
    "totalChapters": 10
  }'
```

### Get Course Progress
```bash
curl "http://localhost:3000/api/enroll-course?cid=your-course-id"
```

### Get All Enrolled Courses
```bash
curl "http://localhost:3000/api/enroll-course"
```

## Notes

- Chapter indices are 0-based
- Progress is stored as a string percentage (e.g., "75")
- Completed chapters array prevents duplicate completions
- Certificate generation is asynchronous and non-blocking
- The API is compatible with the existing course structure
