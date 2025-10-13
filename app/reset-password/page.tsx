import React from 'react'
import { ResetPasswordFrom } from '@/components/Form/ResetPasswordFrom'
import { Suspense } from 'react';
import { Loader } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh w-full  p-6 md:p-10 bg-[#171717]">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className='flex items-center justify-center h-svh'><Loader className='w-8 h-8 text-[#FF4D00] animate-spin' /></div>}>
          <ResetPasswordFrom />
        </Suspense>
      </div>
    </div>
    
  )
}