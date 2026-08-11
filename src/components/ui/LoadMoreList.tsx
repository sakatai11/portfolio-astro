import { useState } from 'react'
import type { LoadMoreListProps, PaginatedResponse } from '@/types/index'
import Button from './Button'

/**
 * ボタンクリックで次ページの JSON API を取得し、既存のリストへ追記表示する汎用コンポーネント。
 *
 * 取得先は `${endpoint}/${page}.json` に固定されており、
 * 1 回あたりの取得件数はエンドポイント側 (ビルド時に生成される静的 JSON) で決まる。
 *
 * 一覧のマークアップは持たず、描画は children (関数) に委譲する。
 * children は関数のため .astro から直接渡せない。Astro から使う場合は、
 * この汎用コンポーネントをラップした React コンポーネント
 * (例: `PhotoLoadMoreGrid.tsx`) を経由して island 化する。
 */
export default function LoadMoreList<T>({
  endpoint,
  initialItems,
  initialHasNext,
  initialPage = 1,
  children,
  buttonLabel = 'Load More',
  loadingLabel = 'Loading',
}: LoadMoreListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [page, setPage] = useState(initialPage)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleLoadMore = async () => {
    if (isLoading || !hasNext) return

    const nextPage = page + 1
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await fetch(`${endpoint}/${nextPage}.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data: PaginatedResponse<T> = await response.json()
      setItems((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasNext(data.hasNext)
    } catch {
      setError('読み込みに失敗しました。時間をおいて再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 追記されたアイテムを支援技術に通知するため aria-live を付与 */}
      <div aria-live="polite" aria-busy={isLoading}>
        {children(items)}
      </div>

      {hasNext && (
        <div className="mt-20 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-300 ${
                  isLoading ? 'animate-pulse' : 'group-hover:translate-y-1'
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            }
          >
            {isLoading ? loadingLabel : buttonLabel}
          </Button>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  )
}
