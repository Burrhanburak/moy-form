"use client";

import React from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "./ui/command";
import { useRouter } from "next/navigation";
import {
  IconDashboard,
  IconUser,
  IconFileDescription,
  IconTicket,
  IconHelp,
  IconTrendingUp,
  IconFolder,
  IconPlus,
  IconFileAi,
  IconSettings,
  IconUsers,
  IconSearch,
} from "@tabler/icons-react";

// Dashboard navigation data - gerçek klasör yapınıza göre
const data = {
  navMain: [{ title: "Dashboard", url: "/dashboard", icon: IconDashboard }],
  subscriptions: [
    {
      name: "My Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconUser,
    },
  ],
  orders: [
    { name: "All Orders", url: "/dashboard/orders", icon: IconFileDescription },
  ],
  support: [
    { name: "Support Tickets", url: "/dashboard/tickets", icon: IconTicket },
    { name: "Send Feedback", url: "/dashboard/feedback", icon: IconHelp },
  ],
  growth: [
    {
      name: "Marketplace",
      url: "/dashboard/growth/marketplace",
      icon: IconTrendingUp,
    },
    {
      name: "Referral Program",
      url: "/dashboard/growth/referrals",
      icon: IconTrendingUp,
    },
  ],
  benefits: [
    { name: "Benefits", url: "/dashboard/benefits", icon: IconFolder },
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
};

export function DashboardCommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  // Cmd+K aç/kapat
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search navigation items
  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];

    const lower = query.toLowerCase();
    const results: Array<{
      title: string;
      url: string;
      group: string;
      icon: any;
    }> = [];

    Object.entries(data).forEach(([groupKey, items]) => {
      items.forEach((item: any) => {
        const text = (item.title || item.name || "").toLowerCase();
        if (text.includes(lower)) {
          results.push({
            title: item.title || item.name,
            url: item.url,
            group: groupKey,
            icon: item.icon,
          });
        }
      });
    });

    return results;
  }, [query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-1.5 px-4 py-2 rounded-lg bg-white dark:bg-[#171719] border border-gray-200 dark:border-[#313131] text-white  border border-[#e0e0e0] h-9"
      >
        <IconSearch size={16} className="text-[#171719] dark:text-white" />
        <span className="text-gray-500 dark:text-white">Search...</span>
        <div className="ml-auto flex gap-1">
          <kbd className="px-1.5 py-0.5 text-xs bg-white text-[#171719] dark:bg-[#171719] dark:text-white border rounded">
            ⌘
          </kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-white text-[#171719] dark:bg-[#171719] dark:text-white border rounded">
            K
          </kbd>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search dashboard..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!query && (
            <>
              <CommandEmpty>Type to search...</CommandEmpty>
              <CommandGroup heading="Quick Links">
                <CommandItem onSelect={() => handleSelect("/dashboard")}>
                  <IconDashboard className="mr-2" size={16} />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect("/dashboard/subscriptions")}
                >
                  <IconUser className="mr-2" size={16} />
                  <span>Subscriptions</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("/dashboard/orders")}>
                  <IconFileDescription className="mr-2" size={16} />
                  <span>Orders</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect("/dashboard/settings")}
                >
                  <IconSettings className="mr-2" size={16} />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {query && searchResults.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}

          {query && searchResults.length > 0 && (
            <CommandGroup heading="Search Results">
              {searchResults.map((result, index) => {
                const Icon = result.icon;
                return (
                  <CommandItem
                    key={`${result.url}-${index}`}
                    onSelect={() => handleSelect(result.url)}
                  >
                    <Icon className="mr-2" size={16} />
                    <span>{result.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {result.group}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
