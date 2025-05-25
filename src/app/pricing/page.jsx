"use client";

import React, { useEffect, useState } from "react";
import { PricingTable } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, Crown, Users, Gift } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const PricingPage = () => {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState('free');
  useEffect(() => {
    const detectUserPlan = async () => {
      if (!user) return;

      try {
        // Debug: Check all possible plan combinations
        const planChecks = {
          starter: user.has?.({ slug: "starter" }),
          starter_plan: user.has?.({ slug: "starter_plan" }),
          pro: user.has?.({ slug: "pro" }),
          pro_plan: user.has?.({ slug: "pro_plan" }),
          enterprise: user.has?.({ slug: "enterprise" }),
          enterprise_plan: user.has?.({ slug: "enterprise_plan" }),
          free: user.has?.({ slug: "free" }),
          free_plan: user.has?.({ slug: "free_plan" })
        };

        console.log('Plan checks:', planChecks);
        console.log('User object:', user);

        // Check plans in order from highest to lowest using multiple possible slug formats
        if (user.has?.({ slug: "enterprise_plan" }) || user.has?.({ slug: "enterprise" })) {
          setCurrentPlan('enterprise');
        } else if (user.has?.({ slug: "pro_plan" }) || user.has?.({ slug: "pro" })) {
          setCurrentPlan('pro');
        } else if (user.has?.({ slug: "starter" }) || user.has?.({ slug: "starter_plan" })) {
          setCurrentPlan('starter');
        } else {
          setCurrentPlan('free');
        }

        // Also call our debug API to get server-side info
        try {
          const debugResponse = await fetch('/api/debug-subscription');
          const debugData = await debugResponse.json();
          console.log('Server-side debug data:', debugData);
        } catch (debugError) {
          console.log('Debug API error:', debugError);
        }

      } catch (error) {
        console.error('Error detecting user plan:', error);
        setCurrentPlan('free');
      }
    };

    detectUserPlan();
  }, [user]);

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'free': return <Gift className="w-5 h-5" />;
      case 'starter': return <Check className="w-5 h-5" />;
      case 'pro': return <Crown className="w-5 h-5" />;
      case 'enterprise': return <Users className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'starter': return 'text-green-600 bg-green-100';
      case 'pro': return 'text-blue-600 bg-blue-100';
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <motion.div 
        className="text-center py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Choose Your <span className="text-blue-600">Learning</span> Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Unlock the power of AI-driven education with plans designed for every learner. 
          Start your journey today and transform the way you learn.
        </p>
        
        {/* Current Plan Badge */}
        {user && (
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`p-1 rounded-full ${getPlanColor(currentPlan)}`}>
              {getPlanIcon(currentPlan)}
            </div>
            <span>Current Plan: <span className="font-bold capitalize">{currentPlan}</span></span>
          </motion.div>
        )}
        
        {/* Benefits Banner */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center text-green-600 font-medium">
            <Check className="w-5 h-5 mr-2" />
            AI-Powered Course Generation
          </div>
          <div className="flex items-center text-green-600 font-medium">
            <Check className="w-5 h-5 mr-2" />
            Professional Certificates
          </div>
          <div className="flex items-center text-green-600 font-medium">
            <Check className="w-5 h-5 mr-2" />
            Progress Analytics
          </div>
        </div>
      </motion.div>

      {/* Plan Limits Info */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Compare Plan Features
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {/* Free Plan */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-gray-100">
                <Gift className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Free</h3>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$0</div>
                <div className="text-sm text-gray-600">Forever</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  1 Course per month
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Basic certificates
                </li>
              </ul>
            </div>

            {/* Starter Plan */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Starter</h3>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$9.99</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  5 Courses per month
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  720p video quality
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Standard certificates
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="space-y-4 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Popular
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Crown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Pro</h3>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$24.99</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Unlimited courses
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  1080p HD quality
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Premium certificates
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Advanced analytics
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900">Enterprise</h3>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$49.99</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Team management
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Custom branding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Clerk Pricing Table */}
      <motion.div 
        className="max-w-6xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Upgrade Your Learning Experience
          </h2>
          
          {/* Clerk Pricing Table Component */}
          <PricingTable 
            // Replace with your actual plan IDs from Clerk dashboard
            appearance={{
              elements: {
                pricingTable: "rounded-lg",
                pricingCard: "border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow",
                pricingCardButton: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              }
            }}
          />
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I change my plan anytime?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600">
              We offer a 30-day money-back guarantee for all plans. No questions asked.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are the certificates recognized?
            </h3>
            <p className="text-gray-600">
              Our certificates are digitally signed and can be verified. Pro and Enterprise plans offer additional customization options.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
