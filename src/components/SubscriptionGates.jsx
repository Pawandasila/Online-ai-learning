"use client";

import React from 'react';
import { Protect } from '@clerk/nextjs';
import { Crown, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

// Component to gate features based on subscription
export function SubscriptionGate({ 
  requiredPlan, 
  children, 
  fallback,
  feature 
}) {
  const getFallbackComponent = () => {
    if (fallback) return fallback;
    
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <Crown className="w-12 h-12 text-blue-500 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {requiredPlan === 'pro' && 'Pro Feature'}
          {requiredPlan === 'enterprise' && 'Enterprise Feature'}
          {requiredPlan === 'starter' && 'Premium Feature'}
        </h3>
        <p className="text-gray-600 mb-4">
          {feature 
            ? `${feature} is available for ${requiredPlan} subscribers.`
            : `This feature requires a ${requiredPlan} subscription.`
          }
        </p>
        <Link href="/pricing">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Upgrade Now
          </button>
        </Link>
      </div>
    );
  };
  // For free users, we check if they need starter or higher
  if (requiredPlan === 'starter' || requiredPlan === 'pro' || requiredPlan === 'enterprise') {
    return (
      <Protect
        has={({ slug }) => slug === requiredPlan || 
                          (requiredPlan === 'starter' && (slug === 'pro_plan' || slug === 'enterprise_plan')) ||
                          (requiredPlan === 'pro' && slug === 'enterprise_plan')}
        fallback={getFallbackComponent()}
      >
        {children}
      </Protect>
    );
  }

  // If no special plan required, show content (for free features)
  return children;
}

// Course creation limit gate
export function CourseCreationGate({ children, currentCount = 0 }) {
  return (
    <Protect
      has={({ slug }) => slug === 'starter' || slug === 'pro_plan' || slug === 'enterprise_plan'}
      fallback={
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Course Creation
          </h3>
          <p className="text-gray-600 mb-4">
            Create unlimited AI-powered courses with any subscription plan.
          </p>
          <Link href="/pricing">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Choose a Plan
            </button>
          </Link>
        </div>
      }
    >
      {children}
    </Protect>
  );
}

// Premium certificate gate
export function PremiumCertificateGate({ children }) {
  return (
    <SubscriptionGate
      requiredPlan="pro"
      feature="Premium certificates with custom branding"
      fallback={
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-yellow-800 mb-2">
            Premium certificate templates available with Pro plan
          </p>
          <Link href="/pricing">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded text-sm">
              Upgrade to Pro
            </button>
          </Link>
        </div>
      }
    >
      {children}
    </SubscriptionGate>
  );
}

// Analytics gate
export function AdvancedAnalyticsGate({ children }) {
  return (
    <SubscriptionGate
      requiredPlan="pro"
      feature="Advanced learning analytics and insights"
    >
      {children}
    </SubscriptionGate>
  );
}

// API access gate
export function APIAccessGate({ children }) {
  return (
    <SubscriptionGate
      requiredPlan="enterprise"
      feature="API access and custom integrations"
    >
      {children}
    </SubscriptionGate>
  );
}

// Team management gate
export function TeamManagementGate({ children }) {
  return (
    <SubscriptionGate
      requiredPlan="enterprise"
      feature="Team management and user administration"
    >
      {children}
    </SubscriptionGate>
  );
}
