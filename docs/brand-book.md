# ALEXIS 雅思洋服 — Brand Book（網站版）
**The suit is not the rule. It's the beginning.**

> 版本：1.1 · 最後更新：2026-10-15  
> **品牌規則以 Brand Book PDF Vol.01 為準**；本文件係網站實作版，同 PDF 有衝突時跟 PDF。  
> 第 2.0 節係網站用色方向（前舖淺色、工場深色）；第 2.1 節起嘅深色 Token 只適用於工場頁（`/bespoke`、AI 工具頁），數值以 `tailwind.config.ts`、`globals.css` 為準。

---

## 目錄

1. [品牌定位](#1-品牌定位)
2. [色彩系統](#2-色彩系統)
3. [字體系統](#3-字體系統)
4. [排版規範](#4-排版規範)
5. [動畫與互動語言](#5-動畫與互動語言)
6. [元件語言](#6-元件語言)
7. [語調與文案風格](#7-語調與文案風格)
8. [禁止清單](#8-禁止清單)

---

## 1. 品牌定位

**品牌名稱：** ALEXIS 雅思洋服 · EST. 2023 · 香港（對外少用「Bespoke」）  
**宣言：** The suit is not the rule. It's the beginning.（西裝不是規矩，是起點。）  
**口號：** **KNOW THE RULES. BREAK ONE.** — 80% 守規矩、20% 破一條  
**視覺語言：** 前舖淺色、簡潔留白；工場頁保留深底、終端機美學（Terminal Noir）

### 品牌個性關鍵字

| 關鍵字 | 說明 |
|--------|------|
| **Precision** | 每一條線都是精準運算，不容贅述 |
| **Restraint** | 克制的留白，沉默的奢華 |
| **Protocol** | 流程感 — 如同高訂本身的儀式 |
| **Ignition** | 熔岩紅的爆發點，代表客製的起點 |

---

## 2. 色彩系統

### 2.0 網站用色方向（跟 Brand Book PDF）

**前舖淺色、工場深色**：客人頁面用淺色；`/bespoke`、`/visual-intelligence`、`/ai-advisor` 等工場／AI 工具頁保留深色。

| 用途 | 色 | 備註 |
|------|----|------|
| 底色 | 暖白 `#FCFAF6` | **待老闆拍板**：建議 B 暖白；另有 A 純白 `#FFFFFF`、C 米色 |
| 區塊 | 米白 `#FAF3E7` | |
| 卡片／分隔線 | 米色 `#F2E3CA` | |
| 文字 | 墨色 `#1A1A1A` | |
| 強調 | 品牌紫 `#682872` | 每畫面只出現一處 |
| 工場頁底色 | 墨色 `#1A1A1A` | 熔岩紅只用喺深色頁 |

中文字體：Noto Serif TC（Tailwind `font-zh-serif`）。

> 淺色 Token 同 `font-zh-serif` 暫時只喺 `feat/light-brand-theme`，未入 `main`；底色拍板後由淺色版 PR 加入，再更新本節。

### 2.1 工場頁調色盤（深色）

工場頁採用**深色**設計。所有顏色均已定義為 Tailwind CSS custom token。

#### 背景層

| Token 名稱 | HEX / HSL | 用途 |
|-----------|-----------|------|
| `carbon-black` | `#1F1F1F` | 大部分頁面使用的次要底色 |
| `--carbon` | `hsl(0 0% 4%)` ≈ `#0a0a0a` | 最深底層，body / full-screen overlay |
| `--carbon-light` | `hsl(0 0% 8%)` ≈ `#141414` | Card 背景 |
| `--carbon-lighter` | `hsl(0 0% 12%)` ≈ `#1f1f1f` | Input / Secondary 背景 |
| `bg-zinc-950` | `#09090b` | Visualizer 工具面板底色 |
| `bg-zinc-900` | `#18181b` | Visualizer 畫布佔位底色 |

#### 主文字

| Token 名稱 | HEX / HSL | 用途 |
|-----------|-----------|------|
| `--foreground` | `hsl(0 0% 95%)` ≈ `#f2f2f2` | 主要正文 |
| `text-white` | `#ffffff` | 大標題、高對比強調 |
| `silver-grey` | `#B5B5B5` | 次要說明文字 |
| `--muted-foreground` | `hsl(0 0% 55%)` ≈ `#8c8c8c` | placeholder、標籤、提示 |
| `text-zinc-500` | `#71717a` | Visualizer 靜態提示文字 |
| `dim-grey` | `#78716C` | 低調次要資訊 |

#### 品牌強調色

| Token 名稱 | HEX / HSL | 用途 |
|-----------|-----------|------|
| `lava-red` | `#F42B26` | 首頁互動 hover 高亮 |
| `inferno` | `#A40000` | 品牌深紅，印刷用 |
| `--lava` / `--accent` | `hsl(0 85% 55%)` ≈ `#e83b3b` | 全站系統主色 — CTA、Ring、Sidebar primary |
| `--lava-glow` | `hsl(0 85% 65%)` ≈ `#ef6363` | 發光效果用（shadow/glow） |
| `amber-earth` | `#E7870A` | 偵錯/狀態指示（Debug overlay） |

#### 輔助色

| Token 名稱 | HEX / HSL | 用途 |
|-----------|-----------|------|
| `midnight-violet` | `#261132` | 深紫色調，備用裝飾層 |
| `graphite` | `#40363E` | 項目選中/hover 的中間色調 |
| `dirty-grey` | `#f9fafa` | 淺色模式 fallback（目前極少使用） |
| `--terminal-green` | `hsl(142 70% 45%)` ≈ `#16a34a` | 系統就緒 / 成功狀態 |
| `--steel` | `hsl(0 0% 35%)` ≈ `#595959` | 邊線、分隔器 |

#### 邊框

| Token 名稱 | HSL | 用途 |
|-----------|-----|------|
| `--border` | `hsl(0 0% 18%)` ≈ `#2e2e2e` | 卡片、輸入框邊框 |
| `border-zinc-800` | `#27272a` | Visualizer 內部邊框 |

### 2.2 設計語意映射

```
背景層（從深到淺）
──────────────────────────────────
#0a0a0a  (--carbon)       → Scene 底層
#141414  (--carbon-light) → Card 背景
#1f1f1f  (--carbon-lighter / carbon-black) → Input / hover
#2e2e2e  (--border)       → 邊線
#595959  (--steel)        → 分隔
#8c8c8c  (--muted-fg)     → 靜態提示
#b5b5b5  (silver-grey)    → 次要說明
#f2f2f2  (--foreground)   → 主文字
#ffffff  (white)          → 強調標題
──────────────────────────────────
強調色
#e83b3b  (--lava)         → 全站 CTA、系統主色
#F42B26  (lava-red)       → 首頁互動 hover
#A40000  (inferno)        → 印刷品牌紅
#16a34a  (terminal-green) → 成功狀態
```

### 2.3 漸層 Token

```css
--gradient-lava:   linear-gradient(135deg, hsl(0 85% 55%), hsl(15 90% 50%));   /* 主要 CTA 按鈕 */
--gradient-carbon: linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 4%));        /* 卡片背景漸層 */
--gradient-scan:   linear-gradient(180deg, transparent, hsl(0 85% 55%/0.3), transparent); /* 掃描線特效 */
```

### 2.4 陰影 / Glow Token

```css
--shadow-lava: 0 0 30px hsl(0 85% 55% / 0.4);  /* Lava 元素外光 */
--shadow-glow: 0 0 60px hsl(0 85% 55% / 0.2);  /* 大範圍環境光 */
```

---

## 3. 字體系統

網站使用 **5 種 Google Fonts**，各有明確的語意分工，由 `next/font/google` 以 CSS 變數形式載入。

### 3.1 字體清單

| Tailwind Class | CSS 變數 | 字體名稱 | 角色 |
|---------------|---------|---------|------|
| `font-condensed` | `--font-roboto-condensed` | **Roboto Condensed** | 主要大標題（H1–H3） |
| `font-sans` | `--font-roboto` | **Roboto** | 導覽、Body 正文 |
| `font-space` | `--font-space-mono` | **Space Mono** | 數字、尺碼、測量數據 |
| `font-jetbrains` | `--font-jetbrains-mono` | **JetBrains Mono** | 系統指令、Terminal UI |
| `font-roboto` / `font-mono` | `--font-roboto-mono` / `--font-geist-mono` | **Roboto Mono** | 一般 inline code、標籤 |
| *(CSS import)* | — | **Orbitron** | Heading terminal style（`.terminal-heading` class） |

> **body 預設：** `font-mono`（Roboto Mono → Geist Mono fallback）

### 3.2 字體語意規則

```
標題（品牌感）   → font-condensed  (Roboto Condensed)  uppercase + tracking
副標 / Navigation → font-sans       (Roboto)             uppercase + tracking-[0.2em]
數字 / 規格數據  → font-space       (Space Mono)         monospace precision
System / Terminal → font-jetbrains  (JetBrains Mono)     uppercase + tracking-widest
Body長文          → font-sans       (Roboto)             normal case, leading-relaxed
Label / Tag       → font-mono       (Roboto Mono)        10px, uppercase, tracking-[0.25em]
```

### 3.3 全站預設 CSS Class

```css
.terminal-text {
  font-family: var(--font-roboto-mono);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem; /* text-xs */
}

.terminal-heading {
  font-family: 'Orbitron', monospace;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-weight: 700; /* bold */
}
```

---

## 4. 排版規範

### 4.1 字號層級

| 層級 | Class | Responsive | 字體 | 用途 |
|------|-------|-----------|------|------|
| **Display** | `text-7xl` | `lg:text-7xl` | `font-condensed font-black` | Hero 主標題 |
| **H1** | `text-6xl` | `md:text-6xl` | `font-condensed font-black` | 頁面大標 |
| **H2** | `text-4xl` | `md:text-4xl` | `font-condensed font-black` | 區塊標題 |
| **H3** | `text-3xl` | `md:text-3xl` | `font-condensed font-bold` | 卡片標題 |
| **Lead** | `text-lg` | — | `font-sans` | 引言、重點摘要 |
| **Body** | `text-sm` | — | `font-sans` | 正文 |
| **Label** | `text-xs` | — | `font-mono uppercase` | caption、標籤 |
| **Micro** | `text-[10px]` | — | `font-mono uppercase` | 系統提示、HUD 元素 |
| **Nano** | `text-[9px]` | — | `font-mono uppercase` | 極細 Tag（偵錯用） |

### 4.2 Letter Spacing 規範

| 情境 | 值 | 備註 |
|------|----|------|
| 大標題（預設）| `tracking-[0.2em]` | 品牌標準寬間距 |
| 大標題（hover）| `tracking-[0.5em]` | 互動放大時用 |
| 緊排標題 | `tracking-tighter` | 副標 / 密集排版 |
| Label / Tag | `tracking-widest` | 極寬間距，小字強調 |
| Terminal 系統字 | `tracking-[0.25em]` | HUD、狀態列 |
| 品牌大字 | `tracking-[0.3em]` | Orbitron 固定間距 |

### 4.3 行高

| 情境 | Class |
|------|-------|
| 正文段落 | `leading-relaxed` |
| 標題 | `leading-none` |
| 清單 | `leading-loose`（可視情況調整） |

---

## 5. 動畫與互動語言

### 5.1 全站 Keyframes

```css
/* 掃描線：上下反覆平移，用於 loading / scan overlay */
@keyframes scan        { 0%→↑  100%→↓ }

/* Lava Glow 呼吸：opacity 0.4 ↔ 0.8 */
@keyframes pulse-glow  { 0%,100%: 0.4 · 50%: 0.8 }

/* 螢幕閃爍（老 CRT 感）: opacity 1 → 0.95 → 0.98 */
@keyframes flicker     { fast, subtle }

/* 資料流背景：background-position 垂直捲動 */
@keyframes data-stream { 0%→100%, 20s linear infinite }
```

### 5.2 使用規則

| 動畫 | Class | 場景 |
|------|-------|------|
| Scan Line | `animate-scan` | Loading overlay、Scanning UI |
| Lava Glow Pulse | `animate-pulse-glow` | CTA hover 光暈、邊框 active |
| Flicker | `animate-flicker` | Terminal 開機、系統中斷 |
| Data Stream | `animate-data-stream` | 背景紋理、資料流視覺 |

### 5.3 過場原則

- **Duration：** 標準 `duration-500`；快速 `duration-200`；極快 `duration-150`
- **Easing：** 預設 `ease-out`（滑入感）；物理動作用 `ease-in-out`
- **Scale Hover：** `scale-110`（主要元素）、`scale-105`（次要）
- **避免：** bounce、spring 等「俏皮」easing；全站保持冷靜

---

## 6. 元件語言

### 6.1 卡片

```
背景：bg-[#09090b] 或 bg-zinc-950
邊框：border border-zinc-800（1px solid）
圓角：rounded-sm（0.125rem，接近直角）
內距：p-5
```

> 原則：**不使用圓角卡片**，sharp edge 強化精工感。

### 6.2 按鈕

**Primary CTA（白底深字）**
```
bg-white text-black hover:bg-zinc-200
font-mono text-xs uppercase tracking-widest
py-4 px-8
```

**Secondary（透明邊框）**
```
border border-zinc-700 bg-transparent
text-zinc-300 hover:text-white hover:bg-zinc-900
font-mono text-xs uppercase tracking-widest
```

**System / Terminal 按鈕**
```
bg-[--lava] text-white（或 bg-gradient-lava）
font-mono uppercase tracking-widest
glow-lava（hover 時亮 shadow）
```

### 6.3 表單 Input

```
bg-[--carbon-lighter] border border-[--border]
text-[--foreground] placeholder:text-[--muted-foreground]
font-mono text-sm
rounded-sm
focus:ring-1 focus:ring-[--ring]（lava 色）
```

### 6.4 標籤 / Tag

```
font-mono text-[10px] uppercase tracking-[0.25em]
顏色根據語意：
  成功 → text-[--terminal-green]  (#16a34a)
  系統 → text-[--muted-foreground]
  警告 → text-[amber-earth]       (#E7870A)
  錯誤 → text-[--lava]
```

### 6.5 Divider / 邊線

```
border-t border-[--border]  （水平分隔）
border-l border-zinc-800     （左邊線）
```

### 6.6 Badge / Status Indicator

```
px-2 py-0.5
font-mono text-[9px] uppercase tracking-widest
顏色同 Tag 規範
```

### 6.7 Layout 基礎

```
最大寬度：max-w-7xl mx-auto px-6
側邊欄：w-64（Desktop），Overlay（Mobile）
分欄：grid grid-cols-12（主要頁面）
```

---

## 7. 語調與文案風格

### 7.1 UI Copywriting 規則

| 場景 | 規則 | 範例 |
|------|------|------|
| 按鈕 / CTA | 全大寫，動詞開頭，底線取代空格 | `INITIALIZE_CUSTOMIZATION` |
| 系統訊息 | 終端機格式，`>` 開頭 | `> Loading Configurator Modules...` |
| 狀態標籤 | 全大寫，斜線分隔 | `SYS.PDP // p_001` |
| 錯誤提示 | 全大寫，簡短精準 | `ASSET_NOT_FOUND` |
| 載入中 | `...` 結尾，terminal 感 | `INITIALIZING_ENGINE...` |
| 頁面標題 | 全大寫，間距 wide | `ALEXIS BESPOKE` |
| 描述性正文 | 正常句子，有溫度但不過份熱情 | 繁體中文正文保持標準書面語 |

### 7.2 命名慣例（元件 ID / Class）

- 系統 ID：`SYS.XXX` 格式
- 功能碼：`_` 底線分隔，全大寫（`FABRIC_BLEND`）
- 座標/層級：`Z--10 | FABRIC BLEND`（Visualizer 偵錯標籤）

### 7.3 元數據（Metadata）

```
title:       ALEXIS BESPOKE | Visual Archive
description: Digital Protocol for Modern Bespoke Tailoring
```

---

## 8. 禁止清單

以下設計決策與品牌不符。標 *（工場頁）* 嘅只適用於深色工場頁；客人頁面跟第 2.0 節淺色方向。

| 禁止 | 原因 |
|------|------|
| 圓角卡片（`rounded-xl` 以上） | 過於柔和，失去精工感 |
| 彩色漸層背景（非 lava 系） | 破壞單色品牌底層 |
| 白色背景頁面 *（工場頁）* | 工場頁保留深色；客人頁面反而用淺色 |
| 中文大標題（無 uppercase 英文版本） | 標題層級保留英文 uppercase |
| drop shadow on text（body 層級） | 僅大標題可用 drop-shadow |
| Bounce / Spring animation | 破壞冷峻氛圍 |
| Rounded button（`rounded-full`） | 品牌使用 sharp / `rounded-sm` |
| 多色文字 *（工場頁）* | 只允許 white / muted / lava 三色文字 |
| 有顏色底色的大面積區塊 *（工場頁）* | 除 lava CTA 之外，區塊均以深灰/黑為底 |
| 熔岩紅用喺淺色頁 | 熔岩紅只屬工場深色頁 |
| 每畫面多過一處品牌紫 | 品牌紫 `#682872` 每畫面只出現一處 |

---

*ALEXIS 雅思洋服 Brand Book（網站版）· v1.1 · 2026-10-15*  
*品牌規則以 Brand Book PDF Vol.01 為準；工場頁 Token 數值以 `tailwind.config.ts` 及 `src/app/globals.css` 為準。*
