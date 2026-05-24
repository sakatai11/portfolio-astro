import type { PhotosMain, YearEvent } from '@/types/index'

/**
 * 写真データから年別タイムラインイベントの配列を生成する。
 * コンテンツが存在する最新年を起点に displayYears 年分を表示する。
 * 同じ年に複数の写真がある場合、publishedAt が最も早いものを代表画像とする。
 * @param photos MicroCMS から取得した写真データの配列
 * @param displayYears 表示する年数（デフォルト: 3）
 * @returns 新しい年が先頭の降順でソートされた YearEvent 配列
 */
export const buildYearEvents = (
  photos: PhotosMain[],
  displayYears: number = 3
): YearEvent[] => {
  /**
   * コンテンツが存在する最新年を起点に表示範囲を決定する。
   * 2026年にコンテンツがあれば 2026〜2024、なければ 2025〜2023 のように動的に調整する。
   */
  const publishedYears = photos
    .filter((p) => p.publishedAt)
    .map((p) => new Date(p.publishedAt!).getFullYear())

  if (publishedYears.length === 0) return []

  const latestYear = Math.max(...publishedYears)
  const startYear = latestYear - displayYears + 1

  /**
   * 年をキー、写真1枚を値とするMap。
   * 同じ年に複数の写真がある場合、publishedAt が最も早いものを代表画像とする。
   * yearMap に既にキーが存在する場合は上書きしない。
   */
  const yearMap = new Map<string, PhotosMain>()
  for (const photo of photos) {
    if (!photo.publishedAt) continue
    const year = new Date(photo.publishedAt).getFullYear()
    if (year < startYear || year > latestYear) continue
    const yearStr = year.toString()
    if (!yearMap.has(yearStr)) yearMap.set(yearStr, photo)
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

export const getYearRangeFilter = (yearsBack: number): string => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - yearsBack
  const startDate = `${startYear - 1}-12-31T23:59:59.999Z`
  const endDate = `${currentYear + 1}-01-01T00:00:00.000Z`
  return `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`
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
