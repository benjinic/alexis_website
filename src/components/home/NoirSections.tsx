'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { WHATSAPP_URL, ADDRESS, ADDRESS_EN, PHONE, PHONE_URL, HOURS, HOURS_EN } from '@/lib/shop';

// 品牌規矩：白底係「規矩」，品牌紫係「破嗰一條」—— 每一屏最多一樣嘢用紫色。
// 每個品牌頁自成一屏（唔做長下拉）：頁面高度 = 一個畫面，內容按畫面高度縮放。

const PAIRS = [
  {
    name: 'ADRIAN',
    rule: { src: '/images/lookbook/adrian-rule.jpg', text: '海軍藍西裝，白恤衫，領帶。' },
    brk: { src: '/images/lookbook/adrian-break.jpg', text: '解開領口，不打領帶。' },
  },
  {
    name: 'LEON',
    rule: { src: '/images/lookbook/leon-rule.jpg', text: '炭灰粗花呢西裝，白恤衫，灰領帶。' },
    brk: { src: '/images/lookbook/leon-break.jpg', text: '一件白 T 恤。' },
  },
  {
    name: 'LUCIEN',
    rule: { src: '/images/lookbook/lucien-rule.jpg', text: '朱古力啡西裝，淺藍恤衫，墨綠領帶，深色襪。' },
    brk: { src: '/images/lookbook/lucien-break.jpg', text: '一對白襪。' },
  },
];

const CAST = [
  { name: 'MARCEL', src: '/images/lookbook/marcel.jpg', line: '軍裝外套配打褶褲。', brk: '一頂鴨舌扁帽' },
  { name: 'LEON', src: '/images/lookbook/leon-break.jpg', line: '炭灰粗花呢，three-roll-two。', brk: '白 T 恤代替恤衫' },
  { name: 'SILAS', src: '/images/lookbook/silas.jpg', line: '西裝守規矩。汗衫不。', brk: '白色汗衫' },
  { name: 'ADRIAN', src: '/images/lookbook/adrian-break.jpg', line: '海軍藍西裝，French front 恤衫。', brk: '開領，不打領帶' },
  { name: 'ELIAS', src: '/images/lookbook/elias.jpg', line: '西裝不分年紀，破規矩也不。', brk: '針織 polo' },
  { name: 'LUCIEN', src: '/images/lookbook/lucien-break.jpg', line: '朱古力啡西裝，墨綠領帶。', brk: '一對白襪' },
  { name: 'DANTE', src: '/images/lookbook/dante.jpg', line: '禮服守規矩。煲呔不。', brk: '煲呔解開' },
];

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <p className="font-jetbrains text-[11px] tracking-[0.3em] text-stone-500 mb-3 md:mb-6">
      {n} / {label}
    </p>
  );
}

// 一屏版面：扣除頂部 header（約 64px），內容垂直置中
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-brand-paper text-brand-ink pt-20 pb-4 md:pb-6 px-4 md:px-12 flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto">{children}</div>
    </div>
  );
}

