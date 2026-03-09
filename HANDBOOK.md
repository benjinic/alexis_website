# Alexis Bespoke Website Handbook

本手冊已與 README 整合，避免資訊重複與版本漂移。

## 主入口

- 專案總覽、開發、部署、Smoke Test： [README.md](README.md)

## 維運重點文件

- 部署前檢查（完整版）： [docs/cloud-run-predeploy-checklist.md](docs/cloud-run-predeploy-checklist.md)
- 部署前檢查（1 分鐘版）： [docs/cloud-run-predeploy-checklist-1min.md](docs/cloud-run-predeploy-checklist-1min.md)

## Firebase Deploy 程序

以下流程為本專案建議的標準部署路徑。

### 1. 部署前確認

```bash
npm install
npm run build
npm run check:deploy-runtime
```

### 2. 正式部署（Hosting + Functions）

```bash
npm run deploy:prod
```

說明：此為預設正式部署指令，會先做 runtime 檢查再執行 `firebase deploy`。

### 3. 僅部署 Hosting（有安全閘）

```bash
npm run deploy:hosting
```

說明：當偵測到 rewrite 依賴 Functions/Run 版本時，會自動阻擋，避免前後端版本錯配。

### 4. Dry Run（不實際部署）

```bash
npm run deploy:hosting:dry-run
```

### 5. 僅在緊急情境才使用的強制部署

```bash
npm run deploy:hosting:force
```

或：

```bash
npm run deploy:hosting:dry-run:force
```

說明：`force` 會略過安全閘，僅用於已確認風險且需要緊急上線的情境。

### 6. 部署後 Smoke Test（建議）

```bash
curl -sS -L https://alexis-bespoke.web.app/visual-intelligence -o /tmp/v.html -w "HTTP:%{http_code}\n"
curl -sS -X POST https://alexis-bespoke.web.app/api/look-analysis \
	-H "Content-Type: application/json" \
	--data '{"imageDataUri":"https://raw.githubusercontent.com/github/explore/main/topics/react/react.png"}' \
	-w "\nHTTP:%{http_code}\n"
```

## 使用原則

1. 新增或調整流程時，優先更新 README。
2. 與部署、回滾、值班操作有關的細節，更新 docs 下 checklist。
3. HANDBOOK 保持為導覽索引， 不再重複維護大段規格內容。

---

最後更新：2026-03-10
