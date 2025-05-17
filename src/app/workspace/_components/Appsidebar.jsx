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
import { cn } from "@/lib/utils";
import {
  Book,
  Compass,
  PencilRuler,
  CreditCard,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AddNewCourse from "./AddNewCourse";

const item = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/workspace",
  },
  {
    title: "My Learning",
    icon: Book,
    url: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    url: "/workspace/explore",
  },
];

const Application = [
  {
    title: "AI Tools",
    icon: PencilRuler,
    url: "/workspace/ai-tools",
  },
  {
    title: "Billing",
    icon: CreditCard,
    url: "/workspace/billing",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  //   const {user}

  return (
    <Sidebar collapsible="icon" variant="floating" className="">
      <SidebarHeader>
        <motion.div
          className="flex items-center px-3"
          animate={open ? "expanded" : "collapsed"}
        >
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={40}
            height={40}
            className="mr-3 transition-all duration-200"
          />
          {open && (
            <motion.h1
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent"
            >
              SkillSprint
            </motion.h1>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "hover:bg-secondary/80 transition-all duration-200",
                        {
                          "!bg-primary !text-primary-foreground font-medium shadow-sm dark:!text-white":
                            pathname === item.url,
                        }
                      )}
                    >
                      <item.icon
                        className={cn("mr-2 size-5", {
                          "text-primary-foreground dark:!text-white":
                            pathname === item.url,
                          "text-muted-foreground group-hover:text-foreground/90 transition-colors":
                            pathname !== item.url,
                        })}
                      />
                      <AnimatePresence>
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.span>
                      </AnimatePresence>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Application.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "hover:bg-secondary/80 transition-all duration-200",
                        {
                          "!bg-primary !text-primary-foreground font-medium shadow-sm dark:!text-white":
                            pathname === item.url,
                        }
                      )}
                    >
                      <item.icon
                        className={cn("mr-2 size-5", {
                          "text-primary-foreground dark:!text-white":
                            pathname === item.url,
                          "text-muted-foreground group-hover:text-foreground/90 transition-colors":
                            pathname !== item.url,
                        })}
                      />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.title}
                      </motion.span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="h-4"></div>
              {open && (
                <SidebarMenuItem>
                  <AddNewCourse>
                    <Button
                      variant="outline"
                      className="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 w-fit justify-start gap-2 text-sm transition-all duration-200 dark:hover:text-white"
                      size="sm"
                    >
                      <Plus className="size-4" />
                      Create Course
                    </Button>
                  </AddNewCourse>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800">
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center px-4 py-3 space-x-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm"
            >
              N
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium"
            >
              {}
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex justify-center py-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm cursor-pointer"
            >
              N
            </motion.div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
