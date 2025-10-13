'use client'
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FilterDrawer from "@/components/dashboard-fiter-drawer"
import { ArrowRightIcon, ChevronRight, PlusIcon } from "lucide-react"
import { useState, useMemo } from "react"
import React from "react"
import { DashboardCommandMarketplace } from "@/components/dashboard-command-marketplace"

const allTemplates = [
  // Portfolio templates
  { id: '1', title: 'Creative Portfolio', category: 'portfolio', images: ['/custo-5.png', '/custo-4.png'], price: 'Free', author: 'John Doe' },
  { id: '5', title: 'Design Portfolio', category: 'portfolio', images: ['/window.svg', '/custo-5.png'], price: '$79', author: 'Alex Brown' },
  
  // Business templates
  { id: '2', title: 'E-commerce Template', category: 'business', images: ['/placeholder.svg', '/custo-5.png'], price: '$49', author: 'Jane Smith' },
  { id: '6', title: 'Business Landing', category: 'business', images: ['/custo-4.png', '/custo-5.png'], price: '$99', author: 'David Lee' },
  
  // Technology templates
  { id: '7', title: 'Tech Startup Template', category: 'technology', images: ['/custo-5.png', '/custo-4.png'], price: '$89', author: 'Tech Designer' },
  { id: '8', title: 'AI Company Template', category: 'technology', images: ['/placeholder.svg', '/custo-5.png'], price: '$129', author: 'AI Studio' },
  
  // Startup templates
  { id: '9', title: 'Startup Landing Page', category: 'startup', images: ['/file.svg', '/custo-5.png'], price: '$59', author: 'Startup Pro' },
  { id: '10', title: 'SaaS Startup', category: 'startup', images: ['/custo-4.png', '/custo-5.png'], price: '$79', author: 'SaaS Design' },
  
  // SaaS templates
  { id: '11', title: 'SaaS Dashboard', category: 'saas', images: ['/custo-5.png', '/custo-4.png'], price: '$149', author: 'SaaS Expert' },
  { id: '12', title: 'SaaS Pricing Page', category: 'saas', images: ['/placeholder.svg', '/custo-5.png'], price: '$99', author: 'Pricing Pro' },
  
  // AI templates
  { id: '13', title: 'AI Product Showcase', category: 'ai', images: ['/file.svg', '/custo-5.png'], price: '$119', author: 'AI Designer' },
  { id: '14', title: 'AI Landing Page', category: 'ai', images: ['/custo-4.png', '/custo-5.png'], price: '$89', author: 'AI Studio' },
  
  // App templates
  { id: '15', title: 'Mobile App Landing', category: 'app', images: ['/custo-5.png', '/custo-4.png'], price: '$69', author: 'App Designer' },
  { id: '16', title: 'App Store Page', category: 'app', images: ['/placeholder.svg', '/custo-5.png'], price: '$79', author: 'App Pro' },
  
  // Web3 templates
  { id: '17', title: 'Crypto Project', category: 'web3', images: ['/file.svg', '/custo-5.png'], price: '$139', author: 'Web3 Studio' },
  { id: '18', title: 'NFT Marketplace', category: 'web3', images: ['/custo-4.png', '/custo-5.png'], price: '$199', author: 'NFT Expert' },
  
  // Marketing templates
  { id: '3', title: 'Landing Page Template', category: 'marketing', images: ['/file.svg', '/custo-5.png'], price: '$29', author: 'Mike Johnson' },
  
  // Content templates
  { id: '4', title: 'Blog Template', category: 'content', images: ['/globe.svg', '/custo-5.png'], price: 'Free', author: 'Sarah Wilson' },
]

