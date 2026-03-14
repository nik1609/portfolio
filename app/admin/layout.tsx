import AdminSidebar from '@/components/admin/sidebar'

export const metadata = { title: 'Admin | Nikhil Kumar' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 ml-0 md:ml-60">
        <div className="p-5 sm:p-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
