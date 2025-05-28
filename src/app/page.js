// filepath: f:\ai-learning\src\app\page.js
"use client";
import {
  Navigation,
  HeroSection,
  FeaturesSection,
  TimelineSection,
  PricingSection,
  ReviewsSection,
  CTASection,
  Footer
} from "@/components/landing";

export default function Home() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SkillSprint",
    "description": "AI-powered personalized learning platform that creates custom courses with videos, exercises, and progress tracking.",
    "url": "https://skillsprint.ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://skillsprint.ai/logo.png"
    },
    "sameAs": [
      "https://twitter.com/skillsprint",
      "https://linkedin.com/company/skillsprint",
      "https://github.com/skillsprint"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Starter Plan",
        "price": "0",
        "priceCurrency": "USD",
        "description": "3 AI-generated courses monthly with basic features"
      },
      {
        "@type": "Offer", 
        "name": "Pro Learner Plan",
        "price": "19",
        "priceCurrency": "USD",
        "description": "Unlimited course generation with advanced AI personalization"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50000"
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <TimelineSection />
        <PricingSection />
        <ReviewsSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
