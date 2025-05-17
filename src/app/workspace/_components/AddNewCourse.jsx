import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AIForm from "./AIForm";
import { BookOpen } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const AddNewCourse = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const {user} = useUser();

  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    moduleCount: "",
    difficultyLevel: "",
    categories: "",
    includeVideo: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async()=>{
    setLoading(true);
    console.log(formData);

    try {
      const result = await axios.post("/api/generateCourse", {
        ...formData,
        userId : user.userId,
      });
      console.log(result)
      
    } catch (error) {
      console.error(error);
    }
    setLoading(false);

  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-2xl font-bold text-center">
                Course Generator
              </h2>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <AIForm handleInputChange={handleInputChange} formData={formData} handleSubmit={handleSubmit} loading={loading} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCourse;
