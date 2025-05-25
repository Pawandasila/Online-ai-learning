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
import { BookOpen, AlertCircle, Crown } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CourseCreationGate } from "@/components/SubscriptionGates";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddNewCourse = ({ children, onCourseCreated }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitError, setLimitError] = useState(null);
  const [open, setOpen] = useState(false);
  const {user} = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    moduleCount: "",
    difficultyLevel: "",
    categories: "",
    includeVideo: false,
    userId : ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async()=>{
    setLoading(true);
    setError(null);
    setLimitError(null);
    console.log(formData);
        try {
      const result = await axios.post("/api/generateCourse", {
        ...formData,
        userId: user.emailAddresses[0].emailAddress,
      });      // Call the refresh callback if provided
      if (onCourseCreated) {
        onCourseCreated();
      }
      
      // Reset form and close dialog
      resetForm();
      setOpen(false);
      
      // Show success message
      toast.success("Course created successfully!", {
        description: "Redirecting to course editor..."
      });
      
      router.push("/workspace/edit-course" + `/${result.data.data.cid}`);
      
    } catch (error) {
      console.error(error);
      
      if (error.response?.status === 403 && error.response?.data?.upgradeRequired) {
        // Handle subscription limit error
        setLimitError(error.response.data);
        toast.error("Course creation limit reached", {
          description: error.response.data.details
        });
      } else if (error.response?.status === 401) {
        // Handle authentication error
        setError("Please sign in to create courses");
        toast.error("Authentication required", {
          description: "Please sign in to create courses"
        });
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.details || error.message || "Failed to create course";
        setError(errorMessage);
        toast.error("Course creation failed", {
          description: errorMessage
        });
      }
    }
    setLoading(false);

  }
  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      courseDescription: "",
      moduleCount: "",
      difficultyLevel: "",
      categories: "",
      includeVideo: false,
      userId: ""
    });
    setError(null);
    setLimitError(null);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <CourseCreationGate>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <div>
                {limitError ? (
                  <div className="space-y-4 p-4">
                    <div className="flex items-center space-x-2 text-amber-600">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-semibold">Upgrade Required</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {limitError.details}
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Courses this month:</span>
                          <span className="font-medium">
                            {limitError.limitInfo.current} / {limitError.limitInfo.limit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current plan:</span>
                          <span className="font-medium capitalize">
                            {limitError.limitInfo.planName}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleUpgrade}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setLimitError(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : error ? (
                  <div className="space-y-4 p-4">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-semibold">Error</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600">{error}</p>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setError(null)}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <AIForm 
                    handleInputChange={handleInputChange} 
                    formData={formData} 
                    handleSubmit={handleSubmit} 
                    loading={loading} 
                  />
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </CourseCreationGate>
  );
};

export default AddNewCourse;
