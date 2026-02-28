# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**必ず日本語で回答してください**

## プロジェクト概要

**技術スタック**: Astro 5 + React 19 + Tailwind CSS 4 + Framer Motion
**用途**: 写真ポートフォリオサイト
**特徴**: 静的サイト生成、Reactコンポーネントとの統合、アニメーション効果

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
│   ├── common/         # 共通コンポーネント (Header, Footer, Container等)
│   ├── sections/       # セクションコンポーネント (Hero, Timeline, PhotoList等)
│   └── ui/            # UIコンポーネント (FadeIn等のアニメーション)
├── layouts/           # ページレイアウト
├── pages/             # ルーティング
│   ├── index.astro    # トップページ
│   ├── about.astro    # Aboutページ
│   ├── [year].astro   # 年別動的ルート
│   └── photos/        # 写真詳細ページ群
├── services/          # 外部サービス連携 (MicroCMS等)
├── types/             # TypeScript型定義
├── mocks/             # モックデータ (constants.ts)
└── styles/            # グローバルスタイル
```

### パスエイリアス

`@/*` エイリアスが `src/*` にマッピングされている (tsconfig.json)

```typescript
import Layout from '@/layouts/Layout.astro'
import { PHOTOS } from '@/mocks/constants.ts'
import { getMicroCmsList } from '@/services/microcms'
```

### ページルーティング

- **静的ページ**: `src/pages/index.astro` → `/`
- **動的ルート**: `src/pages/[year].astro` → `/2024`, `/2025` 等
- **ネストルート**: `src/pages/photos/[id].astro` → `/photos/1`, `/photos/2` 等

### データ管理

現在は `src/mocks/constants.ts` で写真データやイベントデータを管理している。

```typescript
export const PHOTOS = [...];    // 写真リスト
export const CONTENTS = [...];  // コンテンツ画像
export const EVENTS = [...];    // タイムラインイベント
```

### Reactコンポーネントの統合

Reactコンポーネントを使用する際は、Astroファイル内で`client:load`ディレクティブを使用する。

```astro
<Hero client:load />
```

### スタイリング

- **Tailwind CSS 4**: Viteプラグインとして統合
- **グローバルスタイル**: `src/styles/global.css`にて定義
- **フォント**: Google Fontsをプリコネクトして読み込み

### ページトランジション

Astroの`ClientRouter`機能を使用してSPA風のページ遷移を実現している (Layout.astro:4, 22)

## 注意事項

- Reactコンポーネントを新規作成する場合は、`.tsx`拡張子を使用し、必要に応じて`client:*`ディレクティブを指定する
- 静的コンテンツはAstroコンポーネント、動的・インタラクティブな要素はReactコンポーネントという使い分けを意識する
- パスエイリアス`@/*`を活用して、相対パスの深いネストを避ける
