'use client'
import { useParams } from "next/navigation"
import Link from "next/link"

const allItems = [
  { id: '1', title: 'Web Design Template', category: 'templates', images: ['/custo-5.png'] },
  { id: '2', title: 'E-commerce Add-on', category: 'addons', images: ['/custo-5.png'] },
  { id: '3', title: 'Automation Tool', category: 'tools', images: ['/custo-5.png'] },
  { id: '4', title: 'Doctor Appointment System', category: 'services', images: ['/custo-5.png'] },
]

export default function CategoryPage() {
  const { category } = useParams()
  const filtered = allItems.filter(
    item => item.category.toLowerCase() === category?.toLowerCase()
  )
  return (
    <div className="mx-auto w-full max-w-[var(--page-width)] px-5 flex flex-col gap-8 py-10"> 

    <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white before:to-transparent before:pointer-events-none before:z-[-1]">
 
      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent pointer-events-none z-[-1]"></div>
sdsfsdf
      </div>

    {/* Page Hero / Breadcrumbs */}
    <div className="flex flex-col gap-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 cursor-default">
        <span className="text-sm text-gray-500">Home</span>
        <span>/</span>
        <span className="text-sm text-gray-500">Categories</span>
        <span>/</span>
        <span className="text-sm font-medium">Portfolio</span>
      </div>
  
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl md:text-3xl leading-[1.3] font-semibold">
        Creative Website Templates
        </h3>
        <p className="max-w-[700px] text-gray-500 text-sm md:text-base">
  
        Create a stand-out online presence for your creative works with a website template designed to showcase your unique vision. These designs help highlight your portfolio and your distinctive creative perspective. 
        </p>
      </div>
    </div>
  
    {/* Category Scroller */}
    <div className="overflow-hidden w-full">
      <div className="flex gap-2 overflow-x-auto scrollbar-none mask-image-[linear-gradient(90deg,black_95%,transparent)] transition-all duration-200">
        {/* Single Category Button */}
        <a
          href="/marketplace/templates/category/portfolio/"
          className="flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm bg-gray-100 text-gray-700 transition hover:bg-gray-200"
        >
          <div className="relative w-10 h-10">
            <img
              src="https://y4pdgnepgswqffpt.public.blob.vercel-storage.com/templates/50716/portfolite-tSdwL2z7uMF6IBuGzhEUgbCmCKfrgt"
              alt="Portfolio"
              className="absolute inset-0 w-full h-full object-cover rounded-sm"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="text-sm">Portfolio</span>
        </a>
  
        {/* Daha fazla kategori ekleyebilirsin */}
        <a
          href="/marketplace/templates/category/blog/"
          className="flex items-center flex-shrink-0 gap-3 h-12 px-2.5 rounded-sm bg-gray-100 text-gray-700 transition hover:bg-gray-200"
        >
          <div className="relative w-10 h-10">
            <img
              src="/custo-5.png"
              alt="Blog"
              className="absolute inset-0 w-full h-full object-cover rounded-sm"
              loading="lazy"
            />
          </div>
          <span className="text-sm">Blog</span>
        </a>
      </div>
    </div>
  </div>
  
  )
}
