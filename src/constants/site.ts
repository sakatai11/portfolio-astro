/**
 * サイト全体で共有するメタ情報。
 * astro.config.mjs (site 設定) と Seo.astro の双方から参照するため、
 * コンテンツ表示用の定数 (constants/index.ts) とは分けている。
 */

/** 本番の公開 URL。canonical / og:url / sitemap の絶対パス生成に使う */
export const SITE_URL = 'https://www.taichi-portfolio.com'

/** og:site_name などに使うサイト名 */
export const SITE_NAME = 'Taichi Sakai'

/** <title> のサフィックスとトップページのタイトルに使う */
export const SITE_TITLE = 'Taichi Sakai | Photography Portfolio'

/** description / og:description の既定値 */
export const SITE_DESCRIPTION =
  'Photography portfolio of Taichi Sakai — film photographs from the mountains and everyday life in Tokyo, Japan.'

/** OGP 画像のパス (public 配下)。1200x630 */
export const SITE_OGP_IMAGE = '/ogp.jpg'

/** Google Tag Manager のコンテナ ID */
export const GTM_ID = 'GTM-PMHX874W'
