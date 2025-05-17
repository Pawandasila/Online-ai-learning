"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Book,
  Compass,
  LayoutDashboard,
  PencilRuler,
  CreditCard,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const SidebarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
];

const CourseOptions = [
  {
    title: "My Learning",
    icon: Book,
    path: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
];

const AiToolsOptions = [
  {
    title: "AI Tools",
    icon: PencilRuler,
    path: "/workspace/ai-tools",
  },
];

const BillingOptions = [
  {
    title: "Billing",
    icon: CreditCard,
    path: "/workspace/billing",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  // Helper function to render menu items
  const renderMenuItems = (options) => {
    return options.map((option, index) => (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton asChild>
          <Link
            href={option.path}
            className={cn(
              "flex items-center rounded-md py-2 px-3 transition-all duration-200",
              pathname === option.path
                ? "bg-primary text-primary-foreground font-medium shadow-sm dark:text-white"
                : "hover:bg-secondary/80 text-foreground/90 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <option.icon
              className={cn(
                "mr-2 size-5",
                pathname === option.path
                  ? "text-primary-foreground dark:text-white"
                  : "text-muted-foreground group-hover:text-foreground/90 transition-colors"
              )}
            />
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {option.title}
              </motion.span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
    >
      <SidebarHeader className="h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
        <motion.div
          className="flex items-center px-3"
          animate={open ? "expanded" : "collapsed"}
        >
          <Image
            src="/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="transition-all duration-200"
          />
          {open && (
            <motion.h1
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="from-purple-600 to-purple-500 ml-3 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent"
            >
              SkillSprint
            </motion.h1>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        {open && (
          <Button
            className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium mb-4 rounded-md gap-2"
            size="sm"
          >
            <Plus className="size-4" />
            Create New Course
          </Button>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems(SidebarOptions)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            Courses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems(CourseOptions)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            AI Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems(AiToolsOptions)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            Billing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems(BillingOptions)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800">
        {open ? (
          <div className="flex items-center px-4 py-3 space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
              N
            </div>
            <div className="text-sm font-medium">User Account</div>
          </div>
        ) : (
          <div className="flex justify-center py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
              N
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
