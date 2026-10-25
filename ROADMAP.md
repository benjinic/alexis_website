# 🗺️ Alexis Tailor System - Development Roadmap

這份藍圖記錄了 Alexis Tailor 系統未來的進化方向。從核心功能完善，到極致的客戶體驗升級。

---

## 🎯 品牌對齊路線（2026-10-13）

> 原則：**保留全部現有功能與 Terminal Noir 設計**，以 Brand Book 的「Know the rules. Break one.」重新包裝。
> 深色＝規矩（八分紀律），熔岩紅＝破一條（兩分破格）；每一屏最多一樣東西用紅色。

### 系統概念對照

| 系統原有 | 品牌意思 |
|---|---|
| Protocol（協定） | 規矩：合身、比例、正確做法 |
| Constraint 引擎（`restrict[]` / `autoChange[]`） | 守規矩：不合理的組合自動擋住 |
| Override | **BREAK ONE**：每套只准破一條 |

### 各功能修改方向

1. **`/bespoke` 客製化（保留，主打）**
   - [ ] CUSTOMIZE 之後新增 **BREAK ONE** 一步：由破位清單選一項（開領不打領帶、白襪、針織 polo、鴨舌扁帽、白 T 恤代替恤衫等）。
   - [ ] Constraint 新增規則：破位最多一項；選第二項時以 `autoChange[]` 自動替換第一項，不另寫新引擎。
   - [ ] 新增七個角色預設（MARCEL / LEON / SILAS / ADRIAN / ELIAS / LUCIEN / DANTE），支援 `/bespoke?preset=leon`。
2. **首頁 Lookbook ↔ Bespoke 互通**
   - [ ] 每張角色卡加「用這套開始」，連到對應 preset。IG 角色 → 網站 → 客製化串成一條路。
3. **`/visual-intelligence` AI 造型分析（保留）**
   - [ ] 只改 prompt 與輸出格式：先列出「守了哪幾條規矩」，再建議**只破一條**；輸出固定為「規矩／破」兩行。
4. **`/ai-advisor` AI Stylist（保留）**
   - [ ] 統一名稱為 AI STYLIST（首頁原有「SUMMOR TAILOR」為錯字，已於 PR #4 處理）。
   - [ ] 語氣跟 IG 文案：短、肯定、不推銷；知識範圍限 Brand Book 與七個角色；每個建議＝八分紀律＋一條破位。
5. **`/booking`（目前為示意表格，開帳前最急）**
   - [ ] 第一步：送出時開啟 WhatsApp，自動帶入姓名、衣服類型、所選布料或角色；不需後端。
   - [ ] 第二步：寫入 Firestore，沿用 Resend 寄出確認電郵。
6. **Stripe 金流（調整 Phase 1 #2）**
   - [ ] 第一階段只收**訂金／量身預約費**，全數於舖內收取；保留「付款後才成立訂單」概念，降低退款風險。
7. **My Wardrobe 訂單追蹤（Phase 2 #4，保留）**
   - [ ] 每個狀態加品牌文案（例：CUTTING —「規矩，由第一剪開始。」）。
   - [ ] 每張訂單顯示「你破了的規矩」，方便客人重訂。
8. **多語系（Phase 3 #6，提前一半）**
   - [ ] 先做首頁、`/process`、`/booking` 中英切換（IG 已中英並列，並有遊客預約文案）；多幣別仍留 Phase 3。
9. **`/process`（靜態頁）**
   - [ ] 改為與 IG 一致的三步：預約 → 量身・選布 → 試身・取衣，配店內實拍。
10. **`/catalog` → CLOTH**
    - [ ] 用布料實拍；每塊布註明適合的角色（例：炭灰粗花呢 → LEON）。
11. **開場短片與大型媒體檔（合併「下週執行清單 #3」）**
    - [ ] 改為七個角色「守規矩 → 破一條」短片，並移到 Firebase Storage／CDN，不再放 repo。
12. **安全（最優先）**
    - [x] `.env.production` 停止追蹤並加入 `.gitignore`（PR #2，2026-10-13 已合併）。
    - [x] 舊 Firebase 私鑰已於 Google Cloud 刪除（2026-10-13）；git 歷史中的舊私鑰已失效，毋須改寫歷史。
    - [ ] 刪除後測試 `/visual-intelligence` 與 `/admin`，確認 Cloud Functions 以 ADC 正常運作。

### 時間表（配合 2026-11-02 IG 開帳）

| 時間 | 項目 |
|---|---|
| 開帳前（10 月） | #12 測試 ADC（私鑰已更換、PR #2 已合併）；合併 PR #4 並填 WhatsApp／地址／營業時間；#5 第一步 |
| 11 月（網站推廣） | #9、#1、#2、#11 |
| 12 月 | #7、#3、#4、#8 |
| 2027 Q1 | #6、多幣別 |

