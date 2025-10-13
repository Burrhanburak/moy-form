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
import { prisma } from '@/lib/prisma'

async function fetchBenefits(search: string) {
    const benefits = await prisma.packages.findMany({
        where: {
            name: { contains: search }
        }
    })
    return benefits
}



export function DashboardCommandMenu() {
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
          fetchBenefits(searchQuery),
          
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
        className="ring-offset-background file:text-foreground flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-polar-500 dark:border-[#313131] dark:bg-[#171719] shadow-xs h-10 rounded-xl border border-gray-200 bg-white px-3 py-2 text-base text-gray-950 outline-none placeholder:text-gray-400  md:text-sm dark:text-white dark:ring-offset-transparent  pl-10 w-full md:max-w-64"
        >
   
        <span className="text-gray-500 dark:text-white  ">Search...</span>
        <div className="ml-auto flex gap-1 ml-4 ">
          <kbd className="px-1.5 py-0.5 text-xs "></kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-white text-[#171719] dark:bg-[#171719] dark:text-white border rounded">K</kbd>
        </div>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search benefits..." 
          value={query}
          onValueChange={setQuery}
        />
         <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Package</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Addon</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Benefit</span>s
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Benefits">
          <CommandItem>
            <User />
            <span>Benefit</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Addon</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem> 
            <Settings />
            <span>Package</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandDialog>      
    </div>
  )
}
