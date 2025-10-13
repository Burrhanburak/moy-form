'use client'

import { Button } from "@/components/ui/button"
import FilterDrawer from "@/components/dashboard-fiter-drawer"
import { ArrowRightIcon, PlusIcon, TrendingUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"
import { DashboardCommandMarketplace } from "@/components/dashboard-command-marketplace"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolItem {
  id: string
  title: string
  category: string
  images: string[]
  price: string
  author: string
}

export default function ToolsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const tools: ToolItem[] = [
    { id: '1', title: 'Automation Tool', category: 'Productivity', images: ['/file.svg', '/custo-5.png', '/globe.svg'], price: '$29', author: 'Tech Solutions' },
    { id: '2', title: 'Analytics Dashboard', category: 'Analytics', images: ['/placeholder.svg', '/custo-5.png', '/window.svg'], price: 'Free', author: 'Data Pro' },
    { id: '3', title: 'Form Builder', category: 'Development', images: ['/globe.svg', '/custo-5.png', '/placeholder.svg'], price: '$49', author: 'Dev Tools' },
    { id: '4', title: 'Social Media Manager', category: 'Marketing', images: ['/window.svg', '/custo-5.png', '/file.svg'], price: '$79', author: 'Social Pro' },
    { id: '5', title: 'Project Tracker', category: 'Productivity', images: ['/custo-4.png', '/custo-5.png', '/placeholder.svg'], price: '$39', author: 'Project Master' },
    { id: '6', title: 'Email Marketing Tool', category: 'Marketing', images: ['/custo-5.png', '/custo-4.png', '/file.svg'], price: '$59', author: 'Email Expert' },
  ]

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory ? tool.category === activeCategory : true
      return matchesSearch && matchesCategory
    })
  }, [tools, search, activeCategory])

  const categories = ['All', 'Productivity', 'Analytics', 'Development', 'Marketing']

  return (
    <div className="min-h-screen w-full flex justify-center">
        <div className="w-full max-w-[1200px] px-4 py-10">
      {/* Hero */}
      <div className="text-center flex flex-col gap-4 mb-10">
        <h1 className="text-4xl font-bold">Tools</h1>
        <p className="text-gray-500 mt-2">
          Automation tools and productivity solutions for your workflow
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <DashboardCommandMarketplace />
      </div>

      {/* Categories */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit h-fit p-2">
              <PlusIcon className="w-4 h-4" />
              categories
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/tools/category/productivity" className="flex items-center gap-2">
                <img src="/file.svg" alt="Productivity" className="w-4 h-4 rounded" />
                Productivity
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/tools/category/analytics" className="flex items-center gap-2">
                <img src="/placeholder.svg" alt="Analytics" className="w-4 h-4 rounded" />
                Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/tools/category/development" className="flex items-center gap-2">
                <img src="/globe.svg" alt="Development" className="w-4 h-4 rounded" />
                Development
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/tools/category/marketing" className="flex items-center gap-2">
                <img src="/window.svg" alt="Marketing" className="w-4 h-4 rounded" />
                Marketing
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2 flex-col">
          <Link href="/dashboard/growth/marketplace" className="flex items-center gap-2">
            back to marketplace
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 🔹 Top Section — 5 columns (category showcase) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 overflow-hidden mb-16">
      {filteredTools.slice(0, 5).map((tool) => (
          <Link key={tool.id} href={`/dashboard/growth/marketplace/item/${tool.id}`}>
            <div className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-border cursor-pointer hover:shadow-lg transition">
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Üstte büyük resim */}
                <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-md">
                  <img
                    src={tool.images[0]}
                    alt={tool.title}
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Altta iki küçük */}
                {tool.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-md">
                    <img
                      src={img}
                      alt={`${tool.title} ${idx + 1}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <div className="p-3">
                <h3 className="text-lg text-black font-semibold">{tool.title}</h3>
                <p className="text-gray-500 mt-1">{tool.category}</p>
                <p className="text-sm text-blue-600 mt-1">{tool.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔸 Bottom Section — Filters + Products */}
<div className="flex flex-wrap justify-center gap-4 mb-8">
  {/* Mobile only: show 1 button */}
  <Button
    variant="outline"
    className="w-fit h-fit  px-4 py-3 sm:hidden flex items-center gap-2 text-sm"
  >
    <PlusIcon className="w-4 h-4" />
    features
  </Button>

  {/* Desktop: show all */}
  <div className="hidden sm:flex gap-4">
    <Button variant="outline" className="w-fit h-fit p-2">
      <PlusIcon className="w-4 h-4" />
      categories
    </Button>
    <Button variant="outline" className="w-fit h-fit p-2">
      <PlusIcon className="w-4 h-4" />
      styles
    </Button>
    <Button variant="outline" className="w-fit h-fit p-2">
      <PlusIcon className="w-4 h-4" />
      pricing
    </Button>
    <Button variant="outline" className="w-fit h-fit p-2">
      <PlusIcon className="w-4 h-4" />
      features
    </Button>
  </div>

  <div className="ml-auto">
    <FilterDrawer />
  </div>
</div>

      {/* 🔸 Product Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="group relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={tool.images[0]}
                alt={tool.title}
                className="absolute inset-0 object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              <img
                src={tool.images[1]}
                alt={tool.title}
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg text-black dark:text-white font-semibold">{tool.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{tool.category}</p>
                <p className="text-sm text-blue-600 mt-1">{tool.price} • {tool.author}</p>
              </div>
              <Link href={`/dashboard/growth/marketplace/item/${tool.id}`}>
                <button className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-sm">
                  View Tool <ArrowRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
        {filteredTools.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No tools found.
          </p>
        )}
      </div>
      </div>
    </div>
  )
}