---

## 🔎 Current Status

目前生產環境部署穩定，`/visual-intelligence` 與 `/api/look-analysis` 線上 smoke test 維持 `200`。本週已完成 `HANDBOOK/README` 去重、`collection/bespoke` 重複碼清理、`/collection -> /bespoke` 導流收斂、Bespoke 模組化重構（配置抽離 + 三組件拆分）、FABRIC 視窗滾動修正，以及正式 deploy；接下來重點是 `/bespoke` runtime 資產路徑最終驗證、大型媒體檔案策略與會員中心功能深化。

---

## ✅ 現時進度總覽（2026-03-30）

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
- ✅ **[NEW] 已完成：Bespoke Constraint 引擎實現（restrict[] / autoChange[] 邏輯）**
- ✅ **[NEW] 已完成：Firebase 動態庫存整合（Firestore inventory collection）**
- ✅ **[NEW] 已完成：Canvas 11-層動態渲染 + Protocol Overrides（mannequin 0.5 alpha / shadows multiply）**
- ✅ **[NEW] 已完成：Terminal Noir 美學設計（glitch CSS + 終端風格 UI）**
- ✅ **[NEW] 已完成：Bespoke 模組化拆分（StepNavigator / VisualEngine / ConfigSidebar + bespoke-config）**
- ✅ **[NEW] 已完成：FABRIC 頁面固定視窗與單一滾動區修正（h-screen + overflow-hidden + shrink-0）**
- ✅ **[NEW] 已完成：Production deploy 成功（functions + hosting）**
- 🟡 進行中：補完 TERMINAL_DATABASE（jacket_pocket / jacket_buttons / jacket_lining）
- 🟡 進行中：Firestore 實際連接測試 + 資源檔案驗證 (/images/layers/)
- 🟡 進行中：會員中心（`/profile`）內容深化、訂單追蹤體驗
- ⚪ 未開始：Stripe 真實金流串接

---

## 📌 近期狀態備註（2026-03-30）

- 目前正式可用站點：`https://alexis-bespoke.web.app`
- 預設站點 `alexis-tailor-system-2025.web.app` 未配置同等 rewrite，子路徑可能出現 404
- 部署建議固定使用 `npm run deploy:prod`，避免只 deploy hosting 造成前後端版本錯配
- `/collection` 已改為入口導流，不再維護獨立 visualizer 實作
- **[NEW] Bespoke 三步流程核心架構已完成：GARMENT select → FABRIC select (Firestore) → CUSTOMIZE (Canvas + Constraint)**
- **[NEW] Canvas 管線已驗證：11 圖層排序 + 非同步加載 + Protocol Overrides 應用正常**
- **[NEW] FABRIC 視圖已修正為「只有中間布料網格滾動」，左右側欄固定不壓縮**
- **[NEW] 最新正式部署成功：`https://alexis-bespoke.web.app`**
- 工作樹存在大型媒體檔（`deploy_final/public/hero.mp4`），合併前需決策是否改走 CDN/物件儲存
- 下一步重點：驗證 Firestore 連接 + 補完約束規則資料庫 + 視覺資源路徑確認

---

## 🧭 依 `src/app` 頁面功能盤點（開發進度）

### ✅ 已可用（核心流程上線）

- `/`（首頁）：品牌入口與主要導覽可用
- `/collection`：入口導流頁，固定 `redirect('/bespoke')`
- **`/bespoke`（新升級）**：完整三步客製化流程
  - **GARMENT 選擇**：5 種服裝類型選項
  - **FABRIC 選擇**：Firestore 動態庫存 + 三欄布局（分類 | 物品網格 | 規格面板）
  - **CUSTOMIZE 定製**：Canvas 動態渲染 + Master Protocol Override 手風琴面板（Constraint 控制）
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

> 目標：完成 Bespoke 端到端驗證，推進會員體驗與收款能力。

1. **Bespoke Firestore + 資源檔案驗證（高優先）**
  - 驗證 `inventory` 集合連接與 fabricDB 分組正常
  - 確認 `/images/layers/lapel_*.png`, `/images/layers/pocket_*.png` 等資產存在
  - 執行完整 GARMENT → FABRIC → CUSTOMIZE 流程，確認 Canvas 無 404 與渲染正常
  - 成功條件：三步流程端到端可正常運行，Canvas 圖層正確合成。

2. **補完 Constraint 資料庫規則**
  - 在 TERMINAL_DATABASE 中新增：`jacket_pocket`, `jacket_buttons`, `jacket_lining` 分類
  - 定義各選項的 `price`, `imageUrl`, `restrict[]`, `autoChange[]` 邏輯
  - 成功條件：Customize 視圖展示所有分類，鎖定/自動變更邏輯正常工作。

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

flow chart
*Last Updated: 2026-04-01*