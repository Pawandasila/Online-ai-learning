"use client";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { 
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-rose-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Get Started Today</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Ready to Transform Your Learning?
          </h2>
          
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Join over 50,000 learners who have transformed their careers with AI-powered personalized education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/90 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>50,000+ happy learners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
