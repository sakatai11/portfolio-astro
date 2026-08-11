import type { MicroCMSQueries, MicroCMSDate } from 'microcms-js-sdk'
import type { ReactNode } from 'react'

export type MicroCmsRequest = { endpoint: string; queries?: MicroCMSQueries }

export type PhotoUrl = {
  main: PhotoInfo
  sub: PhotoInfo
}

export type PhotosMain = {
  id: string
  title: string
  publishedAt?: string
} & PhotoUrl

export type PhotoDetail = {
  label: string[]
  camera: string[]
  film: string[]
  image_list: PhotoInfo[]
} & PhotosMain &
  MicroCMSDate

export type PhotoInfo = {
  url: string
  height: number
  width: number
}

export type PhotoModalProps = {
  images: PhotoInfo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export type PhotoGalleryProps = {
  images: PhotoInfo[]
}

/** ページ分割された静的 JSON エンドポイントのレスポンス */
export type PaginatedResponse<T> = {
  items: T[]
  /** 次のページが存在するか */
  hasNext: boolean
}

export type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  /** ラベル右側に表示するアイコン */
  icon?: ReactNode
  className?: string
}

export type LoadMoreListProps<T> = {
  endpoint: string
  initialItems: T[]
  initialHasNext: boolean
  initialPage?: number
  /**
   * 取得済みの全アイテムを受け取って一覧を描画する。
   * 表示形式は利用側が決めるため、LoadMoreList はマークアップを持たない
   */
  children: (items: T[]) => ReactNode
  buttonLabel?: string
  loadingLabel?: string
}

/** タイムライン表示用の年別イベントデータ */
export type YearEvent = {
  year: string
  image: string
  width: number
  height: number
}
