import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { PhotoModalProps } from '@/types/index'
import { MODAL_IMAGE_SIZES, buildModalSrcSet } from '@/utils'

export default function PhotoModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: PhotoModalProps) {
  const image = images[currentIndex]

  // モーダルが開いている間、背景のスクロールを無効化。アンマウント時に復元
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
          className="absolute top-0 left-0 z-10 flex h-full w-1/2 cursor-w-resize items-center pl-4 opacity-100 transition-opacity duration-600 lg:pl-16 lg:opacity-0 lg:hover:opacity-100"
          aria-label="前の画像"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="hidden lg:block"
          >
            <polyline points="15,4 7,12 15,20" />
          </svg>
        </button>

        {/* Next area */}
        <button
          onClick={onNext}
          className="absolute top-0 right-0 z-10 flex h-full w-1/2 cursor-e-resize items-center justify-end pr-4 opacity-100 transition-opacity duration-600 lg:pr-10 lg:opacity-0 lg:hover:opacity-100"
          aria-label="次の画像"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="hidden lg:block"
          >
            <polyline points="9,4 17,12 9,20" />
          </svg>
        </button>

        {/* Image */}
        {/* モーダル最大表示幅は 1125px。DPR 2 の端末でも劣化しないよう
            グリッド (q=75) より高い q=80 で、2250px までの srcset を配信する */}
        <picture className="flex max-w-[900px] items-center justify-center min-[1475px]:max-w-[1125px]">
          <source
            srcSet={buildModalSrcSet(image.url, 'webp')}
            sizes={MODAL_IMAGE_SIZES}
            type="image/webp"
          />
          <img
            src={`${image.url}?fm=jpg&w=1600&q=80`}
            srcSet={buildModalSrcSet(image.url, 'jpg')}
            sizes={MODAL_IMAGE_SIZES}
            alt={`image${currentIndex + 1}`}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className="max-h-[calc(100vh-40px)] object-contain"
          />
        </picture>

        {/* Counter (left-16 はサイドバナーと重ならない位置) */}
        <span className="absolute bottom-10 left-16 text-sm tracking-widest">
          {currentIndex + 1} / {images.length}
        </span>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
