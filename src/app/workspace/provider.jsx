"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/Appsidebar";
import { Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const WorkSpaceProvider = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarTrigger /> */}
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow">
          
          <div className="ml-auto"></div>
          <div className="flex items-center gap-3">
            <UserButton />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default WorkSpaceProvider;
