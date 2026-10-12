# ALEXIS BESPOKE — 設計文件

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件版本 | `v1.5` |
| 更新日期 | `2026-04-10` |
| 文件狀態 | Design System / Delivery Draft |
| 適用範圍 | 首頁、品牌頁、Bespoke 系統、支援性體驗頁 |

---

## 設計理念

品牌視覺語言圍繞 **「古老工藝 × 冷冽科技」** 的張力，命名為 **Terminal Noir（終端暗黑）**。

整體風格以深色為主軸，大量留白，借鑒終端機／命令列介面的美學，傳遞一種沉默而精密的奢華感。

### 四大品牌支柱

| 支柱 | 意涵 |
|------|------|
| **Precision（精準）** | 每一條線都是經過計算的決策 |
| **Restraint（克制）** | 以負空間（留白）體現靜默奢華 |
| **Protocol（協定）** | 將流程儀式化 |
| **Ignition（點燃）** | 以岩漿紅點燃客製化的火花 |

---

## 顏色系統

### 品牌主色（Tailwind Token）

| Token | HEX | 用途 |
|-------|-----|------|
| `lava-red` | `#F42B26` | 首頁互動懸停、核心品牌強調色 |
| `inferno` | `#A40000` | 深紅（印刷品牌色） |
| `carbon-black` | `#1F1F1F` | 次要頁面背景 |
| `midnight-violet` | `#261132` | 裝飾性強調層 |
| `graphite` | `#40363E` | 懸停／選中中間色調 |
| `amber-earth` | `#E7870A` | 除錯 / 警告狀態 |
| `silver-grey` | `#B5B5B5` | 次要內文 |
| `dim-grey` | `#78716C` | 低優先度文字 |

### CSS 自訂屬性（背景層次）

由深至淺，構成頁面的縱深感：

| 變數 | HEX | 用途 |
|------|-----|------|
| `--carbon` | `#0a0a0a` | 最深底層 / body 背景 |
| `--carbon-light` | `#141414` | 卡片背景 |
| `--carbon-lighter` | `#1f1f1f` | 輸入框、次要背景 |
| `--border` | `#2e2e2e` | 卡片與輸入框邊框 |
| `--steel` | `#595959` | 分隔線 |

### 文字顏色

| 變數 | HEX | 用途 |
|------|-----|------|
| `--foreground` | `#f2f2f2` | 主要內文 |
| `white` | `#ffffff` | 標題 / 高對比文字 |
| `--muted-foreground` | `#8c8c8c` | 佔位符、標籤 |
| `silver-grey` | `#b5b5b5` | 次要文字 |

### 強調色 / 品牌色

| 變數 | 色值 | 用途 |
|------|------|------|
| `--lava` / `--accent` | `hsl(0 85% 55%)` ≈ `#e83b3b` | 全域 CTA、焦點環、側邊欄主色 |
| `--lava-glow` | `hsl(0 85% 65%)` ≈ `#ef6363` | 光暈效果 |
| `--terminal-green` | `hsl(142 70% 45%)` ≈ `#16a34a` | 成功 / 系統就緒狀態 |

### 漸層

```css
--gradient-lava:   linear-gradient(135deg, hsl(0 85% 55%), hsl(15 90% 50%));
--gradient-carbon: linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 4%));
--gradient-scan:   linear-gradient(180deg, transparent, hsl(0 85% 55%/0.3), transparent);
```

### 陰影 / 光暈

```css
--shadow-lava: 0 0 30px hsl(0 85% 55% / 0.4);
--shadow-glow: 0 0 60px hsl(0 85% 55% / 0.2);
```

---

## 字體系統

字體透過 `next/font/google` 載入並以 CSS 變數暴露，另外透過 Google Fonts CDN 引入 **JetBrains Mono** 與 **Orbitron**。

### 字體家族

