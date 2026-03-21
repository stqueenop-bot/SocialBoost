'use client'

import React from 'react'
import { Youtube, MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
interface FloatingActionsProps {
  onOpenVideo: () => void
}

/**
 * Floating action buttons for Support and "How to Pay" video.
 * Fixed to the bottom right of the screen.
 */
export function FloatingActions({ onOpenVideo }: FloatingActionsProps) {
  // Common button classes for consistency
  const btnBaseClass = cn(
    "flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300",
    "hover:scale-105 active:scale-95 border group relative overflow-hidden",
    "min-w-[170px] justify-center sm:justify-start"
  )

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-right-10 duration-700">
      
      {/* 24/8 Support Button */}
      <a
        href="https://wa.me/911234567890" 
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          btnBaseClass,
          "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500/30"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageCircle className="w-5 h-5 animate-bounce-subtle" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider">Need Help?</span>
          <span className="font-bold text-sm">24/8 Support</span>
        </div>
        <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </a>

      {/* How to Pay Button */}
      <button
        onClick={onOpenVideo}
        className={cn(
          btnBaseClass,
          "bg-red-600 text-white hover:bg-red-700 border-red-500/30"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Youtube className="w-5 h-5" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] opacity-80 font-medium uppercase tracking-wider">Video Guide</span>
          <span className="font-bold text-sm">How to Pay</span>
        </div>
        <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </button>

      {/* Mobile Backdrop Glow */}
      <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />
    </div>
  )
}
