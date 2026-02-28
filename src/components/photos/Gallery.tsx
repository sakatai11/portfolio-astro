import { useCallback, useEffect, useState } from 'react'
import type { PhotoGalleryProps } from '@/types/index'
import { isPortrait32 } from '@/utils'
import Modal from './Modal'

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
