import type { MicroCMSQueries, MicroCMSDate } from 'microcms-js-sdk'

export type MicroCmsRequest = { endpoint: string; queries?: MicroCMSQueries }

export type PhotosMain = {
  id: string
  main: PhotoInfo
  title: string
} & MicroCMSDate

export type PhotoDetail = {
  id: string
  label: string[]
  title: string
  main: PhotoInfo
  sub?: PhotoInfo
  camera: string[]
  film: string[]
  image_list: PhotoInfo[]
} & MicroCMSDate

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
