/**
 * `/photos` の 1 ページあたりの件数。
 * 初期表示件数と、LoadMore で 1 クリックあたりに追加取得する件数を兼ねる。
 * ページとエンドポイントで同じ値を使う必要があるため定数化している。
 */
export const PHOTOS_PER_PAGE = 9

/** MicroCMS の getList で一度に取得できる最大件数 */
export const MICROCMS_MAX_LIMIT = 100
