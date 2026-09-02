import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { PhotoGalleryProps } from '@/types/index'
import { buildImageUrl, buildSrcSet, isPortrait32 } from '@/utils'

// framer-motion 一式を含むため、モーダルを開くまで初期バンドルに含めない
const Modal = lazy(() => import('./Modal'))

// md 以上は 3 カラム。縦長 2:3 は 70% 幅に絞られるため sizes を分ける
const SIZES_LANDSCAPE = '(min-width: 768px) 25vw, 100vw'
const SIZES_PORTRAIT = '(min-width: 768px) 17vw, 100vw'

// ファーストビューに入る先頭数枚は優先読み込みにする
const PRIORITY_COUNT = 3

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  // 現在モーダルで表示している画像のインデックス。未選択時は undefined
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  )

  // モーダルを閉じる
  const handleClose = useCallback(() => setSelectedIndex(undefined), [])

  // 前の画像へ。先頭の場合は末尾へループ
  const handlePrev = useCallback(
    () =>
      setSelectedIndex((prev) =>
        prev !== undefined
          ? (prev - 1 + images.length) % images.length
          : undefined
      ),
    [images.length]
  )

  // 次の画像へ。末尾の場合は先頭へループ
  const handleNext = useCallback(
    () =>
      setSelectedIndex((prev) =>
        prev !== undefined ? (prev + 1) % images.length : undefined
      ),
    [images.length]
  )

  // モーダルが開いている間のみキーボード操作を有効化
  // Escape: 閉じる / ArrowLeft: 前へ / ArrowRight: 次へ
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
      <ul className="mt-6 grid grid-cols-1 pl-4 md:mt-0 md:grid-cols-3 md:pl-0">
        {images.map(({ url, width, height }, index) => {
          const portrait = isPortrait32(width, height)
          // ファーストビューの数枚は lazy を外し、LCP を早める
          const isPriority = index < PRIORITY_COUNT
          return (
            <li key={url} className="pt-3 md:p-[4.2vw]">
              <button
                type="button"
                className="group h-full w-full cursor-zoom-in overflow-hidden"
                onClick={() => setSelectedIndex(index)}
              >
                <picture className="flex h-full w-full items-center justify-center">
                  <source
                    srcSet={buildSrcSet(url, 'avif')}
                    sizes={portrait ? SIZES_PORTRAIT : SIZES_LANDSCAPE}
                    type="image/avif"
                  />
                  <source
                    srcSet={buildSrcSet(url, 'webp')}
                    sizes={portrait ? SIZES_PORTRAIT : SIZES_LANDSCAPE}
                    type="image/webp"
                  />
                  <img
                    src={buildImageUrl(url)}
                    alt={`image${index + 1}`}
                    width={width}
                    height={height}
                    className={`${portrait ? 'aspect-[2/3] w-full md:w-[70%]' : 'aspect-[3/2] w-full'} object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80`}
                    loading={isPriority ? 'eager' : 'lazy'}
                    fetchPriority={isPriority ? 'high' : 'auto'}
                    decoding="async"
                  />
                </picture>
              </button>
            </li>
          )
        })}
      </ul>

      {selectedIndex !== undefined && (
        <Suspense fallback={null}>
          <Modal
            images={images}
            currentIndex={selectedIndex}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Suspense>
      )}
    </>
  )
}
