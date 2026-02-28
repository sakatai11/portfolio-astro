import { useCallback, useEffect, useState } from 'react'
import type { PhotoGalleryProps } from '@/types/index'
import { isPortrait32 } from '@/utils'
import Modal from './Modal'

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)

  const handleClose = useCallback(() => setSelectedIndex(undefined), [])

  const handlePrev = useCallback(
    () =>
      setSelectedIndex((prev) =>
        prev !== undefined ? (prev - 1 + images.length) % images.length : undefined
      ),
    [images.length]
  )

  const handleNext = useCallback(
    () =>
      setSelectedIndex((prev) =>
        prev !== undefined ? (prev + 1) % images.length : undefined
      ),
    [images.length]
  )

  useEffect(() => {
    if (selectedIndex === undefined) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, handleClose, handlePrev, handleNext])

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-3">
        {images.map(({ url, width, height }, index) => (
          <li key={url} className="p-[4.2vw]">
            <button
              type="button"
              className="group h-full w-full cursor-zoom-in overflow-hidden"
              onClick={() => setSelectedIndex(index)}
            >
              <picture className="flex h-full w-full items-center justify-center">
                <source srcSet={`${url}?fm=webp`} type="image/webp" />
                <img
                  src={url}
                  alt={`image${index + 1}`}
                  width={width}
                  height={height}
                  className={`${isPortrait32(width, height) ? 'aspect-[2/3] w-[70%]' : 'aspect-[3/2] w-full'} object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80`}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </button>
          </li>
        ))}
      </ul>

      {selectedIndex !== undefined && (
        <Modal
          images={images}
          currentIndex={selectedIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
