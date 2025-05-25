import { auth } from "@clerk/nextjs/server";

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro_plan',
  ENTERPRISE: 'enterprise_plan'
};

export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: {
    maxCoursesPerMonth: 1,
    videoQuality: '480p',
    supportLevel: 'community',
    certificateType: 'basic',
    analyticsLevel: 'basic',
    canDownloadOffline: false,
    canAccessAPI: false,
    teamManagement: false,
    customBranding: false
  },
  [SUBSCRIPTION_PLANS.STARTER]: {
    maxCoursesPerMonth: 5,
    videoQuality: '720p',
    supportLevel: 'community',
    certificateType: 'basic',
    analyticsLevel: 'basic',
    canDownloadOffline: false,
    canAccessAPI: false,
    teamManagement: false,
    customBranding: false
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    maxCoursesPerMonth: -1, // unlimited
    videoQuality: '1080p',
    supportLevel: 'priority',
    certificateType: 'premium',
    analyticsLevel: 'advanced',
    canDownloadOffline: true,
    canAccessAPI: false,
    teamManagement: false,
    customBranding: false
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    maxCoursesPerMonth: -1, // unlimited
    videoQuality: '4K',
    supportLevel: 'dedicated',
    certificateType: 'custom',
    analyticsLevel: 'enterprise',
    canDownloadOffline: true,
    canAccessAPI: true,
    teamManagement: true,
    customBranding: true
  }
};

/**
 * Get user's current subscription plan
 */
export async function getUserSubscription() {
  try {
    const { userId, has } = await auth();
    
    if (!userId) {
      return null;
    }

    // Debug: Check all possible plan combinations
    const planChecks = {
      starter: await has({ plan: "starter" }),
      starter_plan: await has({ plan: "starter_plan" }),
      pro: await has({ plan: "pro" }),
      pro_plan: await has({ plan: "pro_plan" }),
      enterprise: await has({ plan: "enterprise" }),
      enterprise_plan: await has({ plan: "enterprise_plan" }),
      free: await has({ plan: "free" }),
      free_plan: await has({ plan: "free_plan" })
    };

    if (await has({ plan: "enterprise_plan" }) || await has({ plan: "enterprise" })) {
      console.log('User has enterprise plan');
      return SUBSCRIPTION_PLANS.ENTERPRISE;
    }
    
    if (await has({ plan: "pro_plan" }) || await has({ plan: "pro" })) {
      console.log('User has pro plan');
      return SUBSCRIPTION_PLANS.PRO;
    }
    
    if (await has({ plan: "starter" }) || await has({ plan: "starter_plan" })) {
      console.log('User has starter plan');
      return SUBSCRIPTION_PLANS.STARTER;
    }
    
    console.log('User defaulting to free plan');
    // Default to free plan for authenticated users
    return SUBSCRIPTION_PLANS.FREE;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return SUBSCRIPTION_PLANS.FREE; // Default to free on error
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(feature) {
  const subscription = await getUserSubscription();
  
  if (!subscription) {
    return false;
  }
  
  const planFeatures = PLAN_FEATURES[subscription];
  return planFeatures[feature] || false;
}

/**
 * Get user's plan features
 */
export async function getUserPlanFeatures() {
  const subscription = await getUserSubscription();
  
  if (!subscription) {
    return null;
  }
  
  return PLAN_FEATURES[subscription];
}

/**
 * Check monthly course limit
 */
export async function checkCourseLimit(currentCount) {
  const planFeatures = await getUserPlanFeatures();
  
  if (!planFeatures) {
    return { canCreate: false, limit: 0, remaining: 0 };
  }
  
  const limit = planFeatures.maxCoursesPerMonth;
  
  if (limit === -1) {
    return { canCreate: true, limit: -1, remaining: -1 }; // unlimited
  }
  
  const remaining = Math.max(0, limit - currentCount);
  
  return {
    canCreate: remaining > 0,
    limit,
    remaining
  };
}

/**
 * Get subscription display info
 */
export function getSubscriptionDisplayInfo(planName) {
  const planMap = {
    [SUBSCRIPTION_PLANS.FREE]: {
      name: 'Free',
      badge: 'Free',
      color: 'gray',
      description: 'Get started for free'
    },
    [SUBSCRIPTION_PLANS.STARTER]: {
      name: 'Starter',
      badge: 'Basic',
      color: 'green',
      description: 'Perfect for beginners'
    },
    [SUBSCRIPTION_PLANS.PRO]: {
      name: 'Pro',
      badge: 'Popular',
      color: 'blue',
      description: 'For serious learners'
    },
    [SUBSCRIPTION_PLANS.ENTERPRISE]: {
      name: 'Enterprise',
      badge: 'Advanced',
      color: 'purple',
      description: 'For organizations'
    }
  };
  
  return planMap[planName] || planMap[SUBSCRIPTION_PLANS.FREE];
}