| Tailwind 類別 | CSS 變數 | Google Font | 用途 |
|---------------|---------|-------------|------|
| `font-condensed` | `--font-roboto-condensed` | Roboto Condensed | **主要品牌標題**（H1–H3），全大寫 |
| `font-sans` | `--font-roboto` | Roboto | 導覽列、內文 |
| `font-space` | `--font-space-mono` | Space Mono | 數字、尺寸、規格數值 |
| `font-jetbrains` | `--font-jetbrains-mono` | JetBrains Mono | 終端機 UI、系統指令 |
| `font-mono` | `--font-roboto-mono` | Roboto Mono | 標籤、行內程式碼、標記 |
| *(全域 CSS)* | — | Orbitron | `.terminal-heading`——HUD／終端機風格標題 |

> **Body 預設字體：** Roboto Mono（`font-mono`），設定於 `globals.css`。

### 字級比例

| 層級 | 類別 | 字體 | 應用場景 |
|------|------|------|----------|
| 展示 | `text-7xl` | `font-condensed font-black` | Hero 主標題 |
| H1 | `text-6xl` | `font-condensed font-black` | 頁面標題 |
| H2 | `text-4xl` | `font-condensed font-black` | 區塊標題 |
| H3 | `text-3xl` | `font-condensed font-bold` | 卡片標題 |
| 導言 | `text-lg` | `font-sans` | 簡介文字 |
| 內文 | `text-sm` | `font-sans` | 段落文字 |
| 標籤 | `text-xs` | `font-mono uppercase` | 說明文字、標記 |
| 微型 | `text-[10px]` | `font-mono uppercase` | 系統提示、HUD |
| 超微 | `text-[9px]` | `font-mono uppercase` | 除錯標記 |

### 字距規範

| 場景 | Tailwind 類別 |
|------|--------------|
| 標題（預設） | `tracking-[0.2em]` |
| 標題（懸停） | `tracking-[0.5em]` |
| 標籤 / 標記 | `tracking-widest` |
| 終端機文字 | `tracking-[0.25em]` |
| Orbitron | `tracking-[0.3em]` |

---

## 主題設定

- **深色優先（Dark-first）**：`:root` 與 `.dark` 使用相同數值，實際上不存在淺色主題。
- **元件庫**：Shadcn UI，所有語義色彩 token（`--primary`、`--accent`、`--border` 等）均對應深色碳黑／岩漿紅調色盤。
- **圓角**：`--radius: 0.25rem`——刻意使用銳利邊角，禁止使用 `rounded-xl` 或 `rounded-full`。

---

## 全域 CSS 工具類別

定義於 `src/app/globals.css`：

| 類別 | 效果 |
|------|------|
| `.terminal-text` | `font-mono`、全大寫、`tracking-[0.25em]`、`text-xs` |
| `.terminal-heading` | Orbitron 字體、全大寫、`tracking-[0.3em]`、`font-bold` |
| `.glow-lava` | `box-shadow: var(--shadow-lava)` |
| `.text-glow` | `text-shadow: 0 0 20px hsl(var(--lava) / 0.6)` |

---

## 文案與命名慣例

| 場景 | 格式範例 |
|------|---------|
| CTA 按鈕 | `ALL_CAPS_WITH_UNDERSCORES`（例：`INITIALIZE_CUSTOMIZATION`） |
| 系統訊息 | `> LOADING MODULES...`（使用終端機 `>` 前綴） |
| 狀態標籤 | `SYS.XXX // code` 格式 |
| 頁面標題 | 全大寫 + 寬字距 |

### 設計禁忌
- 圓角按鈕
- 岩漿紅以外的彩色漸層
- 白色背景頁面
- 多色文字（只允許白色、靜音灰、岩漿紅）

---

## 品牌首頁與其他頁面規範

### 首頁（Landing / Entry Interface）

首頁不是資訊入口，而是品牌授權入口。使用者進站後應先感受到世界觀，再決定走向哪一個模組。

| 元素 | 現行規範 | 目的 |
|------|---------|------|
| 背景 | 滿版影片淡入淡出至 `carbon-black` | 建立情緒，不依賴靜態 hero banner |
| 主標題 | `ALEXIS BESPOKE` 置中、大字、極高辨識度 | 直接鞏固品牌記憶 |
| 中央導航 | 垂直主選單 + hover 造成鄰近項衰減 | 讓選項像 mode selection，而非一般導覽 |
| 右下角標語 | `MUSIC. REBELLION. TAILORING.` | 作為品牌姿態的短句錨點 |

