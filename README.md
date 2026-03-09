# Alexis Bespoke Website

Alexis Bespoke 的 Next.js + Firebase 網站專案，涵蓋品牌展示、商品客製、購物結帳、AI 造型分析與後台管理流程。

## 1) 技術堆疊

- Next.js 16 (App Router + Pages API 混合)
- React 19 + Tailwind CSS + shadcn/ui
- Firebase Hosting + Functions v2 (nextServer)
- Genkit + Vertex AI

## 2) 專案結構（重點）

```text
src/
├─ app/                  # App Router pages + route handlers
├─ pages/api/            # Pages API endpoints (含 /api/look-analysis)
├─ components/           # UI 與業務元件
├─ ai/                   # Genkit flows / prompts / AI integration
├─ lib/                  # Firebase 與共用工具
├─ hooks/ store/ types/  # hooks、狀態、型別
functions/               # Firebase Functions nextServer 入口
docs/                    # 部署與維運文件
```

## 3) 本機開發

```bash
npm install
npm run dev
```

常用指令：

```bash
npm run build
npm run check:deploy-runtime
npm run build:functions
npm run test:e2e
```

## 4) 正式部署流程

建議完整部署（Hosting + Functions 同步）：

```bash
npm run deploy:prod
```

若只部署 Hosting（有安全閘）：

```bash
npm run deploy:hosting
```

- 偵測到 rewrite 依賴 Functions/Run 時，會自動阻擋以避免前後端版本錯配
- 強制略過：

```bash
npm run deploy:hosting:force
```

部署前只做檢查（不實際部署）：

```bash
npm run deploy:hosting:dry-run
```

## 5) 線上 Smoke Test 建議

```bash
curl -sS -L https://alexis-bespoke.web.app/visual-intelligence -o /tmp/v.html -w "HTTP:%{http_code}\n"
curl -sS -X POST https://alexis-bespoke.web.app/api/look-analysis \
  -H "Content-Type: application/json" \
  --data '{"imageDataUri":"https://raw.githubusercontent.com/github/explore/main/topics/react/react.png"}' \
  -w "\nHTTP:%{http_code}\n"
```

## 6) 品牌與設計規範（整合版）

- 主色基調：stone 深色系（stone-950 / stone-900 / stone-50）
- 字體策略：Inter / Roboto Condensed / Space Mono
- 風格語言：Modern Minimal Tailoring（深底、細邊框、低調交互）
- UI 原則：高對比可讀、低噪音、避免過度動畫

## 7) 核心業務流程

1. collection 看布料
2. design/[fabricId] 客製配置
3. cart 確認項目
4. checkout 填寫資料並送單
5. order/[orderNumber] 顯示訂單結果

AI 造型分析路徑：

- 前端頁面：/visual-intelligence
- API 端點：/api/look-analysis

## 8) 文件導覽

- 維運手冊（完整版本）：[HANDBOOK.md](HANDBOOK.md)
- 部署前檢查（完整版）：[docs/cloud-run-predeploy-checklist.md](docs/cloud-run-predeploy-checklist.md)
- 部署前檢查（1 分鐘版）：[docs/cloud-run-predeploy-checklist-1min.md](docs/cloud-run-predeploy-checklist-1min.md)



ALEXIS_WEBSITE/
├── 📁 .next/
├── 📁 public/
│   ├── 📁 images/
│   │   └── 📁 models/                  <-- [現有] 您之前建好的西裝去背圖與 parts
│   ├── 📁 videos/
│   ├── 📁 404.html
│   └── 📁 ALEXIS BESPOKE.png
│
├── 📁 src/
│   ├── 📁 ai/
│   │
│   ├── 📁 app/
│   │   ├── 🌟 bespoke/                 <-- [新增] 訂製系統的專屬路由資料夾
│   │   │   └── 🌟 page.tsx             <-- [新增] 這是將下載包的 Index.tsx 貼過來改寫的頁面
│   │   ├── ✍️ globals.css              <-- [合併] 將下載包 index.css 的變數(--carbon等)與動畫貼到這裡
│   │   └── ... (您原本的 layout, page)
│   │
│   ├── 🌟 assets/                      <-- [新增] 如果您原本沒有 assets，請建一個
│   │   └── 🌟 fabrics/                 <-- [新增] 複製下載包的 4 張布料 jpg 圖片
│   │       ├── navy-wool.jpg
│   │       ├── charcoal-pinstripe.jpg
│   │       └── ...
│   │
│   ├── 📁 components/
│   │   ├── 🌟 bespoke/                 <-- [新增] 完整複製下載包的 bespoke 資料夾
│   │   │   ├── ConfigPanel.tsx
│   │   │   ├── SuitVisualizer.tsx
│   │   │   ├── FabricBlendLayer.tsx
│   │   │   ├── FabricSelector.tsx
│   │   │   ├── ModuleSelector.tsx
│   │   │   ├── ScanningOverlay.tsx
│   │   │   └── WireframeLayer.tsx
│   │   │
│   │   ├── 📁 ui/                      <-- [合併] 檢查下載包的 ui 資料夾
│   │   │   ├── 🌟 switch.tsx           <-- [新增] 把您目前缺少的 UI 元件複製過來
│   │   │   └── ... (您原本已有的 UI 元件保持不變)
│   │   │
│   │   ├── 📁 catalog/
│   │   ├── 📁 layout/
│   │   └── 📁 providers/
│   │
│   ├── 🌟 types/                       <-- [新增] 如果沒有 types 資料夾請新建
│   │   └── 🌟 bespoke.ts               <-- [新增] 複製下載包的型別定義檔
│   │
│   └── ... (ChatInterface 等現有檔案)
│
├── ✍️ tailwind.config.ts               <-- [合併] 將下載包的 colors, fontFamily, keyframes 貼入 theme.extend 中
└── ✍️ package.json                     <-- [合併] 確保安裝了 @radix-ui/react-switch 等依賴

