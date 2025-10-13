'use client'

import { Button } from "@/components/ui/button"
import FilterDrawer from "@/components/dashboard-fiter-drawer"
import { ArrowRightIcon, PlusIcon, TrendingUp } from "lucide-react"
import { useState, useMemo } from "react"
import { DashboardCommandMarketplace } from "@/components/dashboard-command-marketplace"
import Link from "next/link"

interface MarketplaceItem {
  id: string
  title: string
  category: string
  images: string[]
}

export default function MarketplacePage() {
  const marketplaceCategories = [
    {
      title: 'Templates',
      description: 'Website templates for designers, businesses, and personal use',
      count: '2.7K',
      image: '/custo-5.png',
      href: '/dashboard/growth/marketplace/templates'
    },
    {
      title: 'Tools',
      description: 'Automation tools and productivity solutions',
      count: '1.2K',
      image: '/custo-4.png',
      href: '/dashboard/growth/marketplace/tools'
    },
    {
      title: 'Services',
      description: 'Professional services and consultations',
      count: '850',
      image: '/placeholder.svg',
      href: '/dashboard/growth/marketplace/services'
    }
  ]

  return (
    <div className="min-h-screen w-full flex justify-center">
        <div className="w-full max-w-[1200px] px-4 py-10">
      {/* Hero */}
      <div className="text-center flex flex-col gap-4 mb-10">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-gray-500 mt-2">
          Discover templates, tools, add-ons, and services for your projects.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <DashboardCommandMarketplace />
      </div>

      {/* Categories */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketplaceCategories.map((category) => (
            <Link key={category.title} href={category.href}>
              <div className="group bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <span className="text-sm text-gray-500">{category.count}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
