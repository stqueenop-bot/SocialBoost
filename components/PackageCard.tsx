'use client';

import { Package } from '@/admin_frontend/lib/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface PackageCardProps {
  package: Package;
  serviceId: string;
  serviceName: string;
  accentColor: string;
  accentText: string;
}

export default function PackageCard({
  package: pkg,
  serviceId,
  serviceName,
  accentColor,
  accentText,
}: PackageCardProps) {
  const isBestSeller = (pkg as any).isBestSeller;
  const badge = (pkg as any).badge;

  return (
    <div className={`
      relative bg-white border rounded-xl px-3.5 py-3 sm:px-4 sm:py-4
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
      ${isBestSeller ? 'border-indigo-300 shadow-indigo-100 shadow-sm' : 'border-slate-200'}
    `}>

      {/* Badge */}
      {(isBestSeller || badge) && (
        <div className={`
          absolute -top-2 left-3.5 text-[9px] font-bold px-2 py-0.5 rounded-full
          ${isBestSeller ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'}
          flex items-center gap-1
        `}>
          {isBestSeller ? <><Star size={8} className="fill-white" />Best Seller</> : badge}
        </div>
      )}

      {/* Top row: title + category tag */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="text-[13px] sm:text-sm font-bold text-slate-800 leading-snug">
          {pkg.quantityLabel}
        </h3>
        {(pkg as any).serviceCategory && (
          <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
            {(pkg as any).serviceCategory.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-500 mb-3 leading-snug">
        {pkg.description}
      </p>

      {/* Divider */}
      <div className="border-t border-slate-100 mb-2.5" />

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm sm:text-base font-extrabold ${accentText}`}>
            ₹{pkg.price}
          </div>
          <div className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
            per order
          </div>
        </div>

        <Link
          href={`/checkout?service=${serviceId}&package=${pkg.id}&serviceName=${encodeURIComponent(serviceName)}`}
          className={`
            ${accentColor} text-white text-[11px] sm:text-xs font-bold
            px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all active:scale-95
          `}
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}

