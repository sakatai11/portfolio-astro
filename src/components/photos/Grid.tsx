import type { GridProps } from '@/types/index'
import { buildImageUrl, buildSrcSet } from '@/utils'

// SP は 1 カラム全幅、md 以上は 3 カラム
const SIZES = '(min-width: 768px) 30vw, 100vw'

/**
 * 写真一覧のグリッド。
 *
 * `.astro` ではなく React コンポーネントにしているのは、
 * ビルド時の静的レンダリング (`/timeline/[year]`) と、
 * クリック後のクライアント描画 (`LoadMoreList`) の両方で
 * 同じマークアップを使う必要があるため。
 * `client:*` ディレクティブを付けずに使えば JS は一切送信されない。
 */
export default function Grid({ photos, priorityCount = 3 }: GridProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-[7.8vw]">
      {photos.map(({ id, main, title }, index) => {
        // ファーストビューの数枚は lazy を外し、LCP を早める
        const isPriority = index < priorityCount
        return (
          <li key={id}>
            <a
              href={`/photos/${id}`}
              className="group block cursor-pointer overflow-hidden"
            >
              <picture>
                <source
                  srcSet={buildSrcSet(main.url, 'avif')}
                  sizes={SIZES}
                  type="image/avif"
                />
                <source
                  srcSet={buildSrcSet(main.url, 'webp')}
                  sizes={SIZES}
                  type="image/webp"
                />
                <img
                  src={buildImageUrl(main.url)}
                  alt={title}
                  width={main.width}
                  height={main.height}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                  loading={isPriority ? 'eager' : 'lazy'}
                  fetchPriority={isPriority ? 'high' : 'auto'}
                  decoding="async"
                />
              </picture>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