**首頁原則**：避免資訊過量。首頁不承擔說明責任，而承擔「定調」責任。

### 全域 Header 規範

| 元素 | 規範 | 備註 |
|------|------|------|
| Header 位置 | 固定於頂部 | 全站一致，不因首頁或 Bespoke 隱藏 |
| 背景 | 半透明深底 + blur + 細邊框 | 讓內容視覺浮於背景之上 |
| 品牌字樣 | 中央置中 | 保持高辨識、低干擾 |
| 功能區 | 左側 menu / 右側 portal、cart、booking | 維持操作一致性 |

### 內容型頁面（Catalog / Process / Brand Narrative）

內容型頁面應從首頁的情緒密度退一步，改以「克制的編輯式版面」承接資訊。

| 頁型 | 版面原則 | 視覺策略 |
|------|---------|---------|
| Catalog | 產品卡片為主、內容可掃描 | 保留深色背景，但降低特效密度 |
| Process | 編輯式區塊與流程線 | 用留白與節點關係取代複雜動畫 |
| 品牌說明 / Blueprint | 文案為主、節奏清楚 | 使用大標題、短段落、低彩度分隔 |

### AI / 實驗型頁面

AI Advisor、Visual Intelligence 這類頁面允許更高的數位感與模組感，但仍需服從 Terminal Noir 主系統。

| 元素 | 規範 | 目的 |
|------|------|------|
| 模組標頭 | 使用 module / protocol 語言 | 把功能包裝成系統能力，而非小工具 |
| 背景特效 | 噪點、光暈、漸層可提升 | 但不能壓過主要 CTA |
| CTA | 仍以單一主色 lava-red 或其鄰近品牌色為核心 | 避免視覺系統失焦 |

### 版面節奏原則

| 規則 | 說明 |
|------|------|
| 首頁最情緒化 | 可使用影片、顯著 hover、較高對比 |
| 內容頁次之 | 應轉向編輯感、掃描效率與閱讀節奏 |
| 工具頁最精準 | Bespoke / AI 工具應優先服務操作與狀態理解 |

---

## Bespoke 客製化引擎美學設計

### 設計原則：Protocol Interface

Bespoke 三步流程（GARMENT → FABRIC → CUSTOMIZE）以「協定式操作」取代傳統電商的柔性體驗。畫面不是在模擬購物，而是在模擬一套被授權的配置流程：先選 Protocol，再掛載 Material，最後進入細節覆寫。

目前 `/bespoke` 的實作已從早期 canvas 疊圖說明，收斂為更明確的三欄式操作介面：

| 區塊 | 元件 | 角色 |
|------|------|------|
| 左欄 | `StepNavigator` | 顯示流程階段與目前所在步驟 |
| 中欄 | `VisualEngine` | 呈現布料對應的單圖 / 多圖預覽 |
| 右欄 | `ConfigSidebar` | 呈現協定細節、選項控制與價格摘要 |

### 殼層規範

| 區塊 | 規範 | 現況 |
|------|------|------|
| Navbar | 全站一致顯示 | `/bespoke` 也保留全域 Navbar |
| Footer | Bespoke 內隱藏 | 避免破壞工具式操作感 |
| 外層背景 | 深碳黑 `#0a0a0a` | 與全站 Terminal Noir 保持一致 |
| 控件圓角 | `rounded-none` 優先 | 保持銳利、工業化語彙 |

### GARMENT 視圖

GARMENT 是進入系統前的授權頁。所有服裝種類以終端機按鈕呈現，不用圖像導購，而用儀式化選擇建立「進入協定」的感覺。

| 元素 | 視覺表現 | 目的 |
|------|--------|------|
| 頂部提示 | `> SYS.AWAITING_INPUT` | 建立系統待命感 |
| 主標題 | Serif 大字 + 寬字距 + 全大寫 | 將選擇行為儀式化 |
| 選項按鈕 | 深底、尖銳邊框、底部 lava 掃描線 | 呈現可啟動的 protocol |
| 選中狀態 | `lava-red` 邊框與陰影 | 明確標示目前輸入 |

