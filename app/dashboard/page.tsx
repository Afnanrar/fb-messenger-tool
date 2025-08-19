'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Users, 
  Send, 
  TrendingUp,
  Activity,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [animatedNumbers, setAnimatedNumbers] = useState({
    messages: 0,
    leads: 0,
    pages: 0,
    campaigns: 0
  })

  useEffect(() => {
    // Animate numbers on mount
    const targets = {
      messages: 6978507,
      leads: 45832,
      pages: 12,
      campaigns: 127
    }
    
    const duration = 2000
    const steps = 60
    const increment = {
      messages: targets.messages / steps,
      leads: targets.leads / steps,
      pages: targets.pages / steps,
      campaigns: targets.campaigns / steps
    }
    
    let current = 0
    const timer = setInterval(() => {
      current++
      setAnimatedNumbers({
        messages: Math.min(Math.floor(increment.messages * current), targets.messages),
        leads: Math.min(Math.floor(increment.leads * current), targets.leads),
        pages: Math.min(Math.floor(increment.pages * current), targets.pages),
        campaigns: Math.min(Math.floor(increment.campaigns * current), targets.campaigns)
      })
      
      if (current >= steps) clearInterval(timer)
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      title: 'Send Broadcast',
      description: 'Reach all your audience instantly',
      icon: Send,
      color: 'from-purple-500 to-pink-500',
      href: '/dashboard/broadcast'
    },
    {
      title: 'View Analytics',
      description: 'Track your performance metrics',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      href: '/dashboard/analytics'
    },
    {
      title: 'Manage Pages',
      description: 'Connect and manage Facebook pages',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/pages'
    },
    {
      title: 'Lead Management',
      description: 'Organize and segment your leads',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      href: '/dashboard/leads'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0e27] p-6">
      {/* Floating Gradients */}
      <div className="floating-gradient gradient-1"></div>
      <div className="floating-gradient gradient-2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Welcome Back to Command Center
          </h1>
          <p className="text-gray-400 mt-2">Your messaging empire at a glance</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="neon-border">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <Activity className="text-green-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-3xl font-bold text-white mt-2">
                {animatedNumbers.messages.toLocaleString()}
              </p>
              <div className="mt-3 flex items-center text-green-400 text-sm">
                <TrendingUp size={16} className="mr-1" />
                +12.5% from last month
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <MessageSquare size={24} className="text-white" />
              </div>
              <Zap className="text-yellow-400" size={20} />
            </div>
            <p className="text-gray-400 text-sm">Total Leads</p>
            <p className="text-3xl font-bold text-white mt-2">
              {animatedNumbers.leads.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center text-green-400 text-sm">
                <TrendingUp size={16} className="mr-1" />
                +523 today
              </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Target size={24} className="text-white" />
              </div>
              <Award className="text-purple-400" size={20} />
            </div>
            <p className="text-gray-400 text-sm">Active Pages</p>
            <p className="text-3xl font-bold text-white mt-2">
              {animatedNumbers.pages}
            </p>
            <div className="mt-3 text-gray-400 text-sm">
              All systems operational
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Send size={24} className="text-white" />
              </div>
              <Activity className="text-blue-400" size={20} />
            </div>
            <p className="text-gray-400 text-sm">Campaigns</p>
            <p className="text-3xl font-bold text-white mt-2">
              {animatedNumbers.campaigns}
            </p>
            <div className="mt-3 text-gray-400 text-sm">
              98.5% success rate
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="glass-card p-6 text-left hover:scale-105 transition-all duration-300 group"
              >
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
