// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { getOrderById } from '@/app/action/order-action';
// import Link from 'next/link';
// import { ArrowLeft, Loader } from 'lucide-react';

// interface OrderDetail {
//   id: string;
//   packageName: string;
//   selectedAddons: string[];
//   customerPhone?: string;
//   companyName?: string;
//   businessField: string[];
//   hasDomain?: string;
//   domainName?: string;
//   hasSocialMedia?: string;
//   socialMediaAccounts: string[];
//   packageAnswers?: any;
//   projectDescription?: string;
//   specialRequirements?: string;
//   exampleSites?: string;
//   additionalNotes?: string;
//   packagePrice: number;
//   addOnsPrice: number;
//   totalPrice: number;
//   status: string;
//   createdAt: Date;
//   stripeSessionId?: string;
//   user: {
//     name: string;
//     email: string;
//     phone?: string;
//     companyName?: string;
//   };
//   subscription?: {
//     packageName?: string;
//     businessField: string[];
//   };
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const orderId = params.id as string;
  
//   const [order, setOrder] = useState<OrderDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (orderId) {
//       loadOrder();
//     }
//   }, [orderId]);

//   const loadOrder = async () => {
//     try {
//       setLoading(true);
//       console.log('Loading order with ID:', orderId);
//       const result = await getOrderById(orderId);
//       console.log('Order result:', result);
      
//       if (result.error) {
//         setError(result.error);
//       } else {
//         setOrder(result.order || null);
//       }
//     } catch (err) {
//       console.error('Error loading order:', err);
//       setError('Failed to load order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'text-green-600 bg-green-100';
//       case 'processing':
//         return 'text-blue-600 bg-blue-100';
//       case 'pending':
//         return 'text-yellow-600 bg-yellow-100';
//       case 'canceled':
//         return 'text-red-600 bg-red-100';
//       case 'failed':
//         return 'text-red-600 bg-red-100';
//       default:
//         return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString('tr-TR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatPrice = (amount: number) => {
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="relative flex h-full w-full flex-col gap-y-4">
//         <main className="relative flex min-h-0 w-full grow flex-col">
//           <div className="flex h-full w-full flex-row gap-x-2 p-5">
//             <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
//               <div className="flex items-center justify-center py-12 h-full">
//                 <Loader className="animate-spin" />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="relative flex h-full w-full flex-col gap-y-4">
//         <main className="relative flex min-h-0 w-full grow flex-col">
//           <div className="flex h-full w-full flex-row gap-x-2 p-5">
//             <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
//               <div className="flex items-center justify-center py-12">
//                 <div className="text-red-600 dark:text-red-400">
//                   {error || 'Order not found'}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="relative flex h-full w-full flex-col gap-y-4">
//       <main className="relative flex min-h-0 w-full grow flex-col">
//         <div className="flex h-full w-full flex-row gap-x-2 p-5">
//           <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
//             <div className="flex h-full w-full flex-col">
//               {/* Header */}
//               <div className="flex w-full items-center justify-between py-8">
//                 <div className="flex items-center gap-4">
//                   <Link 
//                     href="/dashboard/orders" 
//                     className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                   >
//                     <ArrowLeft size={20} />
//                     Back to Orders
//                   </Link>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                   {order.status}
//                 </span>
//               </div>

