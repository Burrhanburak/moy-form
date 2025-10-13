'use client'

import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from 'lucide-react'

type TBreadCrumbProps = {
  homeElement: ReactNode,
  separator: ReactNode,
  containerClasses?: string,
  listClasses?: string,
  activeClasses?: string,
  capitalizeLinks?: boolean
}

const NextBreadcrumb = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks
}: TBreadCrumbProps) => {
  const paths = usePathname()
  let pathNames = paths.split('/').filter(path => path)

  if (pathNames[0] === 'dashboard') {
    pathNames = pathNames.slice(1)
  }

  const isIdLike = (str: string) =>
    str.length > 12 && /^[a-zA-Z0-9_-]+$/.test(str)

  return (
    <Breadcrumb className="flex items-center gap-x-1">
      <BreadcrumbList className={`flex flex-wrap items-center gap-x-1 ${containerClasses}`}>
        {/* Home = Dashboard */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="text-sm">
              {homeElement}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathNames.map((link, index) => {
          const href = `/dashboard/${pathNames.slice(0, index + 1).join('/')}`
          const itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses
          const itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1)
            : link

          const idLike = isIdLike(link)

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={href}
                    className={`text-sm block ${
                      idLike
                        ? 'break-words whitespace-normal max-w-full'
                        : 'truncate max-w-[120px]'
                    } ${itemClasses}`}
                    title={itemLink}
                  >
                    {itemLink}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default NextBreadcrumb
