# portfolio-astro

写真ポートフォリオサイト。Astro 5 + React 19 + Tailwind CSS 4 + MicroCMS。

公開 URL: https://www.taichi-portfolio.com

## セットアップ

```sh
npm install
cp .env.example .env   # MicroCMS の認証情報を記入する
npm run dev
```

## コマンド

| Command           | Action                                                   |
| :---------------- | :------------------------------------------------------- |
| `npm run dev`     | 開発サーバーを `localhost:4321` で起動                   |
| `npm run build`   | 型チェック（`astro check`）＋本番ビルド                  |
| `npm run preview` | ビルド結果をローカルで確認                               |
| `npm run cf:dev`  | Workers ランタイムで `dist` を配信（要 `npm run build`） |
| `npm run lint`    | ESLint                                                   |
| `npm run format`  | Prettier で整形                                          |

## デプロイ

Cloudflare Workers（Static Assets）。`main` への push で Workers Builds が自動デプロイする。
配信設定は `wrangler.jsonc` に集約。MicroCMS の認証情報は Workers Builds の
**ビルドシークレット**（`MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY`）に登録する。

## 注意

- 静的サイト生成のため、**MicroCMS を更新しても再ビルドしない限りサイトに反映されない**。
- 公開 URL・サイト名・OGP・GTM ID は `src/constants/site.ts` に集約している。
