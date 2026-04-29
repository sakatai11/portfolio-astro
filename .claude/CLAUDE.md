# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**必ず日本語で回答してください**

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

- `components/common/` — 共通UIコンポーネント (Header, Footer等)
- `components/photos/` — 写真ドメインのコンポーネント
- `components/ui/` — 汎用UIプリミティブ
- `pages/` — ルーティング (Astroファイルベース)
- `assets/` — 静的画像ファイル (Astroの画像最適化対象)
- `services/` — 外部サービス連携 (MicroCMS等)
- `types/` — TypeScript型定義
- `utils/` — ユーティリティ関数
- `styles/` — グローバルスタイル

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
- **動的ルート**: `src/pages/[year].astro` → `/2024`, `/2025` 等
- **ネストルート**: `src/pages/photos/[id].astro` → `/photos/1`, `/photos/2` 等

### データ管理

**データ**: MicroCMS (`src/services/microcms.ts`) から取得

```typescript
const photos = await getMicroCmsList<PhotosMain>({ endpoint: 'photos' })
const detail = await getMicroCmsDetail<PhotoDetail>({ endpoint: 'photos', contentId: id })
```

**MicroCMS画像最適化**:
- URLに `?fm=webp` を付与するとWebPに変換可能 (例: `${url}?fm=webp`)
- `main` フィールド: 一覧・グリッド表示用 (Grid.astro, PhotoList.astro)
- `sub` フィールド: サムネイル表示用 (Contents.astro)
- 画像は `<picture>` + `<source srcset="url?fm=webp">` + `loading="lazy" decoding="async"` パターンで実装

### 主要コンポーネント

- **Gallery.tsx**: 写真グリッド表示 + モーダル操作 (キーボード: Escape/←/→)
- **Modal.tsx**: 写真フルスクリーンモーダル (`PhotoModalProps`型を使用)
- **Hero.astro**: トップページのヒーローセクション (CSSアニメーション + スクロールパララックス)
- **FadeIn.tsx**: 汎用フェードインラッパーコンポーネント
- **Grid.astro**: 写真一覧グリッド (`/photos` ページ用、`main` フィールド使用)
- **Detail.astro**: 写真詳細ページ構造 (Gallery.tsx を内包)
- **GridContainer.astro**: ページ共通のコンテンツ幅制限ラッパー

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
