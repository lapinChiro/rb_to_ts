---
name: backlog-management
description: backlog/ のライフサイクル管理。PRD の完了処理、plan.md の整理、TODO との同期を行う
user-invocable: true
---

# backlog のライフサイクル管理

## トリガー

PRD (backlog/ のタスク) が完了したとき。

## アクション

以下の順序を厳守する:

1. `TODO` を確認し、作業中に発見した課題を追加する
2. 完了した PRD を `backlog/` から削除する
3. `plan.md` を更新する (完了した項目を削除し、残りの順序を整理する)
4. 次に着手すべき PRD を特定し、報告する

## 禁止事項

- `plan.md` に完了済みの情報を残すこと (打ち消し線、完了マーク等)
- `plan.md` に PRD 化前の情報 (TODO の内容) を記載すること
- 完了した PRD ファイルを `backlog/` に残すこと
- `backlog/` に移した項目を `TODO` に残すこと

## 検証

- `plan.md` に完了済みの項目が存在しない
- `plan.md` の全項目が `backlog/` 内の PRD に対応している
- `backlog/` 内の全 PRD が `plan.md` に記載されている
