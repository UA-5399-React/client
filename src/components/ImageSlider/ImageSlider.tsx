import { useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export const ImageSlider = ({ images, alt }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const hasMultiple = images.length > 1;

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg bg-gray-200">
        <ImageIcon className="h-24 w-24 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative h-[500px] overflow-hidden rounded-lg bg-gray-200 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/90 shadow-md transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>

            <button
              onClick={next}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/90 shadow-md transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={clsx(
                'h-2 cursor-pointer rounded-full border-none transition-all',
                i === currentIndex
                  ? 'w-6 bg-gray-800'
                  : 'w-2 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