//               <div className="flex w-full flex-col pb-8 space-y-8">
//                 {/* Order Info */}
//                 <div className="space-y-4">
//                   <h1 className="text-2xl font-bold dark:text-white">
//                     Order #{order.id.slice(-8)}
//                   </h1>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="font-medium dark:text-white">Order Date:</span>
//                       <span className="ml-2 dark:text-gray-300">{formatDate(order.createdAt)}</span>
//                     </div>
//                     <div>
//                       <span className="font-medium dark:text-white">Total Amount:</span>
//                       <span className="ml-2 font-bold text-lg dark:text-gray-300">{formatPrice(order.totalPrice)}</span>
//                     </div>
//                     <div>
//                       <span className="font-medium dark:text-white">Package:</span>
//                       <span className="ml-2 dark:text-gray-300">{order.packageName}</span>
//                     </div>
//                     {order.stripeSessionId && (
//                       <div>
//                         <span className="font-medium dark:text-white">Payment ID:</span>
//                         <span className="ml-2 dark:text-gray-300">{order.stripeSessionId.slice(-8)}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Customer Information */}
//                 <div className="rounded-lg border border-gray-200 dark:border-[#313131] p-6">
//                   <h2 className="text-xl font-semibold mb-4 dark:text-white">Customer Information</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="font-medium dark:text-white">Name:</span>
//                       <span className="ml-2 dark:text-gray-300">{order.user.name}</span>
//                     </div>
//                     <div>
//                       <span className="font-medium dark:text-white">Email:</span>
//                       <span className="ml-2 dark:text-gray-300">{order.user.email}</span>
//                     </div>
//                     {order.customerPhone && (
//                       <div>
//                         <span className="font-medium dark:text-white">Phone:</span>
//                         <span className="ml-2 dark:text-gray-300">{order.customerPhone}</span>
//                       </div>
//                     )}
//                     {order.companyName && (
//                       <div>
//                         <span className="font-medium dark:text-white">Company:</span>
//                         <span className="ml-2 dark:text-gray-300">{order.companyName}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Business Information */}
//                 <div className="rounded-lg border border-gray-200 dark:border-[#313131] p-6">
//                   <h2 className="text-xl font-semibold mb-4 dark:text-white">Business Information</h2>
//                   <div className="space-y-4">
//                     {order.businessField && order.businessField.length > 0 && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Business Fields:</span>
//                         <div className="flex flex-wrap gap-2">
//                           {order.businessField.map((field, idx) => (
//                             <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                               {field}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     {order.hasDomain && (
//                       <div>
//                         <span className="font-medium dark:text-white">Has Domain:</span>
//                         <span className="ml-2 dark:text-gray-300">{order.hasDomain === 'yes' ? 'Yes' : 'No'}</span>
//                         {order.domainName && (
//                           <div className="mt-1">
//                             <span className="font-medium dark:text-white">Domain:</span>
//                             <span className="ml-2 dark:text-gray-300">{order.domainName}</span>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {order.hasSocialMedia && (
//                       <div>
//                         <span className="font-medium dark:text-white">Has Social Media:</span>
//                         <span className="ml-2 dark:text-gray-300">{order.hasSocialMedia === 'yes' ? 'Yes' : 'No'}</span>
//                         {order.socialMediaAccounts && order.socialMediaAccounts.length > 0 && (
//                           <div className="mt-1">
//                             <span className="font-medium dark:text-white">Social Media Accounts:</span>
//                             <div className="flex flex-wrap gap-2 mt-1">
//                               {order.socialMediaAccounts.map((account, idx) => (
//                                 <span key={idx} className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
//                                   {account}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Package Answers */}
//                 {order.packageAnswers && Object.keys(order.packageAnswers).length > 0 && (
//                   <div className="rounded-lg border border-gray-200 dark:border-[#313131] p-6">
//                     <h2 className="text-xl font-semibold mb-4 dark:text-white">Package Requirements</h2>
//                     <div className="space-y-3">
//                       {Object.entries(order.packageAnswers).map(([key, value]) => (
//                         <div key={key}>
//                           <span className="font-medium dark:text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
//                           <div className="ml-4 mt-1">
//                             {Array.isArray(value) ? (
//                               <div className="flex flex-wrap gap-2">
//                                 {value.map((item, idx) => (
//                                   <span key={idx} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//                                     {item}
//                                   </span>
//                                 ))}
//                               </div>
//                             ) : (
//                               <span className="dark:text-gray-300">{String(value)}</span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Project Details */}
//                 <div className="rounded-lg border border-gray-200 dark:border-[#313131] p-6">
//                   <h2 className="text-xl font-semibold mb-4 dark:text-white">Project Details</h2>
//                   <div className="space-y-4">
//                     {order.projectDescription && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Project Description:</span>
//                         <p className="dark:text-gray-300 whitespace-pre-wrap">{order.projectDescription}</p>
//                       </div>
//                     )}
                    
//                     {order.specialRequirements && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Special Requirements:</span>
//                         <p className="dark:text-gray-300 whitespace-pre-wrap">{order.specialRequirements}</p>
//                       </div>
//                     )}
                    
//                     {order.exampleSites && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Example Sites:</span>
//                         <p className="dark:text-gray-300 whitespace-pre-wrap">{order.exampleSites}</p>
//                       </div>
//                     )}
                    
//                     {order.additionalNotes && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Additional Notes:</span>
//                         <p className="dark:text-gray-300 whitespace-pre-wrap">{order.additionalNotes}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Pricing Breakdown */}
//                 <div className="rounded-lg border border-gray-200 dark:border-[#313131] p-6">
//                   <h2 className="text-xl font-semibold mb-4 dark:text-white">Pricing Breakdown</h2>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="dark:text-white">Package Price:</span>
//                       <span className="font-medium dark:text-gray-300">{formatPrice(order.packagePrice)}</span>
//                     </div>
                    
//                     {order.addOnsPrice > 0 && (
//                       <div className="flex justify-between">
//                         <span className="dark:text-white">Add-ons:</span>
//                         <span className="font-medium dark:text-gray-300">{formatPrice(order.addOnsPrice)}</span>
//                       </div>
//                     )}
                    
//                     {order.selectedAddons && order.selectedAddons.length > 0 && (
//                       <div>
//                         <span className="font-medium dark:text-white block mb-2">Selected Add-ons:</span>
//                         <div className="flex flex-wrap gap-2">
//                           {order.selectedAddons.map((addon, idx) => (
//                             <span key={idx} className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
//                               {addon}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     <div className="border-t pt-3 flex justify-between text-lg font-bold">
//                       <span className="dark:text-white">Total:</span>
//                       <span className="dark:text-white">{formatPrice(order.totalPrice)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import OrderDetailClient from "./_components/OrderDetailClient";
import { getOrderById } from "@/app/action/order-action";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const orderResult = await getOrderById(id);

  if (orderResult.error) {
    return <div>Error: {orderResult.error}</div>;
  }

  if (!orderResult.order) {
    return <div>Order not found</div>;
  }

  return <OrderDetailClient order={orderResult.order} />;
}
