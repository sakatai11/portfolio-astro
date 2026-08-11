# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**技術スタック**: Astro 5 + React 19 + Tailwind CSS 4 + Framer Motion
**用途**: 写真ポートフォリオサイト
**特徴**: 静的サイト生成、Reactコンポーネントとの統合、アニメーション効果、MicroCMS連携

## 開発コマンド

```bash
# 開発サーバー起動 (localhost:4321)
npm run dev

# 本番ビルド (./dist/にビルド)
npm run build

# ビルドのプレビュー
npm run preview

# Astro CLIコマンド実行
npm run astro ...

# ESLintによるコードチェック
npm run lint

# Prettierによるコードフォーマット
npm run format
```

## アーキテクチャ

### ハイブリッドアーキテクチャ

このプロジェクトはAstro (`.astro`) とReact (`.tsx`) のハイブリッド構成を採用している。

- **Astroコンポーネント**: 静的コンテンツ、レイアウト、SEO最適化が必要な部分
- **Reactコンポーネント**: インタラクティブな要素やアニメーション (`client:load`ディレクティブで使用)

### ディレクトリ構成

`src/` 配下はドメイン単位で構成されている。

- `components/common/` — サイト共通のレイアウト部品 (Header, Footer, Container等)
- `components/home/` — トップページ (`/`) のコンポーネント
- `components/photos/` — 写真ドメインのコンポーネント
- `components/timeline/` — タイムラインドメインのコンポーネント
- `components/ui/` — 汎用UIプリミティブ (ドメイン非依存)
- `pages/` — ルーティング (Astroファイルベース)
- `assets/` — 静的画像ファイル (Astroの画像最適化対象)
- `constants/` — 複数ファイルで共有する定数
- `services/` — 外部サービス連携 (MicroCMS等)
- `types/` — TypeScript型定義
- `utils/` — ユーティリティ関数
- `styles/` — グローバルスタイル

**配置の判断基準**: 「どこから使われるか」ではなく「何に依存しているか」で決める。
複数ページから使われてもドメイン固有の知識 (ドメインの型、URL構造、API仕様) を持つものは
そのドメインのディレクトリに置く。`ui/` はドメインを一切知らないものに限る。
例: `photos/Grid.tsx` は `/photos` と `/timeline/[year]` の両方から使われるが、
`PhotosMain` 型と `/photos/{id}` のURLに依存するため `photos/` に属する。

### パスエイリアス

`@/*` エイリアスが `src/*` にマッピングされている (tsconfig.json)

```typescript
import Layout from '@/layouts/Layout.astro'
import { getMicroCmsList } from '@/services/microcms'
import { isPortrait32 } from '@/utils'
```

### ページルーティング

- **静的ページ**: `src/pages/index.astro` → `/`
- **静的ページ**: `src/pages/about.astro` → `/about`
- **写真一覧**: `src/pages/photos/index.astro` → `/photos` (MicroCMSデータ取得)
- **写真詳細**: `src/pages/photos/[id].astro` → `/photos/1`, `/photos/2` 等
- **年別一覧**: `src/pages/timeline/index.astro` → `/timeline`
- **年別詳細**: `src/pages/timeline/[year].astro` → `/timeline/2024`, `/timeline/2025` 等
- **エンドポイント**: `src/pages/api/photos/[page].json.ts` → `/api/photos/2.json` 等 (ビルド時に静的生成)

### データ管理

**データ**: MicroCMS (`src/services/microcms.ts`) から取得

```typescript
const photos = await getMicroCmsList<PhotosMain>({ endpoint: 'photos' })
const detail = await getMicroCmsDetail<PhotoDetail>({ endpoint: 'photos', contentId: id })
```

**MicroCMS画像最適化**:
- URLに `?fm=webp` を付与するとWebPに変換可能 (例: `${url}?fm=webp`)
- `main` フィールド: 一覧・グリッド表示用 (Grid.tsx)
- `sub` フィールド: サムネイル表示用 (ContentsGallery.astro)
- 画像は `<picture>` + `<source srcset="url?fm=webp">` + `loading="lazy" decoding="async"` パターンで実装

### 主要コンポーネント

