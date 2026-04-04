import type { MicroCMSQueries, MicroCMSDate } from 'microcms-js-sdk'

export type MicroCmsRequest = { endpoint: string; queries?: MicroCMSQueries }

export type PhotoUrl = {
  main: PhotoInfo
  sub: PhotoInfo
}

export type PhotosMain = {
  id: string
  title: string
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
