import LoadMoreList from '@/components/ui/LoadMoreList'
import Grid from '@/components/photos/Grid'
import type { PhotosMain } from '@/types/index'

type PhotoLoadMoreGridProps = {
  /** ビルド時に取得済みの初期表示分 */
  initialPhotos: PhotosMain[]
  /** 写真全体のページ数 */
  totalPages: number
}

/**
 * `/photos` の写真グリッド。
 * 汎用の LoadMoreList と、静的ページと共用の Grid をつなぐラッパー。
 */
export default function PhotoLoadMoreGrid({
  initialPhotos,
  totalPages,
}: PhotoLoadMoreGridProps) {
  return (
    <LoadMoreList<PhotosMain>
      endpoint="/api/photos"
      initialItems={initialPhotos}
      initialHasNext={totalPages > 1}
      totalPages={totalPages}
    >
      {(photos) => <Grid photos={photos} />}
    </LoadMoreList>
  )
}
