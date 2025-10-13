'use client'

import React from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut
} from './ui/command'
import { useRouter } from 'next/navigation'
import {
  IconDashboard,
  IconUser,
  IconCalendar,
  IconFileDescription,
  IconFileText,
  IconCreditCard,
  IconHistory,
  IconTicket,
  IconHelp,
  IconTrendingUp,
  IconPuzzle,
  IconFolder,
  IconPlus,
  IconFileAi,
  IconSettings,
  IconUsers,
  IconSearch,
  IconChartLine,
  IconReportAnalytics,
} from '@tabler/icons-react'
import { Calendar, Settings } from 'lucide-react'
import { Smile } from 'lucide-react'
import { Calculator } from 'lucide-react'
import { User } from 'lucide-react'
import { CreditCard } from 'lucide-react'

// Senin verdiğin data
const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  ],
 
  analytics: [
    { name: "Performance", url: "/dashboard/analytics/performance", icon: IconChartLine },
    { name: "Sales Reports", url: "/dashboard/analytics/reports", icon: IconReportAnalytics },
  ],
}

// Mock API’ler (sen kendi API çağrılarını koyacaksın)
async function fetchSubscriptions(search: string) {
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ].filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
}
async function fetchTeamMembers(search: string) {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ].filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
  }
async function fetchPackages(search: string) {
  return [
    { id: 11, title: 'Starter Package', price: 9 },
    { id: 12, title: 'Pro Package', price: 29 },
  ].filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
}

async function fetchOrders(search: string) {
  return [
    { id: 101, orderNo: 'ORD-001', total: 120 },
    { id: 102, orderNo: 'ORD-002', total: 80 },
  ].filter(o => o.orderNo.toLowerCase().includes(search.toLowerCase()))
}

export function DashboardCommandMarketplace() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<{
    users: any[]
    packages: any[]
    orders: any[]
  }>({ users: [], packages: [], orders: [] })

  const router = useRouter()

  // Cmd+K aç/kapat
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Search logic
  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults({ users: [], packages: [], orders: [] })
        return
      }

      setLoading(true)
      try {
        const [users, packages, orders] = await Promise.all([
          fetchUsers(searchQuery),
          fetchPackages(searchQuery),
          fetchOrders(searchQuery),
        ])
        setResults({ users, packages, orders })
      } catch (error) {
        console.error('Search error:', error)
        setResults({ users: [], packages: [], orders: [] })
      } finally {
        setLoading(false)
      }
    },
    []
  )

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        handleSearch(query)
      } else {
        setResults({ users: [], packages: [], orders: [] })
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, handleSearch])

  // Statik navigation araması
  const navLinks = React.useMemo(() => {
    if (!query.trim()) return []

    const lower = query.toLowerCase()
    const groups = Object.entries(data).map(([group, links]) => {
      const matches = (links as any[]).filter((link) => {
        const text = link.title || link.name
        return text.toLowerCase().includes(lower)
      })
      return { group, matches }
    })
    return groups.filter(g => g.matches.length > 0)
  }, [query])

  return (
    <div>
      {/* Trigger Button */}
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white dark:bg-[#181a1c] border border-gray-200 dark:border-[#181a1c] hover:border-gray-300 dark:hover:border-neutral-600 transition-colors shadow-sm hover:shadow-md"
      >
        <IconSearch size={18} className="text-gray-400 dark:text-gray-500" />
        <span className="text-gray-500 dark:text-gray-400 text-sm">Search templates...</span>
        <div className="ml-auto flex gap-1">
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-700 rounded">⌘</kbd>
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-700 rounded">K</kbd>
        </div>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search dashboard..." 
          value={query}
          onValueChange={setQuery}
        />
         <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem> 
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandDialog>      
    </div>
  )
}
