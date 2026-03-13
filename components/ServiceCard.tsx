
'use client';

import Link from 'next/link';
import { Service } from '@/admin_frontend/lib/types';
import { ArrowRight } from 'lucide-react';
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaSpotify,
  FaXTwitter,
  FaTelegram,
} from 'react-icons/fa6';
import { SiNetflix } from 'react-icons/si';

function AmazonPrimeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#00A8E1" />
      <text x="20" y="28" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">a</text>
    </svg>
  );
}

function getPlatformIcon(slug: string, size = 20) {
  switch (slug) {
    case 'instagram':    return <FaInstagram size={size} className="text-pink-500" />;
    case 'youtube':      return <FaYoutube size={size} className="text-red-500" />;
    case 'facebook':     return <FaFacebook size={size} className="text-blue-600" />;
    case 'twitter':      return <FaXTwitter size={size} className="text-slate-700" />;
    case 'spotify':      return <FaSpotify size={size} className="text-green-500" />;
    case 'telegram':     return <FaTelegram size={size} className="text-sky-500" />;
    case 'netflix':      return <SiNetflix size={size} className="text-red-600" />;
    case 'amazon-prime': return <AmazonPrimeIcon size={size} />;
    default:             return <span style={{ fontSize: size }}>📦</span>;
  }
}

const cardConfig: Record<string, {
  cardBg: string; iconBg: string; pillBg: string; btnBg: string; strip: string;
}> = {
  instagram:      { cardBg: 'from-pink-50/70 to-purple-50/50',   iconBg: 'bg-pink-100/80',   pillBg: 'bg-pink-100 text-pink-600',   btnBg: 'from-pink-500 via-rose-500 to-purple-600', strip: 'from-pink-400 to-purple-500'   },
  youtube:        { cardBg: 'from-red-50/70 to-orange-50/50',    iconBg: 'bg-red-100/80',    pillBg: 'bg-red-100 text-red-600',     btnBg: 'from-red-500 to-red-700',                  strip: 'from-red-400 to-red-600'       },
  facebook:       { cardBg: 'from-blue-50/70 to-sky-50/50',      iconBg: 'bg-blue-100/80',   pillBg: 'bg-blue-100 text-blue-600',   btnBg: 'from-blue-500 to-blue-700',                strip: 'from-blue-400 to-blue-600'     },
  netflix:        { cardBg: 'from-red-50/70 to-rose-50/50',      iconBg: 'bg-red-100/80',    pillBg: 'bg-red-100 text-red-700',     btnBg: 'from-red-600 to-red-900',                  strip: 'from-red-600 to-rose-900'      },
  'amazon-prime': { cardBg: 'from-sky-50/70 to-cyan-50/50',      iconBg: 'bg-sky-100/80',    pillBg: 'bg-sky-100 text-sky-600',     btnBg: 'from-sky-400 to-blue-600',                 strip: 'from-sky-400 to-blue-500'      },
  spotify:        { cardBg: 'from-green-50/70 to-emerald-50/50', iconBg: 'bg-green-100/80',  pillBg: 'bg-green-100 text-green-700', btnBg: 'from-green-500 to-emerald-600',            strip: 'from-green-400 to-emerald-500' },
  telegram:       { cardBg: 'from-sky-50/70 to-cyan-50/50',      iconBg: 'bg-sky-100/80',    pillBg: 'bg-sky-100 text-sky-600',     btnBg: 'from-sky-400 to-cyan-600',                 strip: 'from-sky-400 to-cyan-500'      },
  twitter:        { cardBg: 'from-slate-50/70 to-gray-50/50',    iconBg: 'bg-slate-100/80',  pillBg: 'bg-slate-100 text-slate-600', btnBg: 'from-slate-600 to-slate-800',              strip: 'from-slate-500 to-slate-700'   },
};

const defaultCfg = {
  cardBg: 'from-indigo-50/70 to-blue-50/50', iconBg: 'bg-indigo-100/80',
  pillBg: 'bg-indigo-100 text-indigo-600',   btnBg:  'from-indigo-500 to-indigo-700',
  strip:  'from-indigo-400 to-indigo-600',
};

export default function ServiceCard({ service }: { service: Service }) {
  const cfg = cardConfig[service.slug] ?? defaultCfg;
  const pkgCount = service.packages.length;

  return (
    <Link href={`/${service.slug}`} className="block group focus:outline-none">

      {/* ── MOBILE / SM (< lg) ── horizontal pill row ── */}
      <div className={`lg:hidden relative overflow-hidden bg-white border border-slate-100 rounded-xl
                      flex items-center gap-3 px-3 py-2.5
                      shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]`}>
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${cfg.strip} rounded-l-xl`} />
        <div className={`ml-1.5 w-9 h-9 flex-shrink-0 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
          {getPlatformIcon(service.slug, 18)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[12px] font-bold text-slate-800">{service.name}</h3>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.pillBg}`}>{pkgCount}</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">{service.description}</p>
        </div>
        <div className={`flex-shrink-0 bg-gradient-to-r ${cfg.btnBg} text-white
                         text-[10px] font-bold px-2.5 py-1.5 rounded-lg
                         flex items-center gap-1 group-hover:opacity-90 transition-opacity`}>
          Plans <ArrowRight size={10} />
        </div>
      </div>

      {/* ── DESKTOP lg+ ── compact tinted vertical card ── */}
      <div className={`hidden lg:block relative bg-gradient-to-b ${cfg.cardBg}
                        border border-slate-100 rounded-2xl overflow-hidden
                        shadow-sm hover:shadow-md hover:-translate-y-0.5
                        transition-all duration-200`}>

        {/* Plans badge — top right corner */}
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.pillBg}`}>
          {pkgCount} plans
        </span>

        <div className="flex flex-col items-center text-center px-3 pt-4 pb-3">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-2
                           group-hover:scale-105 transition-transform duration-200`}>
            {getPlatformIcon(service.slug, 22)}
          </div>
          {/* Name */}
          <h3 className="text-[13px] font-extrabold text-slate-800 leading-tight">{service.name}</h3>
          {/* Description */}
          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2 px-1 mb-3">
            {service.description}
          </p>
          {/* CTA */}
          <div className={`w-full bg-gradient-to-r ${cfg.btnBg} text-white
                           text-[11px] font-bold py-2 rounded-xl
                           flex items-center justify-center gap-1
                           group-hover:opacity-95 transition-opacity`}>
            View Plans <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

    </Link>
  );
}
