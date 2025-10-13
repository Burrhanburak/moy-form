"use client"

import * as React from "react"
import {
 
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop, 
  IconSearch,
  IconSettings,
  IconUsers,
  IconCalendar,
  IconCreditCard,
  IconTrendingUp,
  IconFileText,
  IconHistory,
  IconPuzzle,
  IconChartLine,
  IconReportAnalytics,
  IconPlus,
  IconTicket,
  IconUser,
  IconLogout,
  IconTools,
  
} from "@tabler/icons-react"

import { NavAnalytics } from "@/components/nav-analytics"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { NavSupport } from "@/components/nav-support"
import { NavGrowth } from "@/components/nav-growth"
import { NavSettings } from "@/components/nav-settings"
import { NavBenefits } from "@/components/nav-benefits"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { DashboardCommandMenu } from "./dashboard-command-menu"
import { NavSales } from "@/components/nav-sales"



const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  Sales: [
    {
      name: "Orders",
      url: "/dashboard/orders",
      icon: IconFileDescription,
    },
    {
      name: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconUser,
    },

   
  ],
  // billing: [
  //   {
  //     name: "Invoices",
  //     url: "/dashboard/billing/invoices",
  //     icon: IconFileText,
  //   },
  //   {
  //     name: "Payment Methods",
  //     url: "/dashboard/billing/methods",
  //     icon: IconCreditCard,
  //   },
  //   {
  //     name: "Billing History",
  //     url: "/dashboard/billing/history",
  //     icon: IconHistory,
  //   },
  // ],
  support: [
    {
      name: "Support Tickets",
      url: "/dashboard/tickets",
      icon: IconTicket,
    },
    {
      name: "Send Feedback",
      url: "/dashboard/feedback",
      icon: IconHelp,
    },
    // {
    //   name: "Docs",
    //   url: "https://docs.moydus.com",
    //   icon: IconHelp,
    // },
  ],
  growth: [
    {
      name: "Offers / Marketplace",
      url: "/dashboard/growth/marketplace",
      icon: IconTrendingUp,
    },
    // {
    //   name: "Referral Program",
    //   url: "/dashboard/growth/referrals",
    //   icon: IconTrendingUp,
    //   description: "Invite others and earn rewards when they sign up or make purchases.",

    // },
    // {
    //   name: "Templates / Themes",
    //   url: "/dashboard/growth/marketplace/templates",
    //   icon: IconTrendingUp,
    // },
    // {
    //   name: "Add-ons & Extras",
    //   url: "/dashboard/growth/marketplace/addons",
    //   icon: IconPuzzle,
    // },
    // {
    //   name: "Tools",
    //   url: "/dashboard/growth/marketplace/tools",
    //   icon: IconTools,
    // },
    // {
    //   name: "Services",
    //   url: "/dashboard/growth/marketplace/services",
    //   icon: IconTools,
    // },
  ],
  benefits: [
    {
      name: "Benefits",
      url: "/dashboard/benefits",
      icon: IconFolder,
    },
    {
      name: "Create Package",
      url: "/dashboard/benefits/create-package",
      icon: IconPlus,
    },
    {
      name: "Create Tools",
      url: "/dashboard/benefits/create-tools",
      icon: IconFileAi,
    },
  ],
  settings: [
    {
      name: "Account Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      name: "Team Members",
      url: "/dashboard/settings/members",
      icon: IconUsers,
    },
    {
      name: "Preferences",
      url: "/dashboard/settings/preferences",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: 'search',
      url: "/dashboard/search",
      component: <DashboardCommandMenu/>,
      icon: IconSearch,
    },
    {
      title: "Need Help?",
      url: "https://docs.moydus.com",
      icon: IconHelp,
    },
  
  ],
  // analytics: [
  //   {
  //     name: "Performance",
  //     url: "/dashboard/analytics/performance",
  //     icon: IconChartLine,
  //   },
  //   {
  //     name: "Sales Reports",
  //     url: "/dashboard/analytics/reports",
  //     icon: IconReportAnalytics,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Mo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSales items={data.Sales} />
      
        {/* <NavBilling items={data.billing} /> */}
        <NavSupport items={data.support} />
        <NavGrowth items={data.growth} />
    
        <NavBenefits items={data.benefits} />
        {/* <NavAnalytics items={data.analytics} /> */}
        <NavSettings items={data.settings} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
