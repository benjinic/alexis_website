# Alexis Bespoke Website Handbook

本手冊已與 README 整合，避免資訊重複與版本漂移。

## 主入口

- 專案總覽、開發、部署、Smoke Test： [README.md](README.md)

## 維運重點文件

- 部署前檢查（完整版）： [docs/cloud-run-predeploy-checklist.md](docs/cloud-run-predeploy-checklist.md)
- 部署前檢查（1 分鐘版）： [docs/cloud-run-predeploy-checklist-1min.md](docs/cloud-run-predeploy-checklist-1min.md)

## 部署流程與 Smoke Test

詳見 [README.md §4 正式部署流程、§5 線上 Smoke Test 建議](README.md)。

### Bespoke 專用 Smoke Test

- 本機執行： `npm run test:e2e:bespoke`
- 線上執行： `PLAYWRIGHT_BASE_URL=https://alexis-bespoke.web.app npm run test:e2e:bespoke`
- 覆蓋範圍：
  - `/bespoke` 進入 CUSTOMIZE 後的 toolbar / sidebar 顯示
  - `BACK TO FABRIC` 往返流程
  - `StepNavigator` 顯示
  - `CURRENT_PROTOCOL` 內容隨選項更新

## 最近更新（2026-03-30）

- **[NEW] Bespoke 客製化引擎完成實裝**：
  - Firebase Firestore 動態庫存整合（category 自動分組）
  - Constraint 引擎（restrict[] / autoChange[] 規則）
  - CUSTOMIZE 視圖：Master Protocol Override 手風琴 + lockedOptions 灰顯反饋
  - Canvas 11 層動態渲染 + Protocol Overrides（mannequin 0.5 alpha、shadows multiply）
  - Terminal Noir 終端美學實現（glitch 動畫、終端風格指示器）
- 所有 Bespoke 相關變更已驗證無 TypeScript 報錯（strict mode）
- 下一步驗證重點：Firestore 實際連接、資源檔案路徑 (/images/layers/)、約束規則資料庫補完

## 最近更新（2026-04-06）

- **[NEW] 全域版面調整完成**：navbar 改為全站顯示，`/bespoke` 保留 footer 隱藏
- **[NEW] CSS side-effect import 問題已修復**：`globals.css` 與 TypeScript 宣告恢復正常
- **[NEW] Bespoke Roadmap 已同步上線**：最新 phase / task 文案與狀態已反映到 `/bespoke/roadmap`
- **[NEW] 新增兩支 Bespoke Playwright smoke tests**：已直接對 production 執行並通過
- **[NEW] Firebase 再次正式部署成功**：Hosting URL 為 `https://alexis-bespoke.web.app`
- **[NOTE] `firebase-functions` 目前為 `^7.2.2`**：CLI 會提示可升級，但本次部署成功，非阻塞問題

---

最後更新：2026-04-06