### FABRIC 視圖版面規範

為避免全頁雙滾動與底部 CTA 位移，FABRIC 視圖採用固定視窗布局：

| 區塊 | 規範 | 實作要點 |
|------|------|----------|
| 外層容器 | 固定視窗高度 | `h-screen + overflow-hidden + pt-[100px]` |
| 內容主區 | 佔滿剩餘高度 | `flex-grow + h-full + overflow-hidden` |
| 左側分類欄 | 固定寬度、不可壓縮 | `w-48 + shrink-0` |
| 中央布料網格 | 唯一可滾動區 | `overflow-y-auto` |
| 右側規格欄 | 固定寬度、不可壓縮 | `w-[300px] + shrink-0` |

**交互原則**：僅允許中央網格滾動，確保左右資訊欄與 `MOUNT_MATERIAL` CTA 永遠穩定可見。

### FABRIC 視圖設計語言

| 元素 | 視覺表現 | 功能映射 |
|------|--------|--------|
| Header | `ABORT_AND_RETURN` + `Initialize Material` + `DATABASE_SYNCED` | 模擬資料庫終端完成同步 |
| 左側分類欄 | 細字距、高留白、選中時 lava 左框線 | 材質分類切換 |
| 布料卡片 | 深色底卡 + 4:5 圖片比例 + 價格標示 | 單筆 inventory document 的視覺入口 |
| 無圖卡片 | `NO_IMAGE / DATA` | 明示資料缺漏，不做假圖補位 |
| 右側資訊欄 | `MATERIAL_SCANNED` + 規格 + 價格 + CTA | 材質掛載前的確認區 |

### CUSTOMIZE 視圖設計語言

CUSTOMIZE 採用「白色導航骨架 + 黑色內容核心」的對比手法，讓使用者明確知道自己已從選物流程切換到配置流程。

#### 上方工具列

| 元素 | 視覺表現 | 目的 |
|------|--------|------|
| `Protocol: {Garment} // {Fabric}` | 極簡單行狀態列 | 固定顯示當前上下文 |
| `BACK TO FABRIC` | 低干擾灰字 hover 轉 lava | 讓使用者可退回材質層，不干擾主編輯面 |

#### StepNavigator（左欄）

| 元素 | 視覺表現 | 意義 |
|------|--------|------|
| 外框 | 白底、細灰邊、窄欄、陰影極輕 | 像技術流程尺規，不像一般側邊欄 |
| `01 Design` | lava 實心圓點 + 白字 | 目前作用中的設計步驟 |
| `02 Metrics` | 灰框空心圓點 | 下一階段已被宣告但尚未開啟 |

#### VisualEngine（中欄）

VisualEngine 現已採多圖 gallery 模式，不再以 canvas layer 生成作為主文件敘述。

| 元素 | 視覺表現 | 技術說明 |
|------|--------|---------|
| 背景 | 深碳黑 + radial grid pattern | 建立 HUD / engine 感 |
| 右上角診斷字 | `RENDER_MODE: MULTI_VIEW_ACTIVE` | 顯示目前為 gallery renderer |
| 左側縮圖軌 | 窄直欄、選中時 lava 邊框 | 在多視角間切換 |
| 主圖舞台 | 大面積置中預覽 | 專注於材質對應的整體輪廓 |
| 底部提示 | `Garment image will not reflect all customizations.` | 限定使用者預期，不誤導為 fully live render |

#### ConfigSidebar（右欄）

| 元素 | 視覺表現 | 功能映射 |
|------|--------|--------|
| 標頭 | `[ PROTOCOL_DETAILS ]` + lava 狀態點 | 表示進入編輯狀態 |
| `CURRENT_PROTOCOL` 區塊 | 黑底卡片 + 白字列表 | 直接列出當前布料與所有協定選項 |
| 手風琴 Header | 小號編碼 + 大號選中名稱 | 把複雜選項壓成可掃描結構 |
| 選項按鈕 | 圖示 + 名稱 + 加價 | 同時提供形狀與價格判斷 |
| AI 區塊 | 綠色診斷按鈕 | 與 lava 主流程顏色分流，代表輔助分析 |
| 總價區 | 深底分隔 + 大號價格 | 保持工具面板的商務收斂感 |

