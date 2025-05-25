import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId, has } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Debug information
    const debugInfo = {
      userId,
      userEmail: user?.emailAddresses?.[0]?.emailAddress,
      // Check all possible plan slugs
      plans: {
        starter: await has({ slug: "starter" }),
        starter_plan: await has({ slug: "starter_plan" }), 
        pro: await has({ slug: "pro" }),
        pro_plan: await has({ slug: "pro_plan" }),
        enterprise: await has({ slug: "enterprise" }),
        enterprise_plan: await has({ slug: "enterprise_plan" }),
        free: await has({ slug: "free" }),
        free_plan: await has({ slug: "free_plan" })
      },
      // Check organization memberships if any
      organizationMemberships: user?.organizationMemberships?.map(membership => ({
        organization: {
          name: membership.organization.name,
          slug: membership.organization.slug,
          id: membership.organization.id
        },
        role: membership.role
      })) || [],
      // Raw user object (sanitized)
      userInfo: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        hasImage: !!user?.imageUrl,
        createdAt: user?.createdAt,
        lastSignInAt: user?.lastSignInAt
      }
    };

    console.log("User subscription debug info:", JSON.stringify(debugInfo, null, 2));

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error("Debug subscription error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get debug info",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
