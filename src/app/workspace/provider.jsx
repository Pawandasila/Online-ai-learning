"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/Appsidebar";
import WelcomeBanner from "./_components/WelcomeBanner";
import AppHeader from "./_components/AppHeader";

const WorkSpaceProvider = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarTrigger /> */}
      <main className="mt-2 w-full mr-2">
        <AppHeader />

        <WelcomeBanner />

        <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default WorkSpaceProvider;