export default function TemplateCategoryPage() {
  const { category } = useParams()
  const [search, setSearch] = useState('')
  
  const filtered = useMemo(() => {
    return allTemplates.filter((template) => {
      const matchesCategory = template.category.toLowerCase() === category?.toLowerCase()
      const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
  const categoryDescription = {
    portfolio: 'Showcase your creative works with professional portfolio templates',
    business: 'Give your business a professional edge with our business templates',
    technology: 'Create an innovative online presence for your tech company with customizable website templates designed to showcase advanced solutions with confidence and clarity.',
    startup: 'Launch your startup with confidence using professional templates designed to attract investors and customers.',
    saas: 'Build your SaaS platform with templates optimized for conversions and user onboarding.',
    ai: 'Showcase your AI products and services with modern, tech-forward templates.',
    app: 'Present your mobile or web app with templates designed for app landing pages.',
    web3: 'Build your blockchain and crypto project presence with cutting-edge templates.',
    marketing: 'Create compelling marketing campaigns with our marketing templates',
    content: 'Build engaging content experiences with our content templates'
  }[category as string] || ''

  // Ana kategoriler - üst seviye
  const mainCategories = [
    { name: 'Portfolio', href: '/dashboard/growth/marketplace/templates/category/portfolio', image: '/custo-5.png' },
    { name: 'Business', href: '/dashboard/growth/marketplace/templates/category/business', image: '/custo-4.png' },
    { name: 'Marketing', href: '/dashboard/growth/marketplace/templates/category/marketing', image: '/placeholder.svg' },
    { name: 'Content', href: '/dashboard/growth/marketplace/templates/category/content', image: '/file.svg' }
  ]

  // Kategori hiyerarşisi - hangi kategorinin hangi alt kategorileri var
  const categoryHierarchy = {
    business: [
      { name: 'Technology', href: '/dashboard/growth/marketplace/templates/category/technology', image: '/custo-5.png' },
      { name: 'Services', href: '/dashboard/growth/marketplace/templates/category/services', image: '/custo-4.png' },
      { name: 'Ecommerce', href: '/dashboard/growth/marketplace/templates/category/ecommerce', image: '/placeholder.svg' }
    ],
    technology: [
      { name: 'Startup', href: '/dashboard/growth/marketplace/templates/category/startup', image: '/file.svg' },
      { name: 'SaaS', href: '/dashboard/growth/marketplace/templates/category/saas', image: '/custo-5.png' },
      { name: 'AI', href: '/dashboard/growth/marketplace/templates/category/ai', image: '/custo-4.png' },
      { name: 'App', href: '/dashboard/growth/marketplace/templates/category/app', image: '/placeholder.svg' },
      { name: 'Web3', href: '/dashboard/growth/marketplace/templates/category/web3', image: '/file.svg' }
    ],
    marketing: [
      { name: 'Digital Products', href: '/dashboard/growth/marketplace/templates/category/digital-products', image: '/file.svg' }
    ],
    portfolio: [
      { name: 'Creative', href: '/dashboard/growth/marketplace/templates/category/creative', image: '/custo-5.png' },
      { name: 'Design', href: '/dashboard/growth/marketplace/templates/category/design', image: '/custo-4.png' }
    ],
    content: [] // No subcategories
  }

  // Alt kategorileri al
  const subCategories = categoryHierarchy[category as string] || []

  // Parent kategori bilgisi - hangi ana kategorinin altında olduğunu bul
  const getParentCategory = (currentCategory: string) => {
    // Business'ın alt kategorileri
    if (['technology', 'services', 'ecommerce'].includes(currentCategory)) return 'business'
    
    // Technology'nin alt kategorileri
    if (['startup', 'saas', 'ai', 'app', 'web3'].includes(currentCategory)) return 'technology'
    
    // Marketing'in alt kategorileri (sadece gerçek alt kategoriler)
    if (['digital-products'].includes(currentCategory)) return 'marketing'
    
    // Portfolio'nun alt kategorileri
    if (['creative', 'design'].includes(currentCategory)) return 'portfolio'
    
    // Content'in alt kategorileri
    if (['blog', 'news', 'magazine'].includes(currentCategory)) return 'content'
    
    return null
  }

  const parentCategory = getParentCategory(category as string)
  
  // Parent chain oluştur - tüm parent'ları bul
  const getParentChain = (currentCategory: string): string[] => {
    const chain: string[] = []
    let parent = getParentCategory(currentCategory)
    
    while (parent) {
      chain.unshift(parent) // Başa ekle
      parent = getParentCategory(parent)
    }
    
    return chain
  }
  
  const parentChain = getParentChain(category as string)

  // Son seviye kategoriler - bunlarda alt kategori yok
  const finalLevelCategories = ['startup', 'saas', 'ai', 'app', 'web3', 'services', 'ecommerce', 'creative', 'design', 'digital-products', 'blog', 'news', 'magazine']
  
  // Hangi kategorileri göstereceğini belirle
  // Eğer son seviye kategorideyse hiç kategori scroller gösterme
  const isFinalLevel = finalLevelCategories.includes(category as string)
  const categoriesToShow = isFinalLevel ? [] : (subCategories.length > 0 ? subCategories : mainCategories)

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-4 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 cursor-default mb-4">
          <Link href="/dashboard/growth/marketplace" className="text-sm text-gray-500 hover:text-gray-700">
            Marketplace
          </Link>
          <span className="text-gray-500"><ChevronRight className="w-3 h-3 text-center mt-0.5 mb-0.1" /> </span>
          <Link href="/dashboard/growth/marketplace/templates" className="text-sm text-gray-500 hover:text-gray-700">
            Templates
          </Link>
          {/* Tüm parent chain'i göster */}
          {parentChain.map((parent) => (
            <React.Fragment key={parent}>
              <span className="text-gray-500"><ChevronRight className="w-3 h-3 text-center mt-0.5 mb-0.1" /> </span>
              <Link href={`/dashboard/growth/marketplace/templates/category/${parent}`} className="text-sm text-gray-500 hover:text-gray-700">
                {parent.charAt(0).toUpperCase() + parent.slice(1)}
              </Link>
            </React.Fragment>
          ))}
          <span className="text-gray-500"><ChevronRight className="w-3 h-3 text-center mt-0.5 mb-0.1" /> </span>
          <span className="text-sm font-medium">{categoryTitle}</span>
        </div>

        {/* Page Hero */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl leading-[1.3] font-semibold">
            {categoryTitle} Website Templates
          </h1>
          <p className="max-w-[700px] text-gray-500 text-sm md:text-base">
            {categoryDescription}
          </p>
        </div>

        {/* Category Scroller - sadece alt kategoriler varsa göster */}
        {categoriesToShow.length > 0 && (
          <div className="overflow-hidden w-full mb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {categoriesToShow.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm transition ${
                    category === cat.name.toLowerCase() 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="relative w-10 h-10">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-sm"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-sm">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search - sadece ana kategorilerde göster */}
        {/* {!parentCategory && (
          <div className="flex justify-center mb-6">
            <DashboardCommandMarketplace />
          </div>
        )} */}

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            pricing
          </Button>
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            styles
          </Button>
          <Button variant="outline" className="w-fit h-fit p-2">
            <PlusIcon className="w-4 h-4" />
            features
          </Button>
          <div className="ml-auto">
            <FilterDrawer />
          </div>
        </div>

        {/* Templates Grid - Framer Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((template) => (
            <Link key={template.id} href={`/dashboard/growth/marketplace/item/${template.id}`}>
              <div className="group relative cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={template.images[0]}
                    alt={template.title}
                    className="absolute inset-0 object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={template.images[1]}
                    alt={template.title}
                    className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-black dark:text-white">{template.title}</h3>
                  <p className="text-sm text-blue-600 mt-1">{template.price} • {template.author}</p>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No templates found in {categoryTitle} category.
            </p>
          )}
        </div>

        {/* Sub Categories - Framer Style */}
        {subCategories.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Categories</span>
              {subCategories.map((subCat, index) => (
                <span key={subCat.name} className="text-sm text-gray-500">
                  {index === 0 ? '' : ' '}
                  <Link href={subCat.href} className="hover:text-blue-600 transition-colors">
                    {subCat.name}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
