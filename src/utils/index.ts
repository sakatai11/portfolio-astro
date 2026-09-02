import type { PhotosMain, YearEvent } from '@/types/index'

/**
 * MicroCMS の画像 URL を OGP 向け (1200x630) に変換する。
 * MicroCMS の画像 API は imgix 互換のため、クエリでリサイズ・切り抜きを指定できる。
 * @param url MicroCMS の画像 URL
 * @returns OGP 用にリサイズされた画像 URL
 */
export const buildOgImageUrl = (url: string): string =>
  `${url}?w=1200&h=630&fit=crop&fm=jpg`

/** srcset に並べる幅の候補 */
const IMAGE_WIDTHS = [400, 600, 900, 1200] as const

/**
 * MicroCMS(imgix) の画像 URL から srcset 文字列を生成する。
 * 表示枠に対して過大な原寸画像が配信されないよう、複数幅の候補を並べる。
 * @param url MicroCMS の画像 URL
 * @param fm 配信する画像フォーマット
 * @returns `<img srcset>` / `<source srcset>` に渡す文字列
 */
export const buildSrcSet = (url: string, fm: 'avif' | 'webp'): string =>
  IMAGE_WIDTHS.map((w) => `${url}?fm=${fm}&w=${w}&q=75 ${w}w`).join(', ')

/**
 * srcset 非対応環境向けのフォールバック URL を生成する。
 * @param url MicroCMS の画像 URL
 * @param w 画像の幅（省略時は 900）
 * @returns リサイズ済みの JPEG URL
 */
export const buildImageUrl = (url: string, w = 900): string =>
  `${url}?fm=jpg&w=${w}&q=75`

/**
 * モーダル拡大表示用の srcset 幅候補。
 * 最大表示幅は 1125px。DPR 2 の端末でも劣化しないよう 2 倍の 2250px までカバーする。
 */
const MODAL_IMAGE_WIDTHS = [900, 1125, 1600, 2250] as const

/**
 * モーダル拡大表示用の srcset 文字列を生成する。
 * グリッド (q=75) より高い q=80 で配信し、DPR に応じて適切な幅が選ばれるよう
 * 最大表示幅 1125px の 2 倍まで候補を並べる。
 * @param url MicroCMS の画像 URL
 * @param fm 配信する画像フォーマット
 * @returns `<source srcset>` / `<img srcset>` に渡す文字列
 */
export const buildModalSrcSet = (url: string, fm: 'webp' | 'jpg'): string =>
  MODAL_IMAGE_WIDTHS.map((w) => `${url}?fm=${fm}&w=${w}&q=80 ${w}w`).join(', ')

/** モーダル画像の表示幅。1475px 以上で 1125px、それ未満で 900px 上限 */
export const MODAL_IMAGE_SIZES = '(min-width: 1475px) 1125px, 900px'

/**
 * 写真データから年別タイムラインイベントの配列を生成する。
 * コンテンツが存在する最新年を起点に displayYears 年分を表示する。
 * displayYears を省略した場合はコンテンツが存在する全年を表示する。
 * 同じ年に複数の写真がある場合、publishedAt が最も早いものを代表画像とする。
 * @param photos MicroCMS から取得した写真データの配列
 * @param displayYears 表示する年数（省略時は全年表示）
 * @returns 新しい年が先頭の降順でソートされた YearEvent 配列
 */
export const buildYearEvents = (
  photos: PhotosMain[],
  displayYears?: number
): YearEvent[] => {
  /**
   * コンテンツが存在する最新年を起点に表示範囲を決定する。
   * 2026年にコンテンツがあれば 2026〜2024、なければ 2025〜2023 のように動的に調整する。
   */
  const publishedYears = photos
    .filter((p) => p.publishedAt)
    .map((p) => new Date(p.publishedAt!).getUTCFullYear())

  if (publishedYears.length === 0) return []

  const latestYear = Math.max(...publishedYears)
  const startYear =
    displayYears === undefined
      ? Math.min(...publishedYears)
      : latestYear - displayYears + 1

  /**
   * 年をキー、写真1枚を値とするMap。
   * 同じ年に複数の写真がある場合、publishedAt が最も早いものを代表画像とする。
   */
  const yearMap = new Map<string, PhotosMain>()
  for (const photo of photos) {
    if (!photo.publishedAt) continue
    const year = new Date(photo.publishedAt).getUTCFullYear()
    if (year < startYear || year > latestYear) continue
    const yearStr = year.toString()
    const current = yearMap.get(yearStr)
    if (!current) {
      yearMap.set(yearStr, photo)
      continue
    }
    if (
      new Date(photo.publishedAt).getTime() <
      new Date(current.publishedAt!).getTime()
    ) {
      yearMap.set(yearStr, photo)
    }
  }

  /**
   * テンプレートで使用する表示用データの配列。
   * 新しい年が先頭になるよう降順でソートする。
   */
  return [...yearMap.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, photo]) => ({
      year,
      image: photo.main.url,
      width: photo.main.width,
      height: photo.main.height,
    }))
}

/**
 * 画像の幅と高さから、アスペクト比が 2:3（縦長）かどうかを判定します。
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns 2:3 の場合は true、それ以外は false
 */
export const isPortrait32 = (width: number, height: number): boolean => {
  if (!width || !height) return false

  // 3:2 の比率は 1.5。2:3（縦長）はその逆数なので 2/3 ≈ 0.666...
  // 小数点以下の計算誤差を考慮して判定します
  const ratio = width / height
  return Math.abs(ratio - 2 / 3) < 0.01
}
