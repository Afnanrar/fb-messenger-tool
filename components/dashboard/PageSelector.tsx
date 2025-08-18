'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Page {
  id: string
  name: string
  category: string
}

interface PageSelectorProps {
  onPageSelect: (page: Page) => void
  selectedPage?: Page
}

export function PageSelector({ onPageSelect, selectedPage }: PageSelectorProps) {
  const [pages, setPages] = useState<Page[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      setPages(data)
      
      // Auto-select first page if none selected
      if (data.length > 0 && !selectedPage) {
        onPageSelect(data[0])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (page: Page) => {
    onPageSelect(page)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md w-48"></div>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No pages found</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={fetchPages}
        >
          Refresh Pages
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-48 justify-between"
      >
        <div className="flex items-center">
          <Facebook className="mr-2 h-4 w-4" />
          {selectedPage?.name || 'Select Page'}
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handlePageSelect(page)}
              className={`
                w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                ${selectedPage?.id === page.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
              `}
            >
              <div className="font-medium">{page.name}</div>
              <div className="text-xs text-gray-500">{page.category}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
