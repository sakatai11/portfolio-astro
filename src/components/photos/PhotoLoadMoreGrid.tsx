import LoadMoreList from '@/components/ui/LoadMoreList'
import Grid from '@/components/photos/Grid'
import type { PhotosMain } from '@/types/index'

type PhotoLoadMoreGridProps = {
  /** ビルド時に取得済みの初期表示分 */
  initialPhotos: PhotosMain[]
  /** 初期表示時点で次のページが存在するか */
  hasNext: boolean
}

/**
 * `/photos` の写真グリッド。
 * 汎用の LoadMoreList と、静的ページと共用の Grid をつなぐラッパー。
 */
export default function PhotoLoadMoreGrid({
  initialPhotos,
  hasNext,
}: PhotoLoadMoreGridProps) {
  return (
    <LoadMoreList<PhotosMain>
      endpoint="/api/photos"
      initialItems={initialPhotos}
      initialHasNext={hasNext}
    >
      {(photos) => <Grid photos={photos} />}
    </LoadMoreList>
  )
}
