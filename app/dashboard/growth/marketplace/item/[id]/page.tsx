'use client'
import { useParams } from "next/navigation"

const allItems = [
  { id: '1', title: 'Web Design Template', category: 'templates', description: 'A modern web design template.', images: ['/custo-5.png'] },
  { id: '2', title: 'E-commerce Add-on', category: 'addons', description: 'Enhance your store with extra features.', images: ['/custo-5.png'] },
]

export default function ItemPage() {
  const { id } = useParams()
  const item = allItems.find((i) => i.id === id)

  if (!item) return <p className="p-10">Item not found.</p>

  return (
    <div className="max-w-4xl mx-auto py-10">
      <img src={item.images[0]} alt={item.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p className="text-gray-500 mb-4">{item.category}</p>
      <p>{item.description}</p>
      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded">Buy Now</button>
    </div>
  )
}
