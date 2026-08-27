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

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm run dev`     | 開発サーバーを `localhost:4321` で起動  |
| `npm run build`   | 型チェック（`astro check`）＋本番ビルド |
| `npm run preview` | ビルド結果をローカルで確認              |
| `npm run lint`    | ESLint                                  |
| `npm run format`  | Prettier で整形                         |

## デプロイ

Cloudflare Workers（Static Assets）。`main` への push / PR のマージで Workers Builds が
自動デプロイする。配信設定は `wrangler.jsonc` に集約している。

| 項目                       | 値                             |
| :------------------------- | :----------------------------- |
| ビルドコマンド             | `npm run build`                |
| デプロイコマンド           | `npx wrangler deploy`          |
| プレビューデプロイコマンド | `npx wrangler versions upload` |
| 配信ディレクトリ           | `dist`（`assets.directory`）   |

MicroCMS の認証情報は Workers Builds の**ビルドシークレット**として登録する。
ビルド時にのみ必要でランタイムからは参照しないため、Worker のシークレットには登録しない。

- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`

Pages と違い Production / Preview で変数を二重に登録する必要はない。

### ローカルで配信環境を再現する

```sh
npm run build
npm run cf:dev   # Workers ランタイムで dist を配信する
```

`_headers` の適用、`404.html` の返却、末尾スラッシュの正規化は `astro preview` では
再現されない。これらを確認したいときは `npm run cf:dev` を使う。

### デプロイが走らないとき

GitHub App の認可が失効すると、`main` へ push してもビルドがトリガーされなくなる。
GitHub Actions の CI は連携と無関係に成功するため気付きにくい。

確認と復旧の手順:

1. Cloudflare ダッシュボード → Workers & Pages → `portfolio-astro` を開く。
   Git 連携が切れている旨の警告が出ていれば認可が失効している。
2. 設定 → ビルド から GitHub App を再認可する。
3. 連携が切れている間の push は遡って発火しないため、復旧後に改めて push する。

push したコミットでビルドが動いたかは、コミットのチェックで確認できる。
連携が切れている間は、このチェック自体が作成されない。

```sh
gh api repos/sakatai11/portfolio-astro/commits/<コミット SHA>/check-runs \
  --jq '.check_runs[] | select(.app.name == "Cloudflare Workers and Pages")'
```

Cloudflare は GitHub の Deployments API ではなくチェックで結果を報告するため、
`gh api .../deployments` は常に空を返す。判定に使わないこと。

### ビルドが失敗するとき

`parameter is required (check serviceDomain and apiKey)` で落ちる場合は、
MicroCMS の認証情報が Workers Builds のビルドシークレットに登録されていない。

## 注意

- 静的サイト生成のため、**MicroCMS を更新しても再ビルドしない限りサイトに反映されない**。
- 公開 URL・サイト名・OGP・GTM ID は `src/constants/site.ts` に集約している。
