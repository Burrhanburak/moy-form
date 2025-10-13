'use client'
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FilterDrawer from "@/components/dashboard-fiter-drawer"
import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { DashboardCommandMarketplace } from "@/components/dashboard-command-marketplace"

const allServices = [
  { id: '1', title: 'Doctor Appointment System', category: 'healthcare', images: ['/globe.svg', '/custo-5.png'], price: '$199', author: 'MedTech Pro' },
  { id: '2', title: 'Restaurant Booking System', category: 'hospitality', images: ['/placeholder.svg', '/custo-5.png'], price: '$149', author: 'FoodTech' },
  { id: '3', title: 'Legal Consultation Platform', category: 'legal', images: ['/file.svg', '/custo-5.png'], price: '$299', author: 'Law Solutions' },
  { id: '4', title: 'Fitness Training Program', category: 'fitness', images: ['/window.svg', '/custo-5.png'], price: '$99', author: 'FitPro' },
  { id: '5', title: 'Financial Advisory Service', category: 'finance', images: ['/custo-4.png', '/custo-5.png'], price: '$399', author: 'Finance Expert' },
  { id: '6', title: 'Educational Platform', category: 'education', images: ['/custo-5.png', '/custo-4.png'], price: '$249', author: 'EduTech' },
]

export default function ServiceCategoryPage() {
  const { category } = useParams()
  const [search, setSearch] = useState('')
  
  const filtered = useMemo(() => {
    return allServices.filter((service) => {
      const matchesCategory = service.category.toLowerCase() === category?.toLowerCase()
      const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
  const categoryDescription = {
    healthcare: 'Transform healthcare delivery with innovative medical services',
    hospitality: 'Enhance guest experiences with hospitality management services',
    legal: 'Navigate legal complexities with professional legal services',
    fitness: 'Achieve your fitness goals with personalized training services',
    finance: 'Secure your financial future with expert advisory services',
    education: 'Accelerate learning with comprehensive educational services'
  }[category as string] || ''

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-4 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 cursor-default mb-4">
          <Link href="/dashboard/growth/marketplace" className="text-sm text-gray-500 hover:text-gray-700">
            Marketplace
          </Link>
          <span>/</span>
          <Link href="/dashboard/growth/marketplace/services" className="text-sm text-gray-500 hover:text-gray-700">
            Services
          </Link>
          <span>/</span>
          <span className="text-sm font-medium">{categoryTitle}</span>
        </div>

        {/* Page Hero */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl leading-[1.3] font-semibold">
            {categoryTitle} Services
          </h1>
          <p className="max-w-[700px] text-gray-500 text-sm md:text-base">
            {categoryDescription}
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <DashboardCommandMarketplace />
        </div>

        {/* Category Scroller */}
        <div className="overflow-hidden w-full mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <Link
              href="/dashboard/growth/marketplace/services/category/healthcare"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'healthcare' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/globe.svg"
                  alt="Healthcare"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Healthcare</span>
            </Link>

            <Link
              href="/dashboard/growth/marketplace/services/category/hospitality"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'hospitality' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/placeholder.svg"
                  alt="Hospitality"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Hospitality</span>
            </Link>

            <Link
              href="/dashboard/growth/marketplace/services/category/legal"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'legal' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/file.svg"
                  alt="Legal"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Legal</span>
            </Link>

            <Link
              href="/dashboard/growth/marketplace/services/category/fitness"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'fitness' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/window.svg"
                  alt="Fitness"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Fitness</span>
            </Link>

            <Link
              href="/dashboard/growth/marketplace/services/category/finance"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'finance' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/custo-4.png"
                  alt="Finance"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Finance</span>
            </Link>

            <Link
              href="/dashboard/growth/marketplace/services/category/education"
              className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                category === 'education' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/custo-5.png"
                  alt="Education"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-sm">Education</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            pricing
          </Button>
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            duration
          </Button>
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            expertise
          </Button>
          <div className="ml-auto">
            <FilterDrawer />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((service) => (
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
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No services found in {categoryTitle} category.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
