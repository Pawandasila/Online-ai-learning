import { NextResponse } from "next/server";
import { getUserSubscription, getUserPlanFeatures, getSubscriptionDisplayInfo } from "@/lib/subscription";

export async function GET() {
  try {
    const subscription = await getUserSubscription();
    const features = await getUserPlanFeatures();
    const displayInfo = subscription ? getSubscriptionDisplayInfo(subscription) : null;

    return NextResponse.json({
      success: true,
      subscription,
      features,
      displayInfo
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}
