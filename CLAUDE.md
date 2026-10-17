# CLAUDE.md — Alexis 雅思洋服 網站

Claude Code 每次開工會先讀呢個檔案。內容係網站工作嘅交接：品牌規則、已定決定、進行中嘅 PR、下一步。

## 溝通

- 老闆（第二代）用廣東話溝通，回覆用廣東話。
- 保留原有功能同分頁結構；改動以「兼容 Brand Book」為目標，唔好推倒重來。
- 每項改動開新 branch + PR，唔好直接推 `main`。

## 專案

- Next.js 16（App Router + Pages API）、Tailwind、Firebase Hosting + Functions v2（`nextServer`，Cloud Run us-central1）、Genkit / Vertex AI。
- 正式站：https://alexis-bespoke.web.app
- 指令：`npm run dev`、`npm run build`、`npm run deploy:prod`（一定用呢個，唔好只 deploy hosting）。
- `deploy:prod` 只 deploy `functions:nextServer,hosting`。Firebase project `alexis-tailor-system-2025` 有 6 個唔屬於呢個 repo 嘅 function（`syncOrderAggregates`、`syncOrderItemAggregates`、`allocateOrderId`、`createStaffAccount`、`geminiProxy`、`listGeminiModels`）；全量 `firebase deploy` 會要求刪除佢哋而失敗。**絕對唔好刪呢啲 function，亦唔好用冇 `--only` 嘅 `firebase deploy`。**
- 本地 dev 冇 Firebase key 會報 `auth/invalid-api-key`：用假嘅 `NEXT_PUBLIC_FIREBASE_*` 值即可。

## 安全（必守）

- 唔好 commit `.env*`、service account JSON 或任何 key 值。
- 舊私鑰已刪除。Cloud 上用 ADC；`src/lib/firebase-admin.ts` 偵測 `K_SERVICE` / `FUNCTION_TARGET` 時唔用本地 key（PR #6）。

## 品牌規則（以 Brand Book PDF Vol.01 為準）

- 品牌名：ALEXIS 雅思洋服，EST. 2023，香港。對外少用「Bespoke」。
- 宣言：The suit is not the rule. It's the beginning.（西裝不是規矩，是起點。）
- 口號：**KNOW THE RULES. BREAK ONE.** — 80% 守規矩、20% 破一條。
- `docs/brand-book.md`（Terminal Noir）同 PDF 有衝突，要跟 PDF 同步。

### 網站用色（2026-10-15 定案 W1：白色為主調）

「前舖淺色、工場深色」：客人頁面用淺色；`/bespoke`、AI 工具頁保留深色。

| 用途 | 色 |
|---|---|
| 底色 | 白 `#FFFFFF`（`brand-paper`） |
| 區塊 | 中性淺灰 `#F5F5F5`（`brand-mist`） |
| 分隔線 | 淺灰 `#E6E6E6`（`brand-line`） |
| 文字 | 墨色 `#1A1A1A`（`brand-ink`） |
| 強調 | 品牌紫 `#682872`（`brand-accent`）：BOOK NOW 底色；每畫面只出現一處 |
| 工場頁底色 | 墨色 `#1A1A1A`；熔岩紅只用喺深色頁 |

中文字體：Noto Serif TC（Tailwind `font-zh-serif`）。

### 頁面架構（設計報告定案方向）

- 統一選單（Header 同首頁共用）：THE RULES · LOOKBOOK · PROCESS · CLOTH · BOOK NOW。
- 首頁四段：主視覺角色輪播 → 角色精選 → At Your Service（度身／WhatsApp 預約／AI 造型）→ 到訪門市。
- THE RULES 獨立頁：完整宣言 + 守規矩／破一條對照（ADRIAN、LEON、LUCIEN）。
- 工具頁：`/bespoke`、`/visual-intelligence`、`/ai-advisor` 由 Studio Tools 同頁尾進入；5 個客製入口合併到 `/bespoke`。
- `/bespoke/roadmap`、`/blueprint` 要登入先睇到；`/admin` 不變。
- 版面參考 Angelil 的簡潔；Zegna、WACKO MARIA 作氣質參考，不對外引用。

## 進行中

| 項目 | 狀態 |
|---|---|
| PR #4 `feat/noir-brand-alignment` | ❌ 已關閉（2026-10-17），由 PR #10 取代；分支保留作參考 |
| PR #10 `feat/light-theme-w1` | 淺色版 W1（基於 `feat/light-brand-theme`），取代 PR #4 |
| PR #5 `docs/roadmap-brand-alignment` | ROADMAP 品牌對齊路線 12 項 |
| PR #6 `fix/admin-use-adc-in-cloud` | ✅ 已合併並 deploy |
| PR #8 `chore/deploy-scope-and-health-fix` | ✅ 已合併並 deploy；`/api/health` 返 200（firestore、storage 都 true） |
| `docs/sync-brand-book-palette` | `docs/brand-book.md` 同步 PDF 用色（下一步第 5 項） |

## 下一步（按次序）

1. ~~合併 PR #6 → 從本地 `.env.production` 移除 `FIREBASE_PRIVATE_KEY` / `FIREBASE_CLIENT_EMAIL` → `npm run deploy:prod` → 測試 `/admin`、`/visual-intelligence`。~~ ✅ 完成：PR #6 已合併；本地 `.env.production` 已改名做 `.env.production.bak`；已 deploy `functions:nextServer,hosting`；`/admin`、`/visual-intelligence` 正常，`/api/admin/catalog` 讀到 Firestore。`/api/health` storage 權限修復（PR #8）已合併並 deploy，返 200。
2. ~~老闆揀底色後開淺色版 PR，關閉 PR #4。~~ 已揀 W1，淺色版 PR #10；PR #4 已關閉。
3. 實現統一選單、首頁四段、THE RULES 獨立頁。
4. 填真資料：`NoirSections.tsx` 裏 `WHATSAPP_URL`（現為 `https://wa.me/85200000000`）、ADDRESS、HOURS 都係佔位，等老闆提供。
5. ~~同步 `docs/brand-book.md` 到上面用色。~~ ✅ 第 1、2、8 節已對齊 PDF（`docs/sync-brand-book-palette`）；底色拍板後再更新第 2.0 節。

## 參考文件（claude.ai）

- Alexis 網站設計報告：https://claude.ai/artifact/RvYbsenjUJ9NMwoGS5LXmk
- Alexis Brand Book 修訂總表：https://claude.ai/artifact/XdZqMgt7buMRHceqwDmb7x
