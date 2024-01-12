"use client";
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Dialog, Menu, Transition } from '@headlessui/react'

import {
  RiHome4Line,
  RiPieChartLine,
  RiSafeLine,
  RiUserHeartLine,
  RiUserSettingsLine,
  RiFolder5Line,
  RiFolderChartLine,
  RiFileList2Line,
  RiCloseLine,
  RiEqualizer2Line,
  RiNotification3Line,
  RiMenuLine,
  RiArrowDownSLine,
  RiListOrdered2,
  RiFolderShield2Line,
} from '@remixicon/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const navigation = [
  { name: 'Home', href: '/dashboard', icon: RiHome4Line },
  { name: 'Team', href: '/dashboard/team', icon: RiUserHeartLine },
  { name: 'SAFEs', href: '/dashboard/safe', icon: RiSafeLine },
  { name: 'Cap table', href: '/dashboard/captable', icon: RiPieChartLine },
  { name: 'Securities', href: '/dashboard/securities', icon: RiFolderShield2Line },
  { name: 'Stakeholders', href: '/dashboard/stakeholders', icon: RiUserSettingsLine },
  { name: 'Documents', href: '/dashboard/documents', icon: RiFolder5Line },
  { name: 'Reports', href: '/dashboard/reports', icon: RiFolderChartLine },
  { name: 'Audits', href: '/dashboard/audits', icon: RiListOrdered2 },
]

const forms = [
  { id: 1, name: '409A Valuation', href: '/dashboard/409a', icon: RiFileList2Line },
  { id: 2, name: 'Form 3921', href: '/dashboard/3921', icon: RiFileList2Line },
]
const userNavigation = [
  { name: 'Your profile', href: '#' },

  { name: 'Sign out', href: '#' },
]

import { cn } from "@/lib/utils"
import { OpenCapLogo } from '@/components/logo';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const currentPath = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    // <div className="bg-[#fafafa]">
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <RiCloseLine className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <OpenCapLogo className="h-7 w-auto" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={cn(
                                  currentPath === item.href
                                    ? 'bg-gray-50 text-primary font-semibold'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6'
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    currentPath === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">Legal</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {forms.map((form) => (
                            <li key={form.name}>
                              <Link
                                href={form.href}
                                className={cn(
                                  currentPath === form.href
                                    ? 'bg-gray-50 text-primary'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50 font-semibold',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6'
                                )}
                              >
                                <form.icon
                                  className={cn(
                                    currentPath === form.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />

                                <span className="truncate">{form.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <Link
                          href="/dashboard/settings"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
                        >
                          <RiEqualizer2Line
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <OpenCapLogo className="h-7 w-auto" />

            <Select>
              <SelectTrigger className="w-[180px] h-8 rounded ml-3 border-none text-md font-semibold">
                <SelectValue placeholder="Acme Inc." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acme">Acme Inc.</SelectItem>
                <SelectItem value="piedPiper">Pied Pieper</SelectItem>
                <SelectItem value="hooli">Hooli</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          currentPath === item.href
                            ? 'bg-gray-50 text-primary font-semibold'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6'
                        )}
                      >
                        <item.icon
                          className={cn(
                            currentPath === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">Legal</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {forms.map((form) => (
                    <li key={form.name}>
                      <Link
                        href={form.href}
                        className={cn(
                          currentPath === form.href
                            ? 'bg-gray-50 text-primary font-semibold'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6'
                        )}
                      >
                        <form.icon
                          className={cn(
                            currentPath === form.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{form.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/dashboard/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  <RiEqualizer2Line
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72 ">
        <div className="sticky top-0 z-40 w-full border-gray-200 bg-white border-b shadow-sm lg:shadow-none">
          <div className="lg:px-4 flex h-16 lg:mx-auto lg:max-w-7xl items-center gap-x-4 px-4 sm:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <RiMenuLine className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <RiNotification3Line className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://randomuser.me/api/portraits/women/0.jpg"
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm leading-6 text-primary" aria-hidden="true">
                        Mary Lopez
                      </span>
                      <RiArrowDownSLine className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={cn(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-primary'
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>

        <main className="min-h-screen m-5">
          <div className="mx-auto max-w-7xl p-2 sm:p-4 lg:p-5 m-5 bg-white border rounded shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
