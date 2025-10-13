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

interface ServiceItem {
  id: string
  title: string
  category: string
  images: string[]
  price: string
  author: string
}

export default function ServicesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const services: ServiceItem[] = [
    { id: '1', title: 'Doctor Appointment System', category: 'Healthcare', images: ['/globe.svg', '/custo-5.png', '/placeholder.svg'], price: '$199', author: 'MedTech Pro' },
    { id: '2', title: 'Restaurant Booking System', category: 'Hospitality', images: ['/placeholder.svg', '/custo-5.png', '/window.svg'], price: '$149', author: 'FoodTech' },
    { id: '3', title: 'Legal Consultation Platform', category: 'Legal', images: ['/file.svg', '/custo-5.png', '/globe.svg'], price: '$299', author: 'Law Solutions' },
    { id: '4', title: 'Fitness Training Program', category: 'Fitness', images: ['/window.svg', '/custo-5.png', '/file.svg'], price: '$99', author: 'FitPro' },
    { id: '5', title: 'Financial Advisory Service', category: 'Finance', images: ['/custo-4.png', '/custo-5.png', '/placeholder.svg'], price: '$399', author: 'Finance Expert' },
    { id: '6', title: 'Educational Platform', category: 'Education', images: ['/custo-5.png', '/custo-4.png', '/file.svg'], price: '$249', author: 'EduTech' },
  ]

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory ? service.category === activeCategory : true
      return matchesSearch && matchesCategory
    })
  }, [services, search, activeCategory])

  const categories = ['All', 'Healthcare', 'Hospitality', 'Legal', 'Fitness', 'Finance', 'Education']

  return (
    <div className="min-h-screen w-full flex justify-center">
        <div className="w-full max-w-[1200px] px-4 py-10">
      {/* Hero */}
      <div className="text-center flex flex-col gap-4 mb-10">
        <h1 className="text-4xl font-bold">Services</h1>
        <p className="text-gray-500 mt-2">
          Professional services and consultations for your business needs
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
              <Link href="/dashboard/growth/marketplace/services/category/healthcare" className="flex items-center gap-2">
                <img src="/globe.svg" alt="Healthcare" className="w-4 h-4 rounded" />
                Healthcare
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/services/category/hospitality" className="flex items-center gap-2">
                <img src="/placeholder.svg" alt="Hospitality" className="w-4 h-4 rounded" />
                Hospitality
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/services/category/legal" className="flex items-center gap-2">
                <img src="/file.svg" alt="Legal" className="w-4 h-4 rounded" />
                Legal
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/services/category/fitness" className="flex items-center gap-2">
                <img src="/window.svg" alt="Fitness" className="w-4 h-4 rounded" />
                Fitness
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/services/category/finance" className="flex items-center gap-2">
                <img src="/custo-4.png" alt="Finance" className="w-4 h-4 rounded" />
                Finance
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/growth/marketplace/services/category/education" className="flex items-center gap-2">
                <img src="/custo-5.png" alt="Education" className="w-4 h-4 rounded" />
                Education
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
      {filteredServices.slice(0, 5).map((service) => (
          <Link key={service.id} href={`/dashboard/growth/marketplace/item/${service.id}`}>
            <div className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-border cursor-pointer hover:shadow-lg transition">
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Üstte büyük resim */}
                <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-md">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Altta iki küçük */}
                {service.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-md">
                    <img
                      src={img}
                      alt={`${service.title} ${idx + 1}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <div className="p-3">
                <h3 className="text-lg text-black font-semibold">{service.title}</h3>
                <p className="text-gray-500 mt-1">{service.category}</p>
                <p className="text-sm text-blue-600 mt-1">{service.price}</p>
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
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={service.images[0]}
                alt={service.title}
                className="absolute inset-0 object-cover transition-opacity duration-300 group-hover:opacity-0"
              />

              <img
                src={service.images[1]}
                alt={service.title}
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg text-black dark:text-white font-semibold">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{service.category}</p>
                <p className="text-sm text-blue-600 mt-1">{service.price} • {service.author}</p>
              </div>
              <Link href={`/dashboard/growth/marketplace/item/${service.id}`}>
                <button className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-sm">
                  View Service <ArrowRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No services found.
          </p>
        )}
      </div>
      </div>
    </div>
  )
}
