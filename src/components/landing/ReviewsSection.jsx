"use client";
import { Star } from "lucide-react";

export function ReviewsSection() {
  const reviews = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp",
      rating: 5,
      content: "SkillSprint's AI-generated React course was incredible! I went from zero to landing my dream job in just 3 months.",
      avatar: "SC",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      name: "Marcus Rodriguez",
      role: "Data Scientist", 
      company: "DataFlow Inc",
      rating: 5,
      content: "The Python for Data Science course was phenomenal. The AI perfectly structured complex topics into digestible modules.",
      avatar: "MR",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      name: "Emily Watson",
      role: "UX Designer",
      company: "Design Studios", 
      rating: 5,
      content: "Amazing platform! The design thinking course helped me transition from graphic design to UX successfully.",
      avatar: "EW",
      gradient: "from-rose-500 to-rose-600"
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      company: "CloudTech",
      rating: 5,
      content: "The AWS and Kubernetes courses were spot-on. SkillSprint's AI knew exactly what I needed for my certification.",
      avatar: "DK",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      company: "StartupXYZ",
      rating: 5,
      content: "Transitioned from marketing to product management using SkillSprint. The courses are incredibly practical.",
      avatar: "LT",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      name: "Ahmed Hassan",
      role: "Mobile Developer",
      company: "AppDev Solutions",
      rating: 5,
      content: "The React Native course was exactly what I needed. From beginner to publishing my first app in just 2 months.",
      avatar: "AH",
      gradient: "from-blue-500 to-rose-500"
    }
  ];

  // Duplicate reviews for infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Student Reviews</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            What Our <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-rose-600 bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful learners who have transformed their careers with SkillSprint.
          </p>
        </div>

        {/* Infinite Scroll Reviews */}
        <div className="relative">
          <div className="flex animate-scroll space-x-6">
            {duplicatedReviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-80 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${review.gradient} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">{review.role} at {review.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  "{review.content}"
                </p>
              </div>
            ))}
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
