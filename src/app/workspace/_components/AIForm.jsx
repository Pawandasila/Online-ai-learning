import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Sparkles, BookOpen, Layers, Video, Tag, Award, X, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIForm = ({ handleInputChange, formData = {}, handleSubmit , loading }) => {
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // Predefined category suggestions
  const categorySuggestions = [
    "Programming",
    "Web Development",
    "Data Science",
    "AI",
    "Machine Learning",
    "Mobile Development",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "Game Development",
    "UI/UX Design",
    "Blockchain",
  ];

  const addCategory = (category) => {
    const currentCategories = formData.categories
      ? formData.categories.split(",").map((cat) => cat.trim())
      : [];

    // Only add if not already present
    if (!currentCategories.includes(category)) {
      const newCategories = [...currentCategories, category]
        .filter(Boolean)
        .join(", ");

      handleInputChange({
        target: { name: "categories", value: newCategories },
      });
    }

    setShowCategorySuggestions(false);
  };

  return (
    <div className=" dark:bg-slate-900 rounded-lg ">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label
            htmlFor="courseName"
            className="text-sm font-medium flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
            Course Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="courseName"
            name="courseName"
            value={formData.courseName || ""}
            onChange={handleInputChange}
            placeholder="Enter course name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="courseDescription"
            className="text-sm font-medium flex items-center"
          >
            <Tag className="h-4 w-4 mr-2 text-indigo-500" />
            Course Description{" "}
            <span className="text-gray-500 text-sm">(optional)</span>
          </Label>
          <Textarea
            id="courseDescription"
            name="courseDescription"
            value={formData.courseDescription || ""}
            onChange={handleInputChange}
            placeholder="Enter a detailed description of your course"
            className="w-full h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="moduleCount"
              className="text-sm font-medium flex items-center"
            >
              <Layers className="h-4 w-4 mr-2 text-indigo-500" />
              Number of Modules <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="moduleCount"
              name="moduleCount"
              type="number"
              min={1}
              value={formData.moduleCount || ""}
              onChange={handleInputChange}
              placeholder="e.g (4)"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="difficultyLevel"
              className="text-sm font-medium flex items-center"
            >
              <Award className="h-4 w-4 mr-2 text-indigo-500" />
              Difficulty Level
            </Label>
            <Select
              value={formData.difficultyLevel || ""}
              onValueChange={(value) => {
                handleInputChange({
                  target: { name: "difficultyLevel", value },
                });
              }}
            >
              <SelectTrigger id="difficultyLevel" className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="categories"
            className="text-sm font-medium flex items-center"
          >
            <Tag className="h-4 w-4 mr-2 text-indigo-500" />
            Categories
          </Label>

          <div className="relative">
            <Input
              id="categories"
              name="categories"
              value={formData.categories || ""}
              onChange={handleInputChange}
              onFocus={() => setShowCategorySuggestions(true)}
              placeholder="Programming, AI, Web Development (separated by commas)"
              className="w-full"
            />

            {/* Category suggestions */}
            {showCategorySuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Suggested Categories
                  </span>
                  <button
                    onClick={() => setShowCategorySuggestions(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map((category) => (
                    <button
                      key={category}
                      onClick={() => addCategory(category)}
                      className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-100 text-xs rounded-full px-3 py-1 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Display selected categories as badges */}
          {formData.categories && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.split(",").map((category, index) => {
                const trimmedCategory = category.trim();
                if (!trimmedCategory) return null;

                return (
                  <div
                    key={index}
                    className="bg-indigo-500 text-white text-xs rounded-full px-3 py-1 flex items-center"
                  >
                    {trimmedCategory}
                    <button
                      onClick={() => {
                        const newCategories = formData.categories
                          .split(",")
                          .map((cat) => cat.trim())
                          .filter((cat) => cat !== trimmedCategory)
                          .join(", ");

                        handleInputChange({
                          target: { name: "categories", value: newCategories },
                        });
                      }}
                      className="ml-1 hover:text-indigo-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-800 p-4 rounded-md">
          <Switch
            id="includeVideo"
            name="includeVideo"
            checked={formData.includeVideo || false}
            onCheckedChange={(checked) => {
              handleInputChange({
                target: { name: "includeVideo", value: checked },
              });
            }}
          />
          <div className="flex flex-col">
            <Label
              htmlFor="includeVideo"
              className="text-sm font-medium flex items-center cursor-pointer"
            >
              <Video className="h-4 w-4 mr-2 text-indigo-500" />
              Include Video Lessons
            </Label>
            <p className="text-xs text-gray-500">
              Generate video script outlines for each module
            </p>
          </div>
        </div>

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2"
          onClick={() => handleSubmit()}
        >
          { loading ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Generate Course
        </Button>
      </div>
    </div>
  );
};

export default AIForm;
