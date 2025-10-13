"use client"

import React from 'react'
import {useSession} from '@/lib/auth-client'
import { Button } from './ui/button'
import Link from 'next/link'

export default function GetStarterButon() {
  const {data: session, isPending, error} = useSession()
 
    if (isPending) {
      return <Button variant="outline" className="w-full">Get Starter</Button>
    }
    if (error) {
      return <div>Error: {error.message}</div>
    }
  
    const href = session ? '/dashboard' : '/sign-in'

    return (
      <div>
        <Button variant="outline" className="w-full" asChild>
          <Link href={href}>Get Starter</Link>
        </Button>
      </div>

    )
 
  }
