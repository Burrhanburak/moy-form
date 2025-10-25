"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconChevronDown,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";

interface PreferencesProps {
  user: {
    email: string | null;
    provider?: string | null; // "google" | "email" gibi
  };
}

export default function Preferences({ user }: PreferencesProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const isGoogle = user?.provider === "google";
  const isEmail = user?.provider === "email";

  return (
    <div className="flex flex-col gap-4 p-5 h-full w-full">
      <main className="flex flex-col grow">
        <div className="flex flex-row gap-2 h-full w-full">
          <div className="flex flex-col w-full items-center rounded-2xl border border-gray-200 px-4 md:px-8 md:overflow-y-auto md:bg-white dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs">
            <div className="flex flex-col items-center md:gap-y-8 max-w-none">
              {/* Header */}
              <div className="flex flex-col gap-4 py-8 w-full md:flex-row md:items-center md:justify-between">
                <h4 className="text-2xl font-medium dark:text-white">
                  Preferences
                </h4>
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
                          <DropdownMenuRadioGroup
                            value={resolvedTheme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              System
                            </DropdownMenuRadioItem>
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
                  {/* Google */}
                  <ConnectionRow
                    name="Google"
                    description={
                      isGoogle
                        ? `Signed in with Google (${user.email})`
                        : "Connect your Google account for easier login."
                    }
                    icon={<IconBrandGoogle className="size-6" />}
                    status={isGoogle ? "current" : undefined}
                    action={
                      !isGoogle && (
                        <Link
                          href="/api/auth/signin/google"
                          className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
                        >
                          Connect
                        </Link>
                      )
                    }
                  />

                  {/* Email */}
                  <ConnectionRow
                    name="Email"
                    description={
                      isEmail
                        ? `Signed in with Email (${user.email})`
                        : "You can sign in using your email."
                    }
                    icon={<IconMail className="size-6" />}
                    status={isEmail ? "current" : undefined}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ✅ Reusable row component
function ConnectionRow({
  name,
  description,
  icon,
  action,
  status,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  status?: "current";
}) {
  return (
    <div className="border-t border-gray-200 p-5 first:border-t-0 dark:border-[#313131] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-medium flex items-center gap-2">
            {name}
            {status === "current" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Current
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </div>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
