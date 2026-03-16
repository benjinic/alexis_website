# Alexis Bespoke Website Handbook

本手冊已與 README 整合，避免資訊重複與版本漂移。

## 主入口

- 專案總覽、開發、部署、Smoke Test： [README.md](README.md)

## 維運重點文件

- 部署前檢查（完整版）： [docs/cloud-run-predeploy-checklist.md](docs/cloud-run-predeploy-checklist.md)
- 部署前檢查（1 分鐘版）： [docs/cloud-run-predeploy-checklist-1min.md](docs/cloud-run-predeploy-checklist-1min.md)

## 部署流程與 Smoke Test

詳見 [README.md §4 正式部署流程、§5 線上 Smoke Test 建議](README.md)。

## 最近更新（2026-03-15）

- 已完成 `collection/bespoke` 重複碼清理，`/collection` 統一導向 `/bespoke`。
- 已完成近期 TypeScript 問題收斂（Problems panel 目前為 0）。
- 合併前建議再驗證 `/bespoke` 資產請求（base/lapel/pocket/fabric）是否無 404。

## 使用原則

1. 新增或調整流程時，優先更新 README。
2. 與部署、回滾、值班操作有關的細節，更新 docs 下 checklist。
3. HANDBOOK 保持為導覽索引，不再重複維護大段規格內容。

---

最後更新：2026-03-15