## 9) Alexis Bespoke - 網站系統架構樹

本文件基於 Next.js App Router 架構，呈現網站的路由結構、頁面組件與後端邏輯的關聯。

### 9.0 工程師快速 TOC

- `9.1` 路由與頁面對照
- `9.2` 元件庫分層（layout / ui / providers）
- `9.3` 後端與 AI（Server Actions / Genkit Flows / Config）
- `9.4` Firestore 資料模型
- `9.5` 專案樹狀圖（快速找檔）
- `9.6` 設計系統與品牌語言

快速入口（常看路徑）:

- 首頁與全域: `src/app/layout.tsx`, `src/app/page.tsx`
- AI 顧問: `src/app/ai-advisor/page.tsx`, `src/app/ai-advisor/ai-advisor-client.tsx`
- 預約流程: `src/app/booking/page.tsx`, `src/app/booking/booking-form.tsx`, `src/app/actions/booking.ts`
- AI 後端: `src/app/actions/ai.ts`, `src/ai/flows/ai-style-advisor.ts`, `src/ai/flows/ai-look-decoder.ts`
- Firebase 設定: `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`
- UI 基礎層: `src/components/ui/`

### 9.1 路由與頁面結構 (App Router Structure)

網站的 URL 路徑與 `src/app` 資料夾結構對應如下。

#### 根目錄 `/` (Root)

- 檔案: `src/app/layout.tsx`
- 功能: 全站共用佈局
- 包含:
- `AuthProvider` (Firebase 身份驗證狀態管理)
- `Header` (導覽列、漢堡選單)
- `Toaster` (Shadcn UI 通知視窗)
- `Footer` (頁尾資訊)

- 檔案: `src/app/page.tsx`
- 功能: 首頁 (Landing Page)
- 區塊:
- Hero Section (影片/主視覺)
- `Summon Tailor` CTA (呼叫 AI 顧問)
- Features (服務特色)

#### AI 風格顧問 `/ai-advisor`

- 檔案: `src/app/ai-advisor/page.tsx`
- 功能: AI 諮詢頁面的外殼 (Server Component)
- 子組件: `AiAdvisorClient` (Client Component)

- 檔案: `src/app/ai-advisor/ai-advisor-client.tsx`
- 功能: 核心互動介面
- 狀態: `input` (使用者輸入), `advice` (AI 回傳 JSON)
- UI: 聊天輸入框、Mission Analysis 卡片、Loadout 裝備卡片

#### 預約服務 `/booking`

- 檔案: `src/app/booking/page.tsx`
- 功能: 線上預約頁面

- 檔案: `src/app/booking/booking-form.tsx`
- 功能: 預約表單邏輯
- 技術: `react-hook-form`, `zod` 驗證, Firebase Firestore 寫入

#### 產品型錄 `/catalog`

- 檔案: `src/app/catalog/page.tsx`
- 功能: 展示布料與款式
- 組件: `CatalogGallery` (圖片畫廊)
- 組件: `LookDecoderModal` (視覺解讀模組)

#### 訂製流程 `/process`

- 檔案: `src/app/process/page.tsx`
- 功能: 介紹 Bespoke 訂製工藝流程

#### 系列收藏 `/collection`

- 檔案: `src/app/collection/page.tsx`
- 功能: 季節性系列展示

### 9.2 核心組件庫 (Component Library)

位於 `src/components`，負責 UI 呈現與共用邏輯。

#### 佈局 (Layout)

- `header.tsx`: 頂部導覽列，包含 Logo 與 Menu Trigger
- `full-screen-menu.tsx`: 全螢幕覆蓋式選單 (Mobile/Desktop 通用)
- `footer.tsx`: 底部連結與版權資訊

#### UI 元件 (Shadcn UI)

位於 `src/components/ui/`，基於 Radix UI 與 Tailwind CSS。

- 互動類: `Button`, `Input`, `Textarea`, `Dialog`, `Sheet`
- 展示類: `Card`, `Badge`, `Avatar`, `Separator`
- 回饋類: `Toast`, `Skeleton`, `Progress`
- 表單類: `Form`, `Select`, `Checkbox`, `RadioGroup`, `Calendar`, `Switch`

