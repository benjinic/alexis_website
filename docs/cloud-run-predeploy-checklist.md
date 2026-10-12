# Cloud Run 部署前檢查清單（alexis_website）

> 適用於目前架構：Firebase Functions v2 `nextServer` + Next.js standalone。
>
> 快速版（可直接貼 PR）：[cloud-run-predeploy-checklist-1min.md](cloud-run-predeploy-checklist-1min.md)

## 0) Go / No-Go 快速判斷

- [ ] 本次變更已包含 API 防呆（特別是 JSON parse 失敗要回 `400`，不是 `500`）
- [ ] 本地 `build` 與 `deploy runtime check` 皆通過
- [ ] 需要的 secrets / env 都已在目標專案設定完成
- [ ] 了解本次變更的回滾方案（上一個可用 revision）

---

## 1) 程式碼與路由檢查

- [ ] `POST /visual-intelligence` 不再承接大 JSON payload（改走專用 API）
- [ ] 目前分析路由為 `POST /api/look-analysis`
- [ ] `src/app/api/look-analysis/route.ts` 已有：
  - [ ] 空 body 檢查
  - [ ] `JSON.parse` try/catch
  - [ ] 欄位驗證（`imageDataUri`）
  - [ ] 解析失敗回 `400`
- [ ] 前端已改用 `fetch('/api/look-analysis')`

---

## 2) 本地指令檢查（必跑）

在 repo root 執行：

```bash
npm install
npm run check:deploy-runtime
npm run build
npm run build:functions
```

- [ ] `npm run check:deploy-runtime` 通過
- [ ] `npm run build` 通過
- [ ] `npm run build:functions` 產生並同步 `functions/.next`

---

## 3) Firebase / Cloud Run 設定核對

### 3.1 Functions 目標設定（對照 `functions/index.js`）

- [ ] region: `us-central1`
- [ ] memory: `2GiB`
- [ ] cpu: `1`
- [ ] timeoutSeconds: `60`
- [ ] concurrency: `20`
- [ ] maxInstances: `20`

### 3.2 Runtime 與相依

- [ ] `functions/package.json` engines.node 為 `22`
- [ ] `functions/package.json` 內有必要依賴：
  - [ ] `next`
  - [ ] `firebase-functions`
  - [ ] `firebase-admin`
  - [ ] `genkit`
  - [ ] `@genkit-ai/vertexai`

### 3.3 環境變數 / Secret

- [ ] Firebase Admin 所需憑證來源已確認（不要用過期 key）
- [ ] AI / 郵件等關鍵變數已設定（例如 Vertex / Resend）
- [ ] 生產專案與 staging 專案值無誤（避免串錯專案）

---

## 4) 部署步驟（建議）

```bash
npm run deploy:prod
```

若只部署 Hosting：

```bash
npm run deploy:hosting
```

正式 deploy 前，可先做純檢查（不會真的部署）：

```bash
npm run deploy:hosting:dry-run
```

- 預設會啟用 safety gate：偵測到 rewrite 依賴 Functions/Run 時會阻擋，避免前後端版本錯配
- 若你已確認要強制只部署 Hosting，才使用：

```bash
npm run deploy:hosting:force
```

- 若你要在 dry-run 模式模擬強制部署判定，可使用：

```bash
npm run deploy:hosting:dry-run:force
```

- [ ] 部署命令完成，無錯誤
- [ ] Functions 新 revision 已建立
- [ ] 服務流量切到新 revision（或確認自動切換成功）

---

## 5) 部署後 10 分鐘驗收

### 5.1 功能驗收

- [ ] 開啟 `/visual-intelligence`，上傳圖片並完成分析
- [ ] 檢查 `/api/look-analysis` 正常回 `200`
- [ ] 故意送壞 JSON（空 body / 截斷 JSON）可回 `400`

### 5.2 日誌驗收（Log Explorer）

建議查詢關鍵字：

- `resource.type="cloud_run_revision"`
- `resource.labels.service_name="nextserver"`
- `textPayload:"Unexpected end of JSON input" OR jsonPayload.message:"Unexpected end of JSON input"`
- `httpRequest.requestUrl:"/visual-intelligence" OR httpRequest.requestUrl:"/api/look-analysis"`

驗收標準：

- [ ] 新版上線後，不再出現 `POST /visual-intelligence` 的 JSON parse 500
- [ ] `/api/look-analysis` 的錯誤可控（壞請求=400，非 500）
- [ ] 5xx 比率在可接受範圍

---

## 6) 效能與容量觀察（本次事件延伸）

- [ ] 觀察 CPU / Memory / Latency 是否持續異常
- [ ] 如尖峰流量高，評估：
  - [ ] 調整 `maxInstances`
  - [ ] 降低單請求 payload
  - [ ] 加入前端壓縮與尺寸限制

---

## 7) 回滾預案（一定要先想好）

- [ ] 記錄上一個健康 revision 名稱
- [ ] 明確回滾命令 / 控制台操作路徑
- [ ] 回滾後驗收路徑：`/visual-intelligence`、`/api/look-analysis`

---

## 8) 建議固定化（下次可省時間）

- [ ] 把本清單加入 PR template 或 release checklist
- [ ] 對關鍵 API 加上 smoke test（至少檢查 200/400 行為）
- [ ] 對 `Unexpected end of JSON input` 設警報