- **home/Hero.astro**: トップページのヒーローセクション (CSSアニメーション + スクロールパララックス)
- **photos/Grid.tsx**: 写真一覧グリッド (`main` フィールド使用)。`/timeline/[year]` では `client:*` なしで静的レンダリング、`/photos` では LoadMoreList 内でクライアント描画するため、`.astro` ではなく React で実装している
- **photos/PhotoLoadMoreGrid.tsx**: `/photos` 用に LoadMoreList と Grid をつなぐラッパー
- **photos/Gallery.tsx**: 写真グリッド表示 + モーダル操作 (キーボード: Escape/←/→)
- **photos/Modal.tsx**: 写真フルスクリーンモーダル (`PhotoModalProps`型を使用)
- **photos/Detail.astro**: 写真詳細ページ構造 (Gallery.tsx を内包)
- **photos/ContentsGallery.astro**: 関連写真の横スクロールギャラリー (`sub` フィールド使用)
- **timeline/YearGrid.astro**: `/timeline` の年別グリッド (`buildYearEvents` 使用、代表画像1枚/年)
- **ui/LoadMoreList.tsx**: ボタンクリックで次ページのJSONを取得し追記表示する汎用コンポーネント。マークアップは持たず `children` (関数) に描画を委譲する
- **ui/Button.tsx**: サイト共通ボタン
- **ui/FadeIn.tsx**: 汎用フェードインラッパーコンポーネント
- **common/GridContainer.astro**: ページ共通のコンテンツ幅制限ラッパー

### ページネーション (LoadMore)

静的ビルド (アダプタなし) のため、MicroCMS の API キーをブラウザへ露出させずに
クリック時のデータ取得を行う目的で、ビルド時にページ分割済みの JSON を事前生成する。

- `src/pages/api/photos/[page].json.ts` — `getStaticPaths` で `/api/photos/{ページ}.json` を生成
- 1ページ目は `/photos` が直接 MicroCMS から取得するため生成しない (fetch されるのは2ページ目以降)
- 件数は `src/constants/index.ts` の `PHOTOS_PER_PAGE` をページとエンドポイントで共有する
- データはビルド時点で固定されるため、MicroCMS 更新時は再ビルドが必要

### Reactコンポーネントの統合

Reactコンポーネントを使用する際は、Astroファイル内で適切な`client:*`ディレクティブを使用する。

| ディレクティブ | 用途                                                  | 使用例                    |
| -------------- | ----------------------------------------------------- | ------------------------- |
| `client:load`  | 即時インタラクティブが必要な要素                      | `Gallery.tsx`             |
| `client:idle`  | ブラウザアイドル時に読み込む要素 (パフォーマンス優先) | `FadeIn.tsx`              |

```astro
<Hero />
<Gallery client:load images={images} />
<FadeIn client:idle delay={0.2} opacityDuration={0.5} />
```

### スタイリング

- **Tailwind CSS 4**: Viteプラグイン (`@tailwindcss/vite`) として統合
- **グローバルスタイル**: `src/styles/global.css`にて定義
- **フォント**: Google Fontsをプリコネクトして読み込み

### 画像管理

**`src/assets/` に配置した画像** は `getImage()` で最適化して使用する (`.astro` ファイル内)

```typescript
import { getImage } from 'astro:assets'
import myImage from '@/assets/image.jpg'

const optimized = await getImage({ src: myImage, format: 'webp' })
// → optimized.src でURLを参照
```

**レスポンシブ対応**: `<picture>` + `<source media="(min-width: 768px)">` でPC/SP出し分け

### ページトランジション

Astroの`ClientRouter`機能を使用してSPA風のページ遷移を実現している。
各ページで`transition:animate={fade({ duration: '0.8s' })}`を使用。

## 注意事項

- Reactコンポーネントを新規作成する場合は、`.tsx`拡張子を使用し、必要に応じて`client:*`ディレクティブを指定する
- 静的コンテンツはAstroコンポーネント、動的・インタラクティブな要素はReactコンポーネントという使い分けを意識する
- パスエイリアス`@/*`を活用して、相対パスの深いネストを避ける
- 型階層: `PhotoUrl` (main/sub) → `PhotosMain` → `PhotoDetail` の順に継承。重複フィールドは継承で解消
- 型定義は `src/types/index.ts` に集約する
- ユーティリティ関数は `src/utils/index.ts` に追加する
