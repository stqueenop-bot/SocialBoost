'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BannerData {
  id: string;
  imageUrl: string;
  buttonLink?: string;
}

// Placeholder banners shown while backend loads or if no banners exist
const FALLBACK_BANNERS: BannerData[] = [
  { id: 'placeholder-1', imageUrl: '/banner-placeholder.png', buttonLink: '/instagram' },
];

export default function Banner() {
  const [banners, setBanners] = useState<BannerData[]>(FALLBACK_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        // Only use banners that have an imageUrl
        const withImages: BannerData[] = (data.data ?? []).filter(
          (b: any) => b.imageUrl && b.active !== false
        );
        if (withImages.length > 0) setBanners(withImages);
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % banners.length);
  }, [currentIndex, banners.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + banners.length) % banners.length);
  }, [currentIndex, banners.length, goToSlide]);

  // Auto-play every 5 s
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const id = setInterval(nextSlide, 5000);
    return () => clearInterval(id);
  }, [banners.length, isPaused, nextSlide]);

  const banner = banners[currentIndex];

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-2xl shadow-md bg-black">

        {/* Banner image */}
        <Link href={banner.buttonLink ?? '#'} className="block w-full">
          <div
            className={`relative w-full transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
          >
            <Image
              src={banner.imageUrl}
              alt="Promotional banner"
              width={2000}
              height={734}
              className="w-full h-auto block"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Navigation arrows (only when multiple banners) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-20"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-20"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex
                ? 'bg-indigo-500 w-6'
                : 'bg-slate-300 hover:bg-slate-400 w-1.5'
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
