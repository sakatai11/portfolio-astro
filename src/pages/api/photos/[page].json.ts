import type { APIRoute, GetStaticPaths } from 'astro'
import { getMicroCmsAllList } from '@/services/microcms'
import { PHOTOS_PER_PAGE } from '@/constants/index'
import type { PaginatedResponse, PhotosMain } from '@/types/index'

/**
 * LoadMoreList から fetch されるページ分割済みの写真 JSON。
 *
 * このサイトは静的ビルド (アダプタなし) のため、MicroCMS の API キーを
 * ブラウザへ露出させずに「クリック時の API 取得」を実現する目的で、
 * ビルド時に `/api/photos/{ページ番号}.json` を事前生成する。
 *
 * 1 ページ目は `/photos` が直接 MicroCMS から取得してレンダリングするため生成しない
 * (LoadMoreList が fetch するのは 2 ページ目以降のみ)。
 */
export const getStaticPaths = (async () => {
  // 全ページ分の JSON を生成するため、件数の上限なく全件取得する
  const photos = await getMicroCmsAllList<PhotosMain>({
    endpoint: 'photos',
    queries: { fields: ['id', 'title', 'main', 'publishedAt'] },
  })

  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE)

  // index は 0 始まりのページ番号。1 (= 2 ページ目) から生成する
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, offset) => {
    const index = offset + 1

    return {
      params: { page: String(index + 1) },
      props: {
        items: photos.slice(
          index * PHOTOS_PER_PAGE,
          (index + 1) * PHOTOS_PER_PAGE
        ),
        hasNext: index + 1 < totalPages,
      } satisfies PaginatedResponse<PhotosMain>,
    }
  })
}) satisfies GetStaticPaths

export const GET: APIRoute<PaginatedResponse<PhotosMain>> = ({ props }) =>
  new Response(JSON.stringify({ items: props.items, hasNext: props.hasNext }), {
    headers: { 'Content-Type': 'application/json' },
  })
