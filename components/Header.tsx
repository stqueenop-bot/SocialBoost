'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Sidebar from './Sidebar'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 bg-white sticky top-0 z-50 shadow-sm">

        {/* Logo — replace /logo.png with your own image */}
        <a href="/" className="flex items-center h-9">
          <Image
            src="/logo.png"
            alt="Fastxera Logo"
            width={200}
            height={200}
            className="object-contain h-9 w-auto mix-blend-saturation"
            priority
            unoptimized
          />
        </a>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-1.5 hover:bg-slate-100 rounded-md transition text-gray-700"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
