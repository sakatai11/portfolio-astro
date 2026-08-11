import type { PhotosMain } from '@/types/index'

type GridProps = {
  photos: PhotosMain[]
}

/**
 * 写真一覧のグリッド。
 *
 * `.astro` ではなく React コンポーネントにしているのは、
 * ビルド時の静的レンダリング (`/timeline/[year]`) と、
 * クリック後のクライアント描画 (`LoadMoreList`) の両方で
 * 同じマークアップを使う必要があるため。
 * `client:*` ディレクティブを付けずに使えば JS は一切送信されない。
 */
export default function Grid({ photos }: GridProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-[7.8vw]">
      {photos.map(({ id, main, title }) => (
        <li key={id}>
          <a
            href={`/photos/${id}`}
            className="group block cursor-pointer overflow-hidden"
          >
            <picture>
              <source srcSet={`${main.url}?fm=webp`} type="image/webp" />
              <img
                src={main.url}
                alt={title}
                width={main.width}
                height={main.height}
                className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </a>
        </li>
      ))}
    </ul>
  )
}
