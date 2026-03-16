# 🗺️ Alexis Tailor System - Development Roadmap

這份藍圖記錄了 Alexis Tailor 系統未來的進化方向。從核心功能完善，到極致的客戶體驗升級。

---

## 🔎 Current Status

目前生產環境部署穩定，`/visual-intelligence` 與 `/api/look-analysis` 線上 smoke test 維持 `200`。本週已完成 `HANDBOOK/README` 去重、`collection/bespoke` 重複碼清理、`/collection -> /bespoke` 導流收斂，以及 TypeScript 問題清零；接下來重點是 `/bespoke` runtime 資產路徑最終驗證、大型媒體檔案策略與會員中心功能深化。

---

## ✅ 現時進度總覽（2026-03-15）

- ✅ 已完成：Firebase Auth（Google / Email）、登入後 redirect、customer 檔案自動補建
- ✅ 已完成：購物車 → 登入導流（未登入導向 `/login?redirect=/checkout`）
- ✅ 已完成：結帳頁 VIP 尺寸自動帶入與回寫 `customers` 集合
- ✅ 已完成：訂單雙軌編號（`orderNumber` + `invoiceNumber`）與 Test Mode
- ✅ 已完成：電子收據 API（`/api/send-receipt`）與結帳後背景寄送
- ✅ 已完成：Visual Intelligence API 模型修正（改用可用 Vertex model）
- ✅ 已完成：`/api/look-analysis` 回應格式相容修正（前端同時支援 wrapped/direct payload）
- ✅ 已完成：正式 Playwright E2E 測試（上傳 → 分析 → UI 顯示）
- ✅ 已完成：部署安全閘（`deploy:hosting` 預設阻擋、`force` 覆蓋、`dry-run` 檢查）
- ✅ 已完成：Production 全量部署與 smoke test（`/visual-intelligence`、`/api/look-analysis` 皆 200）
- ✅ 已完成：Functions region 清理與對齊（刪除 `asia-east1` 舊版，使用 `us-central1`）
- ✅ 已完成：README/HANDBOOK 文件整合
- ✅ 已完成：`collection/bespoke` 重複碼與孤立檔案清理（刪除 `src/app/collection/bespoke/`、`src/app/collection/SuitVisualizer.tsx`）
- ✅ 已完成：`/collection` 路由收斂（固定導向 `/bespoke`）
- ✅ 已完成：近期 TS/語法問題修復（含 `product/[id]` JSX token）
- 🟡 進行中：`/bespoke` 素材路徑穩定化與 runtime 404 風險收斂
- 🟡 進行中：會員中心（`/profile`）內容深化、訂單追蹤體驗
- ⚪ 未開始：Stripe 真實金流串接

---

## 📌 近期狀態備註（2026-03-15）

- 目前正式可用站點：`https://alexis-bespoke.web.app`
- 預設站點 `alexis-tailor-system-2025.web.app` 未配置同等 rewrite，子路徑可能出現 404
- 部署建議固定使用 `npm run deploy:prod`，避免只 deploy hosting 造成前後端版本錯配
- `/collection` 已改為入口導流，不再維護獨立 visualizer 實作
- 工作樹存在大型媒體檔（`deploy_final/public/hero.mp4`），合併前需決策是否改走 CDN/物件儲存

---

## 🧭 依 `src/app` 頁面功能盤點（開發進度）

### ✅ 已可用（核心流程上線）

- `/`（首頁）：品牌入口與主要導覽可用
- `/collection`：入口導流頁，固定 `redirect('/bespoke')`
- `/bespoke`：主客製化流程頁（目前唯一維護的視覺化引擎入口）
- `/design/[fabricId]`：客製配置流程可用（布料/版型參數）
- `/cart`：購物車讀取與登入導流可用
- `/checkout`：下單主流程、量身資料回寫、收據 API 呼叫可用
- `/order/[orderNumber]`：可依訂單號查詢並顯示結果
- `/login`：Email/Google 登入與 customer 補建可用
- `/admin`：後台登入、目錄資料操作與上傳流程可用
- `/catalog`：Server Action 取目錄資料可用
- `/visual-intelligence`：上傳分析流程可用（已通過 E2E）
- `/ai-advisor`：AI 文字建議流程可用

### 🟡 MVP 可用（待深化）

- `/profile`：已能讀取 customer + 訂單列表，但體驗與資訊深度仍可強化

### ⚪ 展示/原型階段

- `/booking`：目前為前端表單示意，尚未接正式後端提交流程
- `/blueprint`：已有互動原型，但送單仍為模擬（程式內有 TODO）
- `/process`：品牌流程說明頁（靜態內容）

### 🔧 `src/app/api` 路由狀態

- `/api/fabrics`：已上線
- `/api/admin/catalog`：已上線
- `/api/send-receipt`：已上線（後續目標：事件觸發自動化）
- `/api/health`：已上線

---

## 🚀 下週執行清單（Top 5）

> 目標：先收斂近期重構風險，再推進會員體驗與收款能力。

