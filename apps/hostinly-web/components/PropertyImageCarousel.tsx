"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
}

export default function PropertyImageCarousel({
  images,
  title,
}: PropertyImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (delta: number) => {
      if (images.length <= 1) return;
      setActiveIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => goTo(1), 5000);
    return () => clearInterval(id);
  }, [images.length, goTo]);

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/10] min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden bg-[hsl(195,20%,92%)] shadow-strong ring-1 ring-black/5">
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            pointerEvents: i === activeIndex ? "auto" : "none",
          }}
        >
          <Image
            src={img}
            alt={`${title} - photo ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous image"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-[hsl(195,60%,25%)] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next image"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-[hsl(195,60%,25%)] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
