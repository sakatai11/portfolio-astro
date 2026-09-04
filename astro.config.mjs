// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

import sitemap from '@astrojs/sitemap'

import { SITE_URL } from './src/constants/site'

// https://astro.build/config
export default defineConfig({
  // canonical / og:url / sitemap の絶対 URL 生成に必要
  site: SITE_URL,

  integrations: [react(), sitemap()],

  build: {
    /**
     * 全ページ共通 CSS (gzip 約 5 KB) を HTML にインライン化する。
     * トップページの LCP 要素はヘッダーのテキストで、外部 CSS の取得完了が
     * そのまま LCP になっていた (#39)。インライン化で追加ラウンドトリップを
     * 消し、LCP / FCP を約 560 ms 短縮する。
     * HTML は Cloudflare が zstd 圧縮するため実転送増は小さい。
     */
    inlineStylesheets: 'always',
  },

  /**
   * 旧サイト (portfolio-react) の URL 構造からの移行用リダイレクト。
   * 静的ビルドのため meta refresh + canonical を持つ HTML が生成される
   * (サーバーレスポンスとしての 301 ではない)。
   */
  redirects: {
    '/list': '/photos',
    '/list/outing': '/photos',
    '/list/sports': '/photos',
    '/list/random_note': '/photos',
  },

  vite: {
    plugins: [tailwindcss()],

    // 本番ビルドからデバッグ用の出力を取り除く
    esbuild: {
      drop:
        process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
})