#### Providers

- `auth-provider.tsx`: 封裝 Firebase Auth，提供 User Context

### 9.3 後端邏輯與 AI (Backend & AI)

#### 伺服器動作 (Server Actions)

位於 `src/app/actions/`，作為 Next.js 後端 API 層。

- `ai.ts`
- `getStyleAdvice()`: 呼叫 Genkit Flow 取得穿搭建議
- `getRefinedNotes()`: 潤飾使用者量身筆記
- `getLookAnalysis()`: 分析上傳照片

- `booking.ts`
- 處理預約表單提交，寫入 Firestore
- 發送確認 Email (若有設定)

#### AI 流程 (Genkit Flows)

位於 `src/ai/flows/`，定義 AI Prompt 與流程。

- `ai-style-advisor.ts`
- Input: `occasionOrMood`
- Output: JSON `{ analysis, outfit, advice }`
- Model: Gemini 1.5 Flash

- `ai-refine-notes.ts`: 整理雜亂量身筆記
- `ai-look-decoder.ts`: 多模態視覺分析

#### 設定 (Config)

- `src/ai/genkit.ts`: 初始化 Genkit、Vertex AI Plugin 與 Project ID
- `src/lib/firebase.ts`: Firebase Client SDK (Auth, Firestore)
- `src/lib/firebase-admin.ts`: Firebase Admin SDK (Server-side)

### 9.4 資料庫結構 (Firestore Schema)

目前為 NoSQL，以下為隱含資料模型。

#### Collections

- `appointments`
- `userId` (參考 users)
- `date`, `time`
- `serviceType` (e.g. Consultation, Fitting)
- `status` (`pending`, `confirmed`)

- `users`
- `uid`, `email`, `displayName`

- `measurements` (Future)
- `wardrobe` (Future)
- `products` (Future)
- `id`, `fabricName`, `price`, `imageUrl`

### 9.5 專案樹狀圖 (Architecture Tree)

```text
ALEXIS_WEBSITE
├── src/
│   ├── ai/                          # AI 核心協議與流轉邏輯
│   │   ├── flows/
│   │   │   ├── ai-style-advisor.ts  # 風格顧問 Prompt 與邏輯
│   │   │   ├── ai-look-decoder.ts   # 視覺穿搭解析邏輯
│   │   │   └── ai-refine-notes.ts   # AI 筆記優化
│   │
│   ├── app/                         # App Router 路由與分頁
│   │   ├── actions/                 # Server Actions (資料庫與 AI 通訊)
│   │   │   ├── ai.ts                # AI 請求介面
│   │   │   ├── booking.ts           # 預約與郵件發送
│   │   │   └── get-products.ts      # 從 Firebase 抓取庫存
│   │   ├── ai-advisor/              # AI 風格諮詢介面
│   │   ├── api/                     # API Route
│   │   ├── blueprint/               # 數位樣板/配置器
│   │   ├── booking/                 # 預約量身系統
│   │   ├── collection/              # 實體庫存與布料展示
│   │   ├── process/                 # 三步驟工藝流程展示
│   │   ├── visual-intelligence/     # 視覺分析入口
│   │   ├── globals.css              # 全域樣式
│   │   ├── layout.tsx               # 根佈局
│   │   └── page.tsx                 # 首頁
│   │
│   ├── components/                  # UI 組件庫
│   │   ├── catalog/                 # 功能性 Modal
│   │   ├── layout/                  # Header/Footer/Menu
│   │   ├── providers/               # Auth/Theme Context
│   │   └── ui/                      # Shadcn 基礎組件
│   │
│   └── lib/                         # 工具函式與 Firebase 設定
```

### 9.6 設計風格定位

根據目前原始碼與配置，ALEXIS BESPOKE 的設計風格可定位為: `Digital Industrial Noir`。

#### 核心設計風格

- 沈浸式入口 (Immersive Entrance): 首頁全螢幕互動導向
- 鄰近感應互動 (Proximity Interaction): Hover 觸發縮放與色彩位移
- 極簡主義 (Minimalism): 深底 + 細線 + 低噪音
- 工業質感 (Brutalist Detail): 大寫字、等寬字體、銳利形狀

#### 字體系統

- 品牌主標題: `Roboto Condensed` (500)
- 功能導航: `Roboto Condensed` (700)
- 協議感資訊: `Space Mono`
- 數據與代碼: `JetBrains Mono` / `Roboto Mono`
- 高級感標語: `Playfair Display`

#### 色彩規範

- 背景: `Carbon Black (#1a1a1a)`、Deep Noir
- 強調: `Midnight Violet (#4A1D63 / #261132)`、`Deep Red (#D90229)`、Amber
- 文字: `#ffffff` / `stone-50` / `stone-500/600`

#### 裝飾效果

- 毛玻璃: `backdrop-blur-md`
- 噪點紋理: SVG noise overlay
- 發光效果: hover `drop-shadow`
