import './globals.css'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata = {
  title: 'Nikhil Kumar | Software Engineer',
  description:
    'Nikhil Kumar — Software Engineer, Full-Stack Developer, IIT Palakkad. Building scalable web apps with React, TypeScript, Python.',
  keywords: ['Nikhil Kumar', 'Software Engineer', 'Full Stack Developer', 'IIT Palakkad', 'React', 'TypeScript'],
  openGraph: {
    title: 'Nikhil Kumar | Software Engineer',
    description: 'Software Engineer building impactful digital products.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#030712] text-slate-50 font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(10,16,34,0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(139,92,246,0.3)',
              backdropFilter: 'blur(20px)',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  )
}
