"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { IconBrandGithub, IconBrandGoogle, IconChevronDown, IconMail } from "@tabler/icons-react"
import Link from "next/link"

export default function Preferences() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4 p-5 h-full w-full">
      <main className="flex flex-col grow">
        <div className="flex flex-row gap-2 h-full w-full">
          <div className="flex flex-col w-full items-center rounded-2xl border border-gray-200 px-4 md:px-8 md:overflow-y-auto md:bg-white dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs">
            <div className="flex flex-col items-center md:gap-y-8 max-w-none">

              {/* Header */}
              <div className="flex flex-col gap-4 py-8 w-full md:flex-row md:items-center md:justify-between">
                <h4 className="text-2xl font-medium dark:text-white">Preferences</h4>
              </div>

              {/* General Settings */}
              <section className="flex flex-col w-full pb-8 gap-y-12">
                <div className="flex flex-col gap-4 w-full">
                  <h2 className="text-lg font-medium">General</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Configure the general settings for your account
                  </p>

                  {/* Theme Selector */}
                  <div className="w-full overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-[#313131] bg-transparent dark:bg-[#171719]">
                    <div className="border-t border-gray-200 p-5 first:border-t-0 dark:border-[#313131] flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium">Theme</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          Override your browser's preferred theme settings
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-between gap-2 h-10 px-4 py-2 rounded-xl text-sm font-medium text-black dark:text-white bg-white dark:bg-[#171719] border border-gray-200 dark:border-[#313131] dark:hover:bg-[#212121] transition-colors">
                            <span className="capitalize">{resolvedTheme}</span>
                            <IconChevronDown className="size-4" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-40">
                          <DropdownMenuLabel>Select theme</DropdownMenuLabel>
                          <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
                            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Connections */}
              <section className="flex flex-col w-full gap-y-6 mb-7">
                <h2 className="text-lg font-medium">Account Connections</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage third-party connections to your account
                </p>

                <div className="flex flex-col w-full overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-[#313131] bg-transparent dark:bg-[#171719]">
                  {/* GitHub */}
                  <ConnectionRow
                    name="Connect GitHub"
                    description="Sync your profile and get a better experience."
                    icon={
                      <IconBrandGithub className="size-6" />
                    }
                    action={
                      <Link
                        href=""
                        className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
                      >
                        Connect
                      </Link>
                    }
                  />

                  {/* Google */}
                  <ConnectionRow
                    name="burrhanozcaan@gmail.com"
                    description="You can sign in with your Google account."
                    icon={
                      <IconBrandGoogle className="size-6" />
                    }
                    action={
                      <Link
                        href=""
                        className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
                      >
                        Connect
                      </Link>
                    }
                  />

                  {/* OTP Email */}
                  <ConnectionRow
                    name="burrhanozcaan@gmail.com"
                    description="You can sign in with OTP codes sent to your email."
                    icon={
                      <IconMail className="size-6" />
                    }
                    action={
                      <button className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10">
                      Change Email
                      </button>
                    }
                  />
                </div>
              </section>

              {/* Notification Recipients */}
              <section className="flex flex-col w-full gap-y-6 mb-7">
                <h2 className="text-lg font-medium">Notification Recipients</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage the devices which receive notifications
                </p>
                <div className="w-full overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-[#313131] p-5 bg-transparent dark:bg-[#171719]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You don't have any active Notification Recipients.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Reusable component for connections
function ConnectionRow({ name, description, icon, action }: any) {
  return (
    <div className="border-t border-gray-200 p-5 first:border-t-0 dark:border-[#313131] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>{icon}</div>
      <div className="grow">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
