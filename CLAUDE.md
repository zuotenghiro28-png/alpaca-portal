# CLAUDE.md

「AIと旅する係長」ポータルサイトのプロジェクトガイドです。Claude Code で作業を引き継ぐ際は、本ファイルと合わせて `PROJECT_BRIEF.md`（およびLP共通仕様 `design.md`）を参照して編集・検証してください。

## 参照ドキュメント（§24準拠）
- `PROJECT_BRIEF.md` — 本案件のトーン5軸・トークン・セクション設計・DEFAULTからの変更理由
- `design.md`（提供済みLP共通デザイン仕様）— 優先順位は **MUST（アクセシビリティ・コントラスト・表示破綻防止） > 明示された案件要件 > DEFAULT**

## プロジェクト概要
- **サイト名**: AIと旅する係長｜現場の仕事を軽くして、旅に出る。
- **目的**: noteの実務記事を読みたくなる、実用性とかわいらしさを兼ね備えたポータルサイト。
- **GitHub リポジトリ**: `https://github.com/zuotenghiro28-png/alpaca-portal`
- **公開URL (GitHub Pages)**: `https://zuotenghiro28-png.github.io/alpaca-portal/`
- **技術構成**: ビルド不要の静的サイト（HTML / CSS / バニラJS）。GitHub Pages の `/alpaca-portal/` 配下でそのまま動作させるため、アセットは**先頭スラッシュなしの相対パス**を使用すること。

## ファイル構成
- `index.html` — ページ本体（ヘッダー、ファーストビュー、係長のこと、仕事の困りごと、おすすめ記事6本、今日のひとこと、フッター）
- `styles.css` — 全体スタイル・アニメーション・レスポンシブ対応
- `script.js` — ファーストビューのアルパカ行動AI、記事カテゴリ絞り込み＆件数表示更新、今日のひとことおみくじ、追従ボタン制御
- `avatar.png` — プロフィールアイコン（noteオリジナルの320×320正方形PNG）
- `alpaca_01.png` 〜 `alpaca_12.png` — LINEスタンプから文字を除去し背景透過にしたアルパカ画像12種（ルート直下に配置）
- `.nojekyll` — GitHub Pages の Jekyll ビルド無効化
- `.gitignore` — 公開不要な作業用ファイル（`assets/profile_ref.png`, `assets/stamps_sheet.jpg`, `assets/stamps/stamp_*.png` など）を除外
- `assets/` — 切り出し元画像やバックアップ用ディレクトリ（本番HTML/JSからはルート直下の `avatar.png` / `alpaca_*.png` を直接参照している）

## 絶対に壊さない部分（維持ルール）
1. **ファーストビュー（`.hero-stage`）**
   - コピー、レイアウト、青空・太陽・雲・丘・草原の背景、LINEスタンプのリンク先は作り直さない。
   - アルパカの自然な2D移動・加減速・すれ違い会話・クリック反応・草原クリックでの呼び寄せ・「もう1匹呼ぶ」「省エネ」「17:30の空気に変える」機能・LINEスタンプ文字なし画像をすべて維持する。
2. **技術制約**
   - 新しいビルド環境（Vite / Webpack / npm build 等）や API キーを必須にしない。
   - 本文をアニメーション完了待ち（初期 `opacity: 0` の `.reveal` 等）で隠さない。

## デザイン・UIルール（本文エリア）
- **配色**: クリーム色（`#fbf8f0`）と淡い若草色（`#eef6e7`）を交互に使用。本文は濃いブラウン（`#3c2d22`）、見出し・リンクは落ち着いた深緑（`#275b3e`）。
- **境界**: セクション間にSVGのなだらかな丘カーブ（`.hill-divider`）を使用。
- **フォント**: 本文見出しは丸みのあるゴシック体（`Zen Maru Gothic`）、本文は `Noto Sans JP` で **16px以上** を基本とする。
- **装飾**: 絵文字は使わず、葉っぱや小花などの控えめな装飾に留める。アルパカは見出しや余白の案内役とし、文章に重ねない。
- **レスポンシブ**: 375px程度のスマホ幅でも記事は1列、横スクロールなし、長いタイトルは折り返し（`overflow-wrap: anywhere`）、追従ボタン（`.floating-note-btn`）はフッター付近で非表示にし本文を邪魔しない。

## リンク一覧（差し替え・確認用）
- noteポータル: `https://note.com/proper_stork2598/portal`
- noteトップ: `https://note.com/proper_stork2598`
- 自己紹介記事: `https://note.com/proper_stork2598/n/neab729cf4d07`
- LINEスタンプ: `https://store.line.me/stickershop/product/37735412/ja`
- 困りごと・おすすめ記事6本:
  1. 定着する5つのルール（AI活用・制作）: `https://note.com/proper_stork2598/n/nc4adfe39be26`
  2. 問い合わせ仕分け（GAS・自動化）: `https://note.com/proper_stork2598/n/n4bf24f2c4d90`
  3. KPI自動監視（GAS・自動化）: `https://note.com/proper_stork2598/n/na8b2edaf7fe6`
  4. Drive共有範囲一覧化（GAS・自動化）: `https://note.com/proper_stork2598/n/n6da30e13a9ad`
  5. 最初の30分で何をするべきか（仕事の進め方）: `https://note.com/proper_stork2598/n/nb659d1a7b7d3`
  6. AIでLPを作る順番（AI活用・制作）: `https://note.com/proper_stork2598/n/ne32af77d6faa`

## 運用・検証コマンド
- **キャッシュ対策**: `styles.css`, `script.js`, `avatar.png` を更新した際は、`index.html` 内のクエリパラメータ（例: `?v=20261126b`）を更新すること。GitHub Pages は約10分キャッシュするため、クエリを更新しないと訪問者に古いCSSや画像が表示される。
- **JS構文チェック**:
  ```powershell
  node --check script.js
  ```
- **GitHub Pages 反映**: ユーザーは GitHub ブラウザ画面（`https://github.com/zuotenghiro28-png/alpaca-portal/upload/main`）から手動アップロード、または `git push` で反映する運用。
