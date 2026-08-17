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

Cloudflare Pages（GitHub 連携）。`main` への push / PR のマージで自動デプロイされる。
ビルドコマンドは `npm run build`、出力ディレクトリは `dist`。

### デプロイが走らないとき

Cloudflare Pages の GitHub App の認可が失効すると、`main` へ push してもビルドが
トリガーされなくなる。GitHub Actions の CI は連携と無関係に成功するため気付きにくい。

確認と復旧の手順:

1. Cloudflare ダッシュボード → Workers & Pages → `portfolio-astro` を開く。
   「このプロジェクトは Git アカウントから切断されています」の警告が出ていれば連携が切れている。
2. 設定 → ビルド → Git リポジトリの「管理」から GitHub App を再認可する。
3. 連携が切れている間の push は遡って発火しないため、復旧後に改めて push してデプロイする。

push したコミットで Cloudflare のビルドが動いたかは、コミットのチェックで確認できる。
連携が切れている間は、このチェック自体が作成されない。

```sh
gh api repos/sakatai11/portfolio-astro/commits/<コミット SHA>/check-runs \
  --jq '.check_runs[] | select(.app.name == "Cloudflare Workers and Pages")'
```

Cloudflare Pages は GitHub の Deployments API ではなくチェックで結果を報告するため、
`gh api .../deployments` は常に空を返す。判定に使わないこと。

### ビルドが失敗するとき

`parameter is required (check serviceDomain and apiKey)` で落ちる場合は、
MicroCMS の環境変数がその環境に登録されていない。

`MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` は **Production と Preview の両方**に
登録が必要。PR のプレビューデプロイは Preview 環境の変数を使うため、Production だけに
登録していると本番は通ってプレビューだけ落ちる。

## 注意

- 静的サイト生成のため、**MicroCMS を更新しても再ビルドしない限りサイトに反映されない**。
- 公開 URL・サイト名・OGP・GTM ID は `src/constants/site.ts` に集約している。
