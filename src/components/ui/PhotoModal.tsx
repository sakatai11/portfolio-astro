import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { PhotoModalProps } from '@/types/index'

export default function PhotoModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: PhotoModalProps) {
  const image = images[currentIndex]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-white/[0.94]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-10 right-10 z-20 cursor-pointer p-2"
          aria-label="閉じる"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="1" y1="1" x2="19" y2="19" />
            <line x1="19" y1="1" x2="1" y2="19" />
          </svg>
        </button>

        {/* Prev area */}
        <button
          onClick={onPrev}
          className="absolute top-0 left-0 z-10 hidden h-full w-1/2 cursor-w-resize items-center pl-10 opacity-0 transition-opacity duration-600 hover:opacity-100 lg:flex"
          aria-label="前の画像"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="15,4 7,12 15,20" />
          </svg>
        </button>

        {/* Next area */}
        <button
          onClick={onNext}
          className="absolute top-0 right-0 z-10 hidden h-full w-1/2 cursor-e-resize items-center justify-end pr-10 opacity-0 transition-opacity duration-600 hover:opacity-100 lg:flex"
          aria-label="次の画像"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="9,4 17,12 9,20" />
          </svg>
        </button>

        {/* Image */}
        <picture className="flex max-w-[900px] items-center justify-center min-[1475px]:max-w-[1125px]">
          <source srcSet={`${image.url}?fm=webp`} type="image/webp" />
          <img
            src={image.url}
            alt={`image${currentIndex + 1}`}
            width={image.width}
            height={image.height}
            className="max-h-[calc(100vh-40px)] object-contain"
          />
        </picture>

        {/* Counter */}
        <span className="absolute bottom-10 left-10 text-sm tracking-widest">
          {currentIndex + 1} / {images.length}
        </span>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
