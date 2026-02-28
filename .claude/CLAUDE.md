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

```
src/
├── components/
│   ├── common/         # 共通コンポーネント
│   │   ├── Container.astro
│   │   ├── Footer.astro
│   │   ├── GridContainer.astro
│   │   ├── Header.astro
│   │   └── PageTitle.astro
│   ├── photos/         # 写真関連コンポーネント
│   │   ├── Detail.astro    # 写真詳細表示
│   │   ├── Gallery.tsx     # 写真ギャラリー (モーダル連携あり)
│   │   ├── Grid.astro      # グリッドレイアウト
│   │   ├── Modal.tsx       # 写真モーダル (キーボード操作対応)
│   │   └── PhotoList.astro
│   ├── ui/             # UIコンポーネント
│   │   └── FadeIn.tsx      # フェードインアニメーション
│   ├── Contents.astro  # コンテンツ一覧
│   ├── Hero.tsx        # ヒーローセクション (React)
│   └── Timeline.astro  # タイムライン
├── layouts/            # ページレイアウト
│   └── Layout.astro
├── pages/              # ルーティング
│   ├── index.astro         # トップページ
│   ├── about.astro         # Aboutページ
│   ├── [year].astro        # 年別動的ルート
│   └── photos/
│       ├── index.astro     # 写真一覧 (MicroCMSから取得)
│       └── [id].astro      # 写真詳細
├── services/           # 外部サービス連携
│   └── microcms.ts         # MicroCMS APIクライアント
├── types/              # TypeScript型定義
│   └── index.ts            # PhotosMain, PhotoDetail, PhotoInfo 等
├── utils/              # ユーティリティ関数
│   └── index.ts            # isPortrait32 (アスペクト比判定) 等
├── mocks/              # モックデータ
│   └── constants.ts        # PHOTOS, CONTENTS, DETAILED_CONTENTS, EVENTS
└── styles/             # グローバルスタイル
    └── global.css
```

### パスエイリアス

`@/*` エイリアスが `src/*` にマッピングされている (tsconfig.json)

```typescript
import Layout from '@/layouts/Layout.astro'
import { PHOTOS } from '@/mocks/constants.ts'
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

**本番データ**: MicroCMS (`src/services/microcms.ts`) から取得

```typescript
const photos = await getMicroCmsList<PhotosMain>({ endpoint: 'photos' })
```

**モックデータ**: `src/mocks/constants.ts` で定義

```typescript
export const PHOTOS = [...];             // 写真リスト
export const CONTENTS = [...];           // コンテンツ画像
export const DETAILED_CONTENTS = [...];  // 詳細コンテンツ (MicroCMS型に対応)
export const EVENTS = [...];             // タイムラインイベント
```

### 主要コンポーネント

- **Gallery.tsx**: 写真グリッド表示 + モーダル操作 (キーボード: Escape/←/→)
- **Modal.tsx**: 写真フルスクリーンモーダル (`PhotoModalProps`型を使用)
- **Hero.tsx**: トップページのヒーローセクション (Framer Motionアニメーション)
- **FadeIn.tsx**: 汎用フェードインラッパーコンポーネント

### Reactコンポーネントの統合

Reactコンポーネントを使用する際は、Astroファイル内で`client:load`ディレクティブを使用する。

```astro
<Hero client:load />
<PhotoGallery images={images} client:load />
```

### スタイリング

- **Tailwind CSS 4**: Viteプラグイン (`@tailwindcss/vite`) として統合
- **グローバルスタイル**: `src/styles/global.css`にて定義
- **フォント**: Google Fontsをプリコネクトして読み込み

### ページトランジション

Astroの`ClientRouter`機能を使用してSPA風のページ遷移を実現している。
各ページで`transition:animate={fade({ duration: '0.8s' })}`を使用。

## 注意事項

- Reactコンポーネントを新規作成する場合は、`.tsx`拡張子を使用し、必要に応じて`client:*`ディレクティブを指定する
- 静的コンテンツはAstroコンポーネント、動的・インタラクティブな要素はReactコンポーネントという使い分けを意識する
- パスエイリアス`@/*`を活用して、相対パスの深いネストを避ける
- 型定義は `src/types/index.ts` に集約する
- ユーティリティ関数は `src/utils/index.ts` に追加する