### 約束與狀態反饋規範

| 場景 | CSS / 視覺表現 | 用途 |
|------|--------------|------|
| 可選狀態 | 白字、深底、尖銳邊框 | 傳達主動可選 |
| 自動約束 | `opacity-30` 或灰階 + 禁用游標 | 清楚標示系統決策邊界 |
| 選中狀態 | lava 邊框 / 文字 / 陰影 | 提供明確焦點 |
| 成功 / 就緒 | terminal green | 表示同步完成、診斷完成等系統正向回饋 |

**核心原則**：灰顯不等於隱藏，而是「被協定裁切後仍需可見的邊界」。使用者要知道系統做了什麼，而不是只看到結果。

### Firestore 材質資料規格

`/bespoke` 目前的材質資料來自 Firestore `inventory` 集合。畫面層需要容忍舊資料與新資料並存。

| 欄位 | 用途 | 規則 |
|------|------|------|
| `name` | 布料名稱 | 顯示於卡片、toolbar、sidebar |
| `code` | Firestore 原始 item code | 作為主要識別碼，供重名布料區分 |
| `category` | 分類 | 轉大寫後進入左側分類欄 |
| `imageUrl` | 單圖預覽 | 舊資料 fallback |
| `imageGallery` | 多圖預覽 | 新資料來源，供 VisualEngine gallery 使用 |
| `retailPrice` | 基礎價格 | 顯示於 FABRIC 與 CUSTOMIZE |

#### 資料兼容策略

| 情境 | 前端處理 |
|------|---------|
| `code` 有值 | 直接作為 UI 的 `REF / ITEM_CODE` |
| `code` 缺失 | fallback 到名稱尾碼，最後才 fallback 到 document id 片段 |
| 有 `imageGallery` 且內容有效 | 使用 gallery 作為主要預覽來源 |
| `imageGallery` 含空字串 | 先過濾無效值後再渲染 |
| 沒有 `imageGallery` | fallback 到 `imageUrl` |
| `imageUrl` 也缺失 | 使用 placeholder 並標示 `NO_IMAGE / DATA` |

#### FABRIC 卡片資訊格式

當 Firestore 存在同名布料或同系列不同價格版本時，FABRIC 卡片必須採用正式資料卡語法，而不是只顯示名稱。

| 區塊 | 格式 | 目的 |
|------|------|------|
| 第一行 | `CATEGORY / HKD PRICE` | 先讓使用者確認分類與價格帶 |
| 第二行 | `REF ITEM_CODE / 0N VIEW` | 以 item code 與預覽數量做最終識別 |
| 警示行 | `Duplicate Name / Check Ref Before Mount` | 僅在同名碰撞時顯示，避免誤掛載 |

此格式應保持單色、等寬、尖銳邊框語彙，讓卡片更接近成衣物料卡或樣冊索引，而不是一般電商商品卡。

### 測試與驗證準則

目前 Bespoke 設計文件不只描述外觀，也要求可驗證的互動結果：

| 驗證項目 | 目的 |
|---------|------|
| GARMENT → FABRIC → CUSTOMIZE 流程可走通 | 驗證資訊架構正確 |
| `CURRENT_PROTOCOL` 隨選項即時更新 | 驗證配置狀態有被正確反映 |
| `BACK TO FABRIC` 可返回材質層 | 驗證流程回退安全 |
| 多圖布料可顯示多張縮圖 | 驗證 Firestore 新資料規格生效 |

### 備註

- 早期 canvas layer renderer 與 11 層疊圖概念仍可作為未來升級方向，但不再作為本版設計文件的主要互動定義。
- 若 Firestore 出現同名布料重複 document，FABRIC 卡片應至少同時顯示分類、價格與 `REF / ITEM_CODE`，不可只依賴名稱辨識。
