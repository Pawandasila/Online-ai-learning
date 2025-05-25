'use client'
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseInfo from "./_components/CourseInfo";

export default function EditPage({viewCourse = false}) {
  const { cid } = useParams();
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [error, setError] = useState(null);

  const getCourseInfo = async () => {
    try {
      const result = await axios.get("/api/courses?cid=" + cid);
      console.log(result.data)
      setCourseInfo(result.data);
    } catch (error) {
      setError("Error fetching course info");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getCourseInfo();
      } catch (error) {
        console.error("Error fetching course info:", error);
        setError("Error fetching course info");
      }
      setLoading(false);
    };

    fetchData();
  }, [cid]);

  return <div>
    <CourseInfo course = {courseInfo} loading={loading} error={error} viewCourse={viewCourse} />
  </div>;
}
