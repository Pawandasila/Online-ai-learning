import React from "react";
import Link from "next/link";
import { Search, Crown } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppHeader = ({ hideSidebar = false }) => {
  return (
    <header className="flex rounded-2xl  items-center gap-4 border-b border-sidebar-border bg-sidebar p-2 shadow-sm ">
      {!hideSidebar && (
        <SidebarTrigger className="text-gray-500 hover:text-gray-800 transition-colors" />
      )}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="search"
          className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Search workspace..."
        />
      </div>{" "}
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/pricing">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Crown className="w-4 h-4" />
            Upgrade
          </button>
        </Link>
        <UserButton />
      </div>
    </header>
  );
};

export default AppHeader;
