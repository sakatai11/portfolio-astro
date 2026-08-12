# portfolio-astro

写真ポートフォリオサイト。Astro 5 + React 19 + Tailwind CSS 4 + MicroCMS。

公開 URL: https://www.taichi-portfolio.com

## セットアップ

```sh
npm install
cp .env.example .env   # MicroCMS の認証情報を記入する
npm run dev
```

## 環境変数

| 変数名                    | 用途                                 |
| :------------------------ | :----------------------------------- |
| `MICROCMS_SERVICE_DOMAIN` | MicroCMS のサービスドメイン          |
| `MICROCMS_API_KEY`        | MicroCMS の API キー（読み取り権限） |

いずれもビルド時にのみ使用され、クライアントのバンドルには含まれない。
ホスティング側にも同じ変数を登録する必要がある。

## コマンド

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm run dev`     | 開発サーバーを `localhost:4321` で起動  |
| `npm run build`   | 型チェック（`astro check`）＋本番ビルド |
| `npm run preview` | ビルド結果をローカルで確認              |
| `npm run lint`    | ESLint                                  |
| `npm run format`  | Prettier で整形                         |

## 公開に関する構成

- **静的サイト生成**: MicroCMS の取得はすべてビルド時に行われる。
  **コンテンツを更新しても再ビルドしない限りサイトに反映されない**ため、
  MicroCMS の Webhook からホスティングのデプロイフックを呼ぶ設定が必要。
- **サイト情報**: `src/constants/site.ts` に公開 URL・サイト名・説明文・
  OGP 画像・GTM コンテナ ID を集約している。`astro.config.mjs` の `site` も
  ここから読んでいるため、ドメイン変更時はこのファイルだけを更新する。
- **SEO**: `src/components/common/Seo.astro` が canonical / OGP / Twitter Card を出力する。
  ページ側は `Layout` に `description` / `ogImage` / `ogType` / `noindex` を渡す。
- **sitemap**: `@astrojs/sitemap` が `/sitemap-index.xml` を生成する。
  `public/robots.txt` からこの URL を参照している。
- **旧サイトからのリダイレクト**: `astro.config.mjs` の `redirects` で
  旧 URL（`/list` 系）を `/photos` に転送する。静的ビルドのため
  meta refresh + canonical による転送で、HTTP 301 ではない。
- **アクセス解析**: GTM を `src/components/common/GoogleTagManager.astro` で読み込む。
  View Transitions による遷移は `astro:page-load` で `pageview` を dataLayer に送出する。
