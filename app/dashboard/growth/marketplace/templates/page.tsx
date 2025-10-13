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

interface TemplateItem {
  id: string
  title: string
  category: string
  images: string[]
  price: string
  author: string
}

export default function TemplatesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const templates: TemplateItem[] = [
    { id: '1', title: 'Web Design Template', category: 'Portfolio', images: ['/custo-5.png', '/custo-4.png', '/custo-5.png'], price: 'Free', author: 'John Doe' },
    { id: '2', title: 'E-commerce e', category: 'Business', images: ['/custo-5.png', '/custo-5.png', '/custo-5.png'], price: '$49', author: 'Jane Smith' },
    { id: '3', title: 'Landing Page e', category: 'Marketing', images: ['/custo-4.png', '/custo-5.png', '/custo-5.png'], price: '$29', author: 'Mike Johnson' },
    { id: '4', title: 'Blog Template', category: 'Content', images: ['/custo-5.png', '/custo-5.png', '/custo-5.png'], price: 'Free', author: 'Sarah Wilson' },
    { id: '5', title: 'Portfolio Template', category: 'Portfolio', images: ['/custo-4.png', '/custo-5.png', '/custo-5.png'], price: '$79', author: 'Alex Brown' },
    { id: '6', title: 'SaaS Template', category: 'Business', images: ['/custo-4.png', '/custo-5.png', '/custo-5.png'], price: '$99', author: 'David Lee' },
  ]

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory ? template.category === activeCategory : true
      return matchesSearch && matchesCategory
    })
  }, [templates, search, activeCategory])

  const categories = ['All', 'Portfolio', 'Business', 'Marketing', 'Content']

  return (
    <div className="min-h-screen w-full flex justify-center">
        <div className="w-full max-w-[1200px] px-4 py-10">
      {/* Hero */}
      <div className="text-center flex flex-col gap-4 mb-10">
        <h1 className="text-4xl font-bold">Templates</h1>
        <p className="text-gray-500 mt-2">
          Website templates for designers, businesses, and personal use
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <DashboardCommandMarketplace />
        </div>
      </div>

      {/* Categories */}
      <div className="flex justify-center items-center ">
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
              <Link href="/dashboard/growth/marketplace/templates/category/portfolio" className="flex items-center gap-2">
                <img src="/custo-5.png" alt="Portfolio" className="w-4 h-4 rounded" />
                Portfolio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/templates/category/business" className="flex items-center gap-2">
                <img src="/custo-4.png" alt="Business" className="w-4 h-4 rounded" />
                Business
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/templates/category/marketing" className="flex items-center gap-2">
                <img src="/custo-5.png" alt="Marketing" className="w-4 h-4 rounded" />
                Marketing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/templates/category/content" className="flex items-center gap-2">
                <img src="/custo-4.png" alt="Content" className="w-4 h-4 rounded" />
                Content
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 overflow-hidden mb-16 mt-4">
      {filteredTemplates.slice(0, 5).map((template) => (
          <Link key={template.id} href={`/dashboard/growth/marketplace/templates/category/${template.category.toLowerCase()}`}>
            <div className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-border cursor-pointer hover:shadow-lg transition  w-full flex flex-col">
              <div className="grid grid-cols-2 gap-2 p-2 ">
                {/* Üstte büyük resim */}
                <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-md">
                  <img
                    src={template.images[0]}
                    alt={template.title}
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Altta iki küçük */}
                {template.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-md">
                    <img
                      src={img}
                      alt={`${template.title} ${idx + 1}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <div className="p-3 flex-shrink-0">
                <h3 className="text-lg text-black font-semibold line-clamp-2">{template.title}</h3>
                <p className="text-gray-500 mt-1 truncate">{template.category}</p>
                <p className="text-sm text-blue-600 mt-1">{template.price}</p>
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
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative"
          >
            <div className="relative h-80 overflow-hidden rounded-xl">
              <img
                src={template.images[0]}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              <img
                src={template.images[1]}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg text-black dark:text-white font-semibold">{template.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{template.category}</p>
                <p className="text-sm text-blue-600 mt-1">{template.price} • {template.author}</p>
              </div>
              <Link href={`/dashboard/growth/marketplace/item/${template.id}`}>
                <button className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-sm">
                  View Template <ArrowRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No templates found.
          </p>
        )}
      </div>
      </div>
    </div>
  )
}
