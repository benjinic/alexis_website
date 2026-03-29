# Alexis Bespoke Website Handbook

本手冊已與 README 整合，避免資訊重複與版本漂移。

## 主入口

- 專案總覽、開發、部署、Smoke Test： [README.md](README.md)

## 維運重點文件

- 部署前檢查（完整版）： [docs/cloud-run-predeploy-checklist.md](docs/cloud-run-predeploy-checklist.md)
- 部署前檢查（1 分鐘版）： [docs/cloud-run-predeploy-checklist-1min.md](docs/cloud-run-predeploy-checklist-1min.md)

## 部署流程與 Smoke Test

詳見 [README.md §4 正式部署流程、§5 線上 Smoke Test 建議](README.md)。

## 最近更新（2026-03-30）

- **[NEW] Bespoke 客製化引擎完成實裝**：
  - Firebase Firestore 動態庫存整合（category 自動分組）
  - Constraint 引擎（restrict[] / autoChange[] 規則）
  - CUSTOMIZE 視圖：Master Protocol Override 手風琴 + lockedOptions 灰顯反饋
  - Canvas 11 層動態渲染 + Protocol Overrides（mannequin 0.5 alpha、shadows multiply）
  - Terminal Noir 終端美學實現（glitch 動畫、終端風格指示器）
- 所有 Bespoke 相關變更已驗證無 TypeScript 報錯（strict mode）
- 下一步驗證重點：Firestore 實際連接、資源檔案路徑 (/images/layers/)、約束規則資料庫補完

---

最後更新：2026-03-30
