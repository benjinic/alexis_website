# ALEXIS BESPOKE — 設計文件

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

## Bespoke 客製化引擎美學設計

### 設計原則：「Protocol Override」邏輯視覺化

Bespoke 三步流程（GARMENT → FABRIC → CUSTOMIZE）實踐 Terminal Noir 終端美學，特別在 Constraint 引擎層面強化「精準控制」與「協定儀式感」：

### CUSTOMIZE 視圖設計語言

#### Master Protocol Override 手風琴（右側控制面板）

| 元素 | 視覺表現 | 功能映射 |
|------|--------|--------|
| **分類標題** | 全大寫 + `font-jetbrains` + 高字距（`tracking-widest`） | 版型、領口、口袋等約束分類 |
| **可用選項** | 白色文字 + 尖銳邊框 (`rounded-none`) | 未鎖定、可選的自訂項目 |
| **鎖定選項（lockedOptions）** | 靜音灰 (muted-foreground) + 降透明度 (`opacity-50`) + 禁用游標 | Constraint 引擎自動禁用的不相容選項 |
| **價格增減** | 岩漿紅 (+) / 銀灰 (−) | 該選項的成本衝擊（+100 / -50 / 0） |
| **選中狀態** | 岩漿紅底框 + 白色文字 | 當前已選擇的定製值 |

#### Canvas 左側渲染窗口

| 元素 | 視覺效果 | 技術實現 |
|------|--------|--------|
| **Background** | 深碳黑 (--carbon) | `canvas` 背景，強調模特兒輪廓 |
| **Model（mannequin）** | 幽靈般半透明（0.5 alpha） | Protocol Override：視覺暗示「基準」性質 |
| **陰影層（shadows）** | 色彩增值混合（multiply）| Protocol Override：通過 `globalCompositeOperation = 'multiply'` 加深深度感 |
| **布料與配件** | 實心不透明（alpha = 1.0）| 完全不透明，傳達「選定即生效」 |
| **層級順序提示** | 按 z-index 排序後繪製 | 視覺上體現「協定秩序」 |

#### 終端指示器（狀態反饋）

| 狀態 | 文本 | 位置 | 視覺效果 |
|------|------|------|--------|
| 初始化 | `ESTABLISHING_SECURE_CONNECTION...` | FABRIC 視圖上方 | 綠色終端文字 (--terminal-green)，動畫波紋 |
| 就緒 | `RENDER_ENGINE: ACTIVE` | Canvas 頂部 | 岩漿紅終端文字 (--lava)，脈衝光暈 |
| 約束衝突 | （灰顯 + 禁用游標） | 手風琴選項上 | 靜音灰文字，視覺「矛盾」感 |

### Canvas 11-層聚合的設計意涵

```
Z-Index 層級 | 圖層名稱           | 視覺意義
─────────────┼──────────────────┼─────────────────────────
0            │ mannequin        │ 基準模特兒（幽靈般參考）
5            │ shirt            │ 襯衫底層
10           │ jacketBase       │ 西裝主體
50           │ shadows          │ 深度與陰影（色彩增值）
100          │ lining           │ 襯裡
150          │ lapel            │ 領口（動態）
160          │ hipPockets       │ 腰側口袋（動態）
170          │ breastPocket     │ 胸口口袋（動態）
180          │ buttons          │ 鈕扣與裝飾（動態）
190          │ satinLapel       │ 領口緞面（進階）
195          │ handkerchief     │ 口袋巾飾（進階）
```

**設計邏輯**：層級遞升象徵「定製深度加強」，最終形成「完整西裝輪廓」。每層的動態更新對應 Constraint 引擎的即時決策。

### Constraint 視覺反饋規範

| 場景 | CSS / 視覺表現 | 用途 |
|------|--------------|------|
| 可選狀態 | 白色按鈕 + 尖銳邊框 | 傳達「主動權在用者」 |
| 自動約束 | `opacity-50` + 靜音灰 + 禁用游標 | 傳達「系統決策」，避免混淆 |
| 價格衝擊 | 岩漿紅(+) / 銀灰(−) 側邊標籤 | 視覺成本透明化 |
| 連鎖更新 | 淡色閃現或脈衝動畫 | 提示「自動轉換」（若實裝） |

**核心原則**：灰顯絕不等於「隱藏」——而是「系統決策邊界的清晰劃分」，強化 Terminal Noir 的「精密控制」美學。
