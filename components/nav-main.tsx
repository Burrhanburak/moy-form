"use client";

import Link from "next/link";
import {
  IconCirclePlusFilled,
  IconInnerShadowTop,
  IconMail,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Navigation } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              className="bg-[#171717] dark:bg-[#171717] dark:text-white text-primary-foreground border border-black border-solid shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)] hover:bg-[#464747]/90 hover:text-primary-foreground active:bg-[#171717]/70 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link href="/dashboard/create-package">
                <IconCirclePlusFilled />
                <span>Create New Project</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0 p-1 rounded-md"
              variant="outline"
            >
              <Link href="/dashboard/create-package">
                <Navigation className="size-4" />
                <span className="sr-only">Create New Project</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Dynamic items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
