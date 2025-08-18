import { Sidebar } from '@/components/dashboard/Sidebar'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  )
}
