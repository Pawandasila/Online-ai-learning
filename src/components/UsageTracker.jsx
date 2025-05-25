"use client";

import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/context/subscription.context';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export function UsageTracker({ refreshTrigger }) {
  const { subscription, loading } = useSubscription();
  const [usage, setUsage] = useState({ coursesCreated: 0, limit: 0 });
  const [loadingUsage, setLoadingUsage] = useState(true);

  const fetchUsage = async () => {
    try {
      setLoadingUsage(true);
      const response = await fetch('/api/user/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoadingUsage(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchUsage();
    }
  }, [loading, subscription, refreshTrigger]);

  if (loading || loadingUsage) {
    return (
      <div className="bg-white rounded-lg border p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-2 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center mb-3">
          <Zap className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-semibold text-gray-900">AI Course Creation</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Start creating AI-powered courses with a subscription
        </p>
        <Link href="/pricing">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Choose a Plan
          </button>
        </Link>
      </div>
    );
  }

  const { coursesCreated, limit } = usage;
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((coursesCreated / limit) * 100, 100);
  const remaining = isUnlimited ? -1 : Math.max(0, limit - coursesCreated);

  const getStatusColor = () => {
    if (isUnlimited) return 'text-green-600';
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (isUnlimited) return 'bg-green-500';
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-semibold text-gray-900">Course Creation</h3>
        </div>
        {!isUnlimited && remaining === 0 && (
          <Link href="/pricing">
            <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Crown className="w-4 h-4 mr-1" />
              Upgrade
            </button>
          </Link>
        )}
      </div>

      {isUnlimited ? (
        <div className="text-center py-2">
          <p className="text-green-600 font-medium">Unlimited Courses</p>
          <p className="text-sm text-gray-600">{coursesCreated} courses created this month</p>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">This month</span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {coursesCreated} / {limit}
              </span>
            </div>
            <Progress 
              value={percentage} 
              className="h-2"
              // You can customize the progress bar color based on usage
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {remaining > 0 ? `${remaining} remaining` : 'Limit reached'}
            </span>
            {remaining === 0 && (
              <span className="text-red-600 font-medium">
                Upgrade to continue
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
