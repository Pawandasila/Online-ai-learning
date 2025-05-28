"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Brain, 
  Zap,
  Target,
  Trophy,
  Star,
  UserPlus,
  Rocket,
  LayoutDashboard
} from "lucide-react";

export function Navigation() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SkillSprint
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Features</span>
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>How it Works</span>
            </Link>
            <Link href="#pricing" className="text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>Pricing</span>
            </Link>
            <Link href="#reviews" className="text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              // Loading state - prevents hydration mismatch
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ) : isSignedIn ? (
              // Authenticated user UI
              <div className="flex items-center space-x-3">
                <Link href="/workspace" className="hidden sm:flex">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            ) : (
              // Unauthenticated user UI
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <Rocket className="w-4 h-4 mr-1" />
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
