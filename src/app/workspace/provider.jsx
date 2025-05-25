"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/Appsidebar";
import WelcomeBanner from "./_components/WelcomeBanner";
import AppHeader from "./_components/AppHeader";
import { usePathname } from "next/navigation";
import { CourseEventsProvider } from "@/context/course-events.context";

const WorkSpaceProvider = ({ children }) => {
  const pathname = usePathname();
  const show = pathname === "/workspace";

  return (
    <CourseEventsProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="mt-2 w-full mr-2">
          <AppHeader />

          {show && <WelcomeBanner />}

          <div
            className={`h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar shadow ${
              !show ? "mt-4 mb-4" : ""
            }`}
          >
            {children}
          </div>
        </main>
      </SidebarProvider>
    </CourseEventsProvider>
  );
};

export default WorkSpaceProvider;
