"use client"

import { Boxes, ChevronDownIcon, PackageIcon, PlusIcon, SearchIcon, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { DashboardCommandMenu } from "@/components/benefit-command-menu";
import Link from "next/link";

export default function BenefitsPage() {
  const [selectedStatus, setSelectedStatus] = useState("");
  return (
    <div className="relative flex h-full w-full flex-col gap-y-4">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border-gray-200 px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col max-w-(--breakpoint-xl)">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
                  Benefits
                </h4>
              </div>

              <div className="flex w-full flex-col pb-8" style={{ opacity: 1 }}>
                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="relative flex flex-1 flex-row rounded-full">

                        <DashboardCommandMenu />
                       
                        <div className="dark:text-white pointer-events-none absolute  inset-y-0 left-0 z-10 flex items-center pl-3 text-gray-500">
                        <SearchIcon className="size-4 shrink-0 opacity-50 text-black dark:text-white" />
                        </div>
                      </div>
                      <Select
                        onValueChange={setSelectedStatus}
                        value={selectedStatus}
                        
                        defaultValue={selectedStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active" >Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* <button
                        type="button"
                        role="combobox"
                        aria-controls="radix-_r_iq_"
                        aria-expanded="false"
                        aria-autocomplete="none"
                        dir="ltr"
                        data-state="closed"
                        className="ring-offset-background placeholder:text-muted-foreground dark:bg-[#171719] dark:hover:bg-[#171719] dark:border-[#313131] shadow-xs text-black dark:text-white focus:ring-ring h-10 items-center justify-between py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-polar-800 dark:hover:bg-polar-700 dark:border-polar-700 shadow-xs flex flex-row gap-x-2 rounded-xl border border-gray-200 bg-white px-3 transition-colors hover:bg-gray-50 w-full md:max-w-fit"
                      >
                        <span style={{ pointerEvents: "none" }}>Active</span>
                        <ChevronDownIcon className="size-4 shrink-0 opacity-50 fill-black text-black dark:text-white" />
                      </button> */}
                    </div>

                    <Link className="w-full md:w-fit" href="/dashboard/benefits/create-package">
                      <button
                        className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 hover:bg-[#171719] relative inline-flex items-center font-medium select-none dark:bg-[#171719] dark:hover:bg-[#171719] justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-[#171719] text-white hover:opacity-90 transition-opacity duration-100 border border-white/10 h-10 px-4 py-2 rounded-xl text-sm w-full"
                        type="button"
                        role="link"
                      >
                        <div className="flex flex-row items-center gap-x-2 md:w-fit">
                        <PlusIcon className="size-4 shrink-0 opacity-50 fill-white text-white dark:text-white" />
                          <span>New Benefit</span>
                        </div>
                      </button>
                    </Link>
                  </div>

                  <div className="md:dark:bg-[#171719] lg:rounded-4xl  sm: dark:border-[#313131] w-full md:rounded-xl md:border md:border-transparent md:bg-gray-50 md:p-8 items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
                 

                    <div className="flex flex-col items-center gap-y-6">
                      <div className="flex flex-col items-center gap-y-2">
                      <Boxes className="size-10 shrink-0 opacity-50 fill-black dark:text-white" />
                        <h3 className="text-lg font-medium">No benefits found</h3>
                        <p className="dark:text-polar-500 text-gray-500">
                          Start selling digital benefits today
                        </p>
                      </div>
                      <Link href="/dashboard/benefits/create-package">
                        <button
                          className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 relative inline-flex items-center font-medium select-none justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap text-black dark:text-white hover:bg-gray-200 dark:bg-[#171719] dark:hover:bg-[#171719] bg-gray-100 border dark:border-white/5 border-black/4 h-10 px-4 py-2 rounded-xl text-sm"
                          type="button"
                          role="link"
                        >
                          <div className="flex flex-row items-center">
                            <span>Create Benefit</span>
                          </div>
                        </button>
                      </Link>
                      <div className="flex flex-col items-center gap-y-2">
                        <p className="text-gray-500 dark:text-white">or create a new add and tools package</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
