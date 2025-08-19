'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Users, 
  Send, 
  Settings, 
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  BarChart,
  FolderOpen,
  UserPlus
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [messageCount, setMessageCount] = useState(548119)
  const [notifications, setNotifications] = useState(3)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Pages', href: '/dashboard/pages', icon: FolderOpen },
    { name: 'Inbox', href: '/dashboard/inbox', icon: MessageSquare },
    { name: 'Bulk Messages', href: '/dashboard/broadcast', icon: Send },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Groups', href: '/dashboard/groups', icon: UserPlus },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = () => {
    // Clear cookies and redirect
    document.cookie = 'fb_access_token=; Max-Age=0'
    document.cookie = 'page_token=; Max-Age=0'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Top Navigation Bar */}
      <nav className="bg-[#192734] border-b border-[#38444d] fixed w-full top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#273340]"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center ml-4">
                <MessageSquare className="text-[#1d9bf0] w-8 h-8" />
                <span className="ml-2 text-xl font-bold text-white">Messenger Tool</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* License Status */}
              <div className="hidden md:flex items-center bg-[#273340] px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">License Active</span>
                <span className="ml-2 text-sm font-bold text-[#1d9bf0]">
                  {messageCount.toLocaleString()} messages
                </span>
              </div>

              {/* Get More Messages Button */}
              <button className="hidden md:block bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get more messages...
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#273340] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1d9bf0] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">EA</span>
                  </div>
                  <span className="hidden md:block text-white text-sm">Ethan Brooks</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#192734] rounded-lg shadow-lg border border-[#38444d] py-2">
                    <Link href="/dashboard/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#273340] hover:text-white">
                      Account Settings
                    </Link>
                    <Link href="/dashboard/billing" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#273340] hover:text-white">
                      <CreditCard size={16} className="inline mr-2" />
                      Billing & License
                    </Link>
                    <hr className="my-2 border-[#38444d]" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#273340] hover:text-white"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#192734] border-r border-[#38444d] transform transition-transform duration-200 ease-in-out mt-16 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="flex flex-col h-full py-4">
          <div className="flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#1d9bf0] text-white'
                      : 'text-gray-300 hover:bg-[#273340] hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Stats Section */}
          <div className="px-4 py-4 border-t border-[#38444d]">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Messages Sent</span>
                <span className="text-white font-bold">6,978,507</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Pages</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Leads</span>
                <span className="text-white font-bold">45,832</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-200 ease-in-out pt-16 ${
        'lg:ml-64'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
