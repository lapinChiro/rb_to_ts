# rb_to_ts

Ruby を TypeScript に変換するトランスパイラ。

## アーキテクチャ

3 段階パイプラインで構成:

```
Ruby source
  ↓ Prism (Wasm)
Ruby AST
  ↓ Transformer
TS IR (中間表現)
  ↓ Generator (ts-morph 軽量モード)
TypeScript source
  ↓ tsc --noEmit
検証済み TypeScript
```

### IR 設計

IR は TypeScript AST 寄りに設計する。Transformer が Ruby 固有の意味解釈（duck typing、open class、ブロック構文等）を担い、Generator は IR から TypeScript コードへの機械的な出力に徹する。

### エラーハンドリング

未対応の Ruby 構文に遭遇しても変換を中断しない。変換可能な部分はすべて変換し、未対応ノードは `// [rb_to_ts] unsupported: <node_type> (line <N>)` コメントとして TS 出力に残す。

## Tech Stack

| 要素 | 選定 |
|---|---|
| 実装言語 | TypeScript (Node.js) |
| Ruby パーサー | Prism Wasm 版 |
| TS 生成 | ts-morph (軽量モード) |
| テスト | vitest + スナップショット |
| Lint | oxlint + eslint (7 層型安全構成) |
| フォーマット | prettier |
| 型チェック | `tsc --noEmit` |
| 未使用コード検出 | knip |

## セットアップ

```bash
npm install
```

## コマンド

```bash
npm run build              # TypeScript コンパイル
npm run dev                # tsx で直接実行
npm run lint               # oxlint + eslint
npm run type-check         # tsc --noEmit
npm run format             # prettier (書き込み)
npm run format:check       # prettier (チェックのみ)
npm run knip               # 未使用コード検出
npm run test               # vitest run
npm run test:watch         # vitest (watch モード)
npm run test:coverage      # vitest run --coverage
npm run quality            # type-check + lint + knip + test
```

## ディレクトリ構成

```
src/
├── parser/            # Prism Wasm 呼び出し、Ruby AST 型定義
├── transformer/       # Ruby AST → TS IR 変換ロジック
│   ├── expressions.ts # 式の変換
│   ├── statements.ts  # 文の変換
│   ├── functions.ts   # メソッド/関数の変換
│   ├── classes.ts     # クラスの変換
│   └── types.ts       # 型推論・型変換
├── generator/         # TS IR → TypeScript 出力 (ts-morph 軽量モード)
├── ir/                # 中間表現の型定義
├── types/             # 共有型定義
└── index.ts           # CLI エントリポイント
tests/
├── fixtures/          # 入力 Ruby + 期待出力 TS のペア
├── parser/            # パーサー単体テスト
├── transformer/       # 変換ロジックテスト
├── generator/         # 生成テスト
└── e2e/               # E2E テスト (Ruby 実行 == TS 実行の一致確認)
```

## テスト戦略

### スナップショットテスト（主力）

```
tests/fixtures/abbrev.input.rb  →  変換  →  スナップショット比較
```

### E2E テスト（実行時正確性）

```
Ruby 実行結果 (ruby script.rb) == TypeScript 実行結果 (npx tsx script.ts)
```

## 最初の目標: abbrev

Ruby 標準ライブラリの `abbrev`（1 ファイル・約 80 行）をトランスパイルする。

### 成功基準

1. `abbrev.rb` → 変換 → `abbrev.ts` が生成される
2. `tsc --noEmit` で型エラー 0 件
3. Ruby 版と TS 版で同じ入力に対して同じ出力が得られる

## 将来の拡張パス

`abbrev` → `strscan` → `set` → `csv` と段階的に対応ライブラリを拡大する。