export function RulesSection() {
  const [active, setActive] = useState(0);
  const pair = PAIRS[active];

  return (
    <Screen>
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-12 items-center">
        <div>
          <Kicker n="01" label="THE RULES" />
          <h1 className="font-condensed font-black text-3xl md:text-6xl tracking-tight leading-[1.05]">
            THE SUIT IS NOT THE RULE.
            <span className="block text-stone-600">IT&rsquo;S THE BEGINNING.</span>
          </h1>
          <p className="font-zh-serif text-lg md:text-2xl text-stone-800 mt-3 md:mt-6">西裝不是規矩，是起點。</p>
          <p className="font-zh-serif text-sm md:text-base text-stone-600 mt-3 md:mt-6 max-w-xl leading-relaxed">
            八分紀律，兩分破格。每一次破規矩，都建立在正確的規矩之上：合身的肩線、準確的褲長、乾淨的褲頭。之後，只破一條。
          </p>
          <div className="flex gap-2 mt-4 md:mt-8" role="tablist" aria-label="選擇造型">
            {PAIRS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`min-h-11 font-condensed text-sm tracking-[0.25em] px-4 border transition-colors ${
                  i === active ? 'bg-brand-ink text-white border-brand-ink' : 'border-black/20 text-stone-600 hover:text-brand-ink'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {[
            { img: pair.rule, label: 'RULE', cls: 'text-stone-600', alt: '守規矩版' },
            { img: pair.brk, label: 'BREAK ONE', cls: 'text-brand-ink', alt: '破一條規矩' },
          ].map((v) => (
            <figure key={v.label}>
              <img
                src={v.img.src}
                alt={`${pair.name}：${v.alt}`}
                width={864}
                height={1080}
                className="w-full h-auto max-h-[38svh] md:max-h-[62svh] object-cover object-top block"
              />
              <figcaption className="pt-2 flex flex-col gap-1">
                <span className={`font-condensed font-bold text-xs md:text-sm tracking-[0.3em] ${v.cls}`}>{v.label}</span>
                <span className="font-zh-serif text-xs md:text-sm text-stone-700">{v.img.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Screen>
  );
}

export function LookbookSection() {
  const rail = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: number) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <Screen>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Kicker n="02" label="LOOKBOOK" />
          <h1 className="font-condensed font-black text-3xl md:text-6xl tracking-tight leading-[1.05]">
            SEVEN WAYS TO WEAR IT.
          </h1>
          <p className="font-zh-serif text-lg md:text-2xl text-stone-800 mt-2 md:mt-4">同一套西裝，不止一種男人。</p>
        </div>
        <div className="hidden md:flex gap-2 shrink-0">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="上一個造型" className="w-11 h-11 inline-flex items-center justify-center border border-black/20 hover:border-brand-ink transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="下一個造型" className="w-11 h-11 inline-flex items-center justify-center border border-black/20 hover:border-brand-ink transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 左右滑動，唔使向下碌 */}
      <ul
        ref={rail}
        className="mt-6 md:mt-10 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-0 pb-3 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:thin]"
      >
        {CAST.map((p) => (
          <li key={p.name} className="snap-start shrink-0 w-[62vw] max-w-[300px] md:w-auto">
            <img
              src={p.src}
              alt={`${p.name}：${p.line}`}
              width={864}
              height={1080}
              className="h-[46svh] md:h-[52svh] w-full md:w-auto aspect-[4/5] object-cover block"
            />
            <div className="pt-2 flex flex-col gap-1">
              <span className="font-condensed font-bold text-sm tracking-[0.3em]">{p.name}</span>
              <span className="font-zh-serif text-sm text-stone-700">{p.line}</span>
              <span className="font-jetbrains text-[11px] tracking-wider text-stone-500">BREAK / {p.brk}</span>
            </div>
          </li>
        ))}
        <li className="snap-start shrink-0 w-[62vw] max-w-[300px] md:w-auto">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between h-[46svh] md:h-[52svh] aspect-[4/5] p-5 md:p-7 bg-brand-ink text-white hover:opacity-90 transition-opacity"
          >
            <span className="font-jetbrains text-[11px] tracking-[0.3em]">NO. 8</span>
            <span className="font-zh-serif text-xl md:text-2xl leading-snug">
              第八種，
              <br />
              由你決定。
            </span>
            <span className="font-condensed font-bold text-sm tracking-[0.3em] border-t border-white/50 pt-3">BOOK NOW →</span>
          </a>
        </li>
      </ul>
      <p className="font-zh-serif text-xs text-stone-500 mt-3">造型圖由 AI 生成，用作穿法示範。左右滑動睇其他造型。</p>
    </Screen>
  );
}

export function VisitSection() {
  return (
    <Screen>
      <div className="grid md:grid-cols-2 gap-4 md:gap-12">
        <div>
          <Kicker n="03" label="VISIT" />
          <h1 className="font-condensed font-black text-3xl md:text-5xl tracking-tight">MADE TO MEASURE.</h1>
          <p className="font-zh-serif text-stone-700 mt-3 md:mt-6">量身，三步：預約、量身・選布、試身・取衣。</p>
          <p className="font-condensed italic text-stone-600 mt-2 md:mt-6 tracking-wide">
            Visiting Hong Kong? Book a fitting before you arrive.
          </p>
        </div>
        <div className="font-zh-serif">
          <dl className="divide-y divide-brand-line border-y border-brand-line">
            <div className="grid grid-cols-[88px_1fr] gap-4 py-2 md:py-4">
              <dt className="font-jetbrains text-[11px] tracking-[0.25em] text-stone-500 pt-1">ADDRESS</dt>
              <dd>
                {ADDRESS}
                <span className="block font-condensed text-sm text-stone-500 mt-1 tracking-wide">{ADDRESS_EN}</span>
              </dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] gap-4 py-1 md:py-2 items-center">
              <dt className="font-jetbrains text-[11px] tracking-[0.25em] text-stone-500">TEL</dt>
              <dd>
                <a href={PHONE_URL} className="inline-flex items-center min-h-11 underline-offset-4 hover:underline">{PHONE}</a>
              </dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] gap-4 py-2 md:py-4">
              <dt className="font-jetbrains text-[11px] tracking-[0.25em] text-stone-500 pt-1">HOURS</dt>
              <dd>
                {HOURS}
                <span className="block font-condensed text-sm text-stone-500 mt-1 tracking-wide">{HOURS_EN}</span>
              </dd>
            </div>
          </dl>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-11 mt-4 md:mt-8 border border-brand-ink px-6 font-condensed font-bold tracking-[0.3em] text-sm hover:bg-brand-ink hover:text-white transition-colors"
          >
            WHATSAPP 預約
          </a>
        </div>
      </div>

      <div className="mt-5 md:mt-16 pt-2 border-t border-brand-line flex flex-wrap items-center gap-x-2 font-jetbrains text-[11px] tracking-[0.25em] text-stone-600">
        <span className="hidden md:inline mr-4">STUDIO TOOLS</span>
        <Link href="/bespoke" className="inline-flex items-center min-h-11 px-2 hover:text-brand-ink transition-colors">BESPOKE</Link>
        <Link href="/visual-intelligence" className="inline-flex items-center min-h-11 px-2 hover:text-brand-ink transition-colors">AI ADVISOR</Link>
        <Link href="/ai-advisor" className="inline-flex items-center min-h-11 px-2 hover:text-brand-ink transition-colors">AI STYLIST</Link>
      </div>
      <p className="font-jetbrains text-[10px] tracking-[0.2em] text-stone-500 mt-2">
        &copy; {new Date().getFullYear()} ALEXIS 雅思洋服 · EST. 2023 / HONG KONG
      </p>
    </Screen>
  );
}