1. **`/bespoke` runtime 資源驗證（高優先）**
  - 針對 base/lapel/pocket/fabric 請求做一次完整 network 檢查（含 mobile viewport）。
  - 成功條件：無關鍵資產 404，頁面首屏可穩定渲染。

2. **視覺化素材映射收斂**
  - 將 `SuitVisualizer` 的素材來源策略定版（避免 png/svg fallback 與路徑混用反覆回退）。
  - 成功條件：團隊對單一路徑規則達成一致，合併後不再出現回退型錯誤。

3. **大型媒體檔策略決策**
  - 評估 `deploy_final/public/hero.mp4` 是否改為 CDN/物件儲存供應。
  - 成功條件：repo 體積可控，部署速度與成本可預期。

4. **`/profile` MVP 上線（會員中心）**
  - 顯示：客戶基本資料 + 最新 measurements。
  - 成功條件：登入後可查看個人資料，不需回到 checkout 才看得到尺寸。

5. **訂單追蹤 MVP（My Wardrobe）**
  - 在會員中心列出 `customers/{uid}` 關聯訂單（含 `status`、`orderNumber`、`invoiceNumber`）。
  - 成功條件：客戶可看到至少最近一筆訂單與狀態。

---

## 🟢 Phase 1: 核心商業邏輯閉環 (Immediate Next Steps)
_讓系統具備完整的會員記憶與真實收款能力。_

- [x] **1. 客戶身分驗證 (Customer Authentication)**
  - [x] 導入 Firebase Auth (Google 登入 / Email 註冊)。
  - [x] 登入導流與回跳（`redirect`）機制完成，並加入基本白名單防護。
  - [x] 建立/補建 `customers/{uid}` 檔案（註冊、Google 首登、舊客登入補建）。
  - [x] 結帳時自動從 Firestore 帶入尺寸，送單後回寫最新尺寸（`merge: true`）。
  - [ ] `/profile` 專屬會員頁面功能深化（目前頁面存在，待完善內容）。
  - [x] **核心價值（已落地）**：實現「一次量身，終身適用」的 VIP 體驗。

- [ ] **2. 國際級線上金流 (Stripe Payment Gateway)**
  - [ ] 註冊 Stripe 帳號並取得 API Keys。
  - [ ] 在 Next.js 建立 `/api/checkout` 路由，產生 Stripe Checkout Session。
  - [ ] **核心價值**：將「送出訂單」升級為「刷卡付款後才成立訂單並發放號碼牌」，阻絕惡意測試單。

---

## 🟡 Phase 2: 自動化與客戶體驗 (Automation & CX)
_減少人工客服成本，提升品牌信任感。_

- [ ] **3. 自動化收據通知 (Automated E-Invoice Emails)**
  - [x] 已串接 Resend，建立 `/api/send-receipt` 路由。
  - [x] 結帳成功後前端背景呼叫寄信 API（不阻塞轉場）。
  - [ ] 升級為「資料庫事件觸發」：當 `orders` 新增時自動寄送（Server-side Trigger）。
  - [ ] 補上 payload 驗證與重試/告警策略（避免邊界情況漏寄）。
  - [ ] **核心價值**：客人下單後短時間內收到高質感電子收據。

- [ ] **4. 客戶端訂單追蹤 (Customer Order Tracking)**
  - [ ] 在會員中心加入「我的衣櫥 (My Wardrobe / Orders)」區塊（MVP）。
  - [ ] 即時讀取 Flutter 工場端更改的訂單狀態。
  - [ ] 狀態時間軸 UI（PENDING ➔ CUTTING ➔ SEWING ➔ READY）。
  - [ ] **核心價值**：客人登入後能看見訂單狀態從 `PENDING (確認中)` ➔ `CUTTING (打版裁剪)` ➔ `SEWING (手工縫製)` ➔ `READY (準備發送)` 的浪漫過程。

---

## 🟣 Phase 3: 頂級奢華互動體驗 (Advanced Luxury Features)
_拉開與一般競爭對手的技術差距，打造世界級的線上高訂體驗。_

- [ ] **5. 動態視覺預覽 (Dynamic Visualizer)**
  - [ ] 將服裝拆解成不同部位的透明 PNG 圖片（如：主體、領口、袖口）。
  - [ ] 在 Design Studio 中，當客人點選「French Cuff (法式袖口)」，左側的模特兒圖會即時疊加替換對應的圖片圖層。
  - [ ] **核心價值**：極致的「所見即所得 (WYSIWYG)」，讓客製化過程像在玩高級遊戲。

- [ ] **6. 多語系與多幣別 (Localization & Multi-Currency)**
  - [ ] 導入 `next-intl` 或 `i18n`，支援 EN (英文) / TC (繁體中文) 切換。
  - [ ] 根據客人 IP 自動切換顯示 HKD / USD / TWD。
  - [ ] **核心價值**：讓 Alexis Tailor 從香港本地品牌正式邁向國際市場。

---
*Last Updated: 2026-03-15*