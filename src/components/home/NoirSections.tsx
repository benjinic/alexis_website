'use client';

import { useState } from 'react';
import Link from 'next/link';

// 待填：開帳前換成真實資料
export const WHATSAPP_URL = 'https://wa.me/85200000000';
const ADDRESS = '[新地址]';
const HOURS = '[營業時間]';

// 品牌規矩：白底係「規矩」，品牌紫係「破嗰一條」—— 每一屏最多一樣嘢用紫色。

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
    <p className="font-jetbrains text-[11px] tracking-[0.3em] text-stone-500 mb-6">
      {n} / {label}
    </p>
  );
}

export default function NoirSections() {
  const [active, setActive] = useState(0);
  const pair = PAIRS[active];

  return (
    <div className="bg-brand-paper text-brand-ink">
      {/* 01 THE RULES */}
      <section id="rules" className="scroll-mt-20 px-4 md:px-12 py-20 md:py-32 max-w-6xl mx-auto">
        <Kicker n="01" label="THE RULES" />
        <h2 className="font-condensed font-black text-4xl md:text-6xl tracking-tight leading-[1.05]">
          THE SUIT IS NOT THE RULE.
          <span className="block text-stone-600">IT&rsquo;S THE BEGINNING.</span>
        </h2>
        <p className="font-zh-serif text-xl md:text-2xl text-stone-800 mt-6">西裝不是規矩，是起點。</p>
        <p className="font-zh-serif text-stone-600 mt-6 max-w-2xl leading-relaxed">
          八分紀律，兩分破格。每一次破規矩，都建立在正確的規矩之上：合身的肩線、準確的褲長、乾淨的褲頭。之後，只破一條。
        </p>

        <div className="mt-14">
          <div className="flex gap-2 mb-6" role="tablist" aria-label="選擇造型">
            {PAIRS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`font-condensed text-sm tracking-[0.25em] px-4 py-2 border transition-colors ${
                  i === active ? 'bg-brand-ink text-white border-brand-ink' : 'border-black/20 text-stone-600 hover:text-brand-ink'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-4xl">
            {[
              { img: pair.rule, label: 'RULE', cls: 'text-stone-600', alt: '守規矩版' },
              { img: pair.brk, label: 'BREAK ONE', cls: 'text-brand-accent', alt: '破一條規矩' },
            ].map((v) => (
              <figure key={v.label}>
                <img
                  src={v.img.src}
                  alt={`${pair.name}：${v.alt}`}
                  width={864}
                  height={1080}
                  loading="lazy"
                  className="w-full h-auto block"
                />
                <figcaption className="pt-3 flex flex-col gap-1">
                  <span className={`font-condensed font-bold text-sm tracking-[0.3em] ${v.cls}`}>{v.label}</span>
                  <span className="font-zh-serif text-sm md:text-base text-stone-700">{v.img.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 02 LOOKBOOK */}
      <section id="lookbook" className="scroll-mt-20 px-4 md:px-12 py-20 md:py-32 bg-brand-mist">
        <div className="max-w-6xl mx-auto">
          <Kicker n="02" label="LOOKBOOK" />
          <h2 className="font-condensed font-black text-4xl md:text-6xl tracking-tight leading-[1.05]">
            SEVEN WAYS TO WEAR IT.
          </h2>
          <p className="font-zh-serif text-xl md:text-2xl text-stone-800 mt-6">同一套西裝，不止一種男人。</p>

          <ul className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {CAST.map((p) => (
              <li key={p.name}>
                <img src={p.src} alt={`${p.name}：${p.line}`} width={864} height={1080} loading="lazy" className="w-full h-auto block" />
                <div className="pt-3 flex flex-col gap-1">
                  <span className="font-condensed font-bold text-sm tracking-[0.3em]">{p.name}</span>
                  <span className="font-zh-serif text-sm text-stone-700">{p.line}</span>
                  <span className="font-jetbrains text-[11px] tracking-wider text-stone-500">BREAK / {p.brk}</span>
                </div>
              </li>
            ))}
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between aspect-[4/5] p-5 md:p-7 bg-brand-accent text-white hover:opacity-90 transition-opacity"
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
          <p className="font-zh-serif text-xs text-stone-500 mt-8">造型圖由 AI 生成，用作穿法示範。</p>
        </div>
      </section>

      {/* 03 VISIT */}
      <section id="visit" className="scroll-mt-20 px-4 md:px-12 py-20 md:py-28 border-t border-brand-line">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <Kicker n="03" label="VISIT" />
            <h2 className="font-condensed font-black text-4xl md:text-5xl tracking-tight">MADE TO MEASURE.</h2>
            <p className="font-zh-serif text-stone-700 mt-6">量身，三步：預約、量身・選布、試身・取衣。</p>
            <p className="font-condensed italic text-stone-600 mt-6 tracking-wide">
              Visiting Hong Kong? Book a fitting before you arrive.
            </p>
          </div>
          <div className="font-zh-serif">
            <dl className="divide-y divide-brand-line border-y border-brand-line">
              <div className="grid grid-cols-[96px_1fr] gap-4 py-4">
                <dt className="font-jetbrains text-[11px] tracking-[0.25em] text-stone-500 pt-1">ADDRESS</dt>
                <dd>{ADDRESS}</dd>
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-4 py-4">
                <dt className="font-jetbrains text-[11px] tracking-[0.25em] text-stone-500 pt-1">HOURS</dt>
                <dd>{HOURS}</dd>
              </div>
            </dl>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 border border-brand-ink px-6 py-3 font-condensed font-bold tracking-[0.3em] text-sm hover:bg-brand-ink hover:text-white transition-colors"
            >
              WHATSAPP 預約
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20 pt-6 border-t border-brand-line flex flex-wrap gap-x-6 gap-y-2 font-jetbrains text-[11px] tracking-[0.25em] text-stone-500">
          <span>STUDIO TOOLS</span>
          <Link href="/bespoke" className="hover:text-brand-ink transition-colors">BESPOKE</Link>
          <Link href="/visual-intelligence" className="hover:text-brand-ink transition-colors">AI ADVISOR</Link>
          <Link href="/ai-advisor" className="hover:text-brand-ink transition-colors">AI STYLIST</Link>
        </div>
      </section>
    </div>
  );
}
