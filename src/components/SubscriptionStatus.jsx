"use client";

import React from 'react';
import { useSubscription } from '@/context/subscription.context';
import { Crown, Star, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SubscriptionStatus() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const getSubscriptionIcon = (plan) => {
    switch (plan) {
      case 'starter':
        return <Crown className="w-5 h-5 text-green-500" />;
      case 'pro':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'enterprise':
        return <Building2 className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getSubscriptionColor = (plan) => {
    switch (plan) {
      case 'starter':
        return 'border-green-200 bg-green-50';
      case 'pro':
        return 'border-blue-200 bg-blue-50';
      case 'enterprise':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">No Active Plan</h3>
            <p className="text-sm text-gray-600">Unlock premium features</p>
          </div>
          <Link href="/pricing">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              Choose Plan
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${getSubscriptionColor(subscription)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getSubscriptionIcon(subscription)}
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900 capitalize">
              {subscription} Plan
            </h3>
            <p className="text-sm text-gray-600">
              {subscription === 'starter' && 'Perfect for beginners'}
              {subscription === 'pro' && 'Advanced features unlocked'}
              {subscription === 'enterprise' && 'Full platform access'}
            </p>
          </div>
        </div>
        <Link href="/pricing">
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Manage
          </button>
        </Link>
      </div>
    </div>
  );
}
