# Cloud Run 部署前檢查清單（1 分鐘版）

> 用途：PR / Release 前最後 1 分鐘快速確認。

## ✅ Pre-Deploy（上線前）

- [ ] 本次 API 有防呆：壞 JSON 會回 `400`（不是 `500`）
- [ ] `npm run check:deploy-runtime` 通過
- [ ] `npm run build` 通過
- [ ] `npm run build:functions` 通過
- [ ] 目標環境 secrets / env 已就緒（Firebase Admin、Vertex、Resend 等）
- [ ] 本次回滾 revision 已記錄

## 🚀 Deploy

- [ ] 執行 `npm run deploy:prod`
- [ ] 正式 deploy 前，可先跑 `npm run deploy:hosting:dry-run`（只檢查、不部署）
- [ ] （若只想 deploy Hosting）先執行 `npm run deploy:hosting`，確認未被 safety gate 阻擋
- [ ] 如確定要略過阻擋，再執行 `npm run deploy:hosting:force`
- [ ] 新 revision 建立成功（service: `nextserver`, region: `us-central1`）

## 🔎 Post-Deploy（上線後 10 分鐘）

- [ ] `/visual-intelligence` 上傳流程可成功完成
- [ ] `/api/look-analysis` 正常回 `200`
- [ ] 壞 JSON 請求回 `400`
- [ ] Log Explorer 無新增 `Unexpected end of JSON input`（特別是 `POST /visual-intelligence`）
- [ ] 5xx 比率無明顯上升

## 🧯 回滾條件（任一成立即回滾）

- [ ] 連續出現 `POST /visual-intelligence` JSON parse `500`
- [ ] 主要路徑失敗率持續異常
- [ ] 核心功能（上傳分析 / 下單）不可用
