import { useEffect, useState } from 'react'
import type { LoadMoreListProps, PaginatedResponse } from '@/types/index'
import Button from './Button'

const ERROR_MESSAGE = '読み込みに失敗しました。時間をおいて再度お試しください。'

/**
 * ボタンクリックで次ページの JSON API を取得し、既存のリストへ追記表示する汎用コンポーネント。
 *
 * 取得先は `${endpoint}/${page}.json` に固定されており、
 * 1 回あたりの取得件数はエンドポイント側 (ビルド時に生成される静的 JSON) で決まる。
 *
 * 到達ページは URL クエリ (`?page=n`) に保持する。island の state は
 * ページ遷移で破棄されるため、これがないとブラウザバックやリロードで
 * 初期表示件数に戻ってしまう。マウント時にクエリを読み、
 * 不足分のページを順に取得して表示を復元する。
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
  pageParam = 'page',
  totalPages,
}: LoadMoreListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [page, setPage] = useState(initialPage)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const fetchPage = async (target: number): Promise<PaginatedResponse<T>> => {
    const response = await fetch(`${endpoint}/${target}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    return response.json()
  }

  /**
   * 到達ページを URL へ反映する。
   * pushState だと 1 クリックごとに履歴が積まれ、戻る操作で前のページへ
   * 戻れなくなるため replaceState を使う。ClientRouter がスクロール位置などを
   * history.state に持たせているので、既存の state はそのまま引き継ぐ。
   */
  const syncPageToUrl = (nextPage: number) => {
    const url = new URL(window.location.href)

    if (nextPage <= 1) {
      url.searchParams.delete(pageParam)
    } else {
      url.searchParams.set(pageParam, String(nextPage))
    }

    history.replaceState(history.state, '', url)
  }

  // URL のクエリで指定されたページまで表示を復元する (ブラウザバック・リロード対策)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawPage = params.get(pageParam)

    if (rawPage === null) return

    const targetPage = Number(rawPage)
    // クエリは手で書き換えられるため、存在しないページを指していないか検証する
    const isValidPage =
      Number.isInteger(targetPage) &&
      targetPage > initialPage &&
      (totalPages === undefined || targetPage <= totalPages)

    if (!isValidPage) {
      // 無効なクエリは取り除き、初期表示のままにする
      syncPageToUrl(initialPage)
      return
    }

    let cancelled = false

    /**
     * 初期表示済みの次ページから目標ページまで 1 ページずつ取得する。
     * ビルド後に掲載数が減った場合に備え、実在する最終ページ
     * (hasNext が false) に達した時点でも打ち切る。
     */
    const restore = async () => {
      setIsLoading(true)

      let current = initialPage

      try {
        while (current < targetPage) {
          const data = await fetchPage(current + 1)
          if (cancelled) return

          current += 1
          setItems((prev) => [...prev, ...data.items])
          setPage(current)
          setHasNext(data.hasNext)

          if (!data.hasNext) break
        }
      } catch {
        if (cancelled) return

        setError(ERROR_MESSAGE)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    restore()

    return () => {
      cancelled = true
    }
    // 復元はマウント時の 1 回だけ実行する
  }, [])

  const handleLoadMore = async () => {
    if (isLoading || !hasNext) return

    const nextPage = page + 1
    setIsLoading(true)
    setError(undefined)

    try {
      const data = await fetchPage(nextPage)
      setItems((prev) => [...prev, ...data.items])
      setPage(nextPage)
      setHasNext(data.hasNext)
      syncPageToUrl(nextPage)
    } catch {
      setError(ERROR_MESSAGE)
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
