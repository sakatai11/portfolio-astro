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
     * 全ページ共通 CSS を HTML の <style> にインライン化し、CSS リクエストを 1 本削減する (#39)。
     *
     * トップページの LCP 要素は Header のテキストで、#39 では外部 CSS の取得完了が
     * そのまま LCP を決めている (削減余地 567 ms) とされていた。ただし本番実測
     * (Slow 4G / CPU 4x / コールドキャッシュ) では、CSS は zstd + h2 多重化 +
     * immutable キャッシュにより HTML パース後 8 ms で取得完了しており、
     * レンダーブロッキングの推定削減量は LCP / FCP とも 0 ms だった。
     * よって LCP 短縮効果はほぼなく、狙いは追加ラウンドトリップの排除に留まる。
     * HTML は Cloudflare が zstd 圧縮するため実転送増も小さい。
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
