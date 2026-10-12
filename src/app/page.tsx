import type { Metadata } from 'next';
import RuleBreak from '@/components/home/RuleBreak';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: 'Alexis 雅思洋服 | Know the rules. Break one.',
  description: '香港量身西裝。西裝不是規矩，是起點。The suit is not the rule. It’s the beginning.',
};

// 待填：開帳前換成真實資料
const WHATSAPP_URL = 'https://wa.me/85200000000';
const INSTAGRAM_URL = 'https://www.instagram.com/';
const ADDRESS = '[新地址]';
const HOURS = '[營業時間]';

const CAST = [
  { name: 'MARCEL', src: '/images/lookbook/marcel.jpg', line: '軍裝外套配打褶褲。', brk: '一頂鴨舌扁帽' },
  { name: 'LEON', src: '/images/lookbook/leon-break.jpg', line: '炭灰粗花呢，three-roll-two。', brk: '白 T 恤代替恤衫' },
  { name: 'SILAS', src: '/images/lookbook/silas.jpg', line: '西裝守規矩。汗衫不。', brk: '白色汗衫' },
  { name: 'ADRIAN', src: '/images/lookbook/adrian-break.jpg', line: '海軍藍西裝，French front 恤衫。', brk: '開領，不打領帶' },
  { name: 'ELIAS', src: '/images/lookbook/elias.jpg', line: '西裝不分年紀，破規矩也不。', brk: '針織 polo' },
  { name: 'LUCIEN', src: '/images/lookbook/lucien-break.jpg', line: '朱古力啡西裝，墨綠領帶。', brk: '一對白襪' },
  { name: 'DANTE', src: '/images/lookbook/dante.jpg', line: '禮服守規矩。煲呔不。', brk: '煲呔解開' },
];

const STEPS = [
  { n: '01', t: '預約', e: 'Book', d: 'WhatsApp 約好時間，先講你想點穿、幾時要。' },
  { n: '02', t: '量身・選布', e: 'Measure & choose', d: '量身之後揀布料、揀款式，再一齊決定破邊一條規矩。' },
  { n: '03', t: '試身・取衣', e: 'Fit & collect', d: '試身修改，直至合身為止，然後取衣。' },
];

const SWATCHES = [
  { name: '炭灰粗花呢', en: 'Charcoal tweed', c: '#3b3a37' },
  { name: '海軍藍', en: 'Navy', c: '#1d2433' },
  { name: '中灰', en: 'Mid grey', c: '#6f6c69' },
  { name: '朱古力啡', en: 'Chocolate', c: '#3f2a20' },
  { name: '黑', en: 'Black', c: '#151515' },
  { name: '象牙白', en: 'Ivory', c: '#ece3cf' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Serif+TC:wght@400;500&family=Noto+Sans+TC:wght@400;500&display=swap"
        precedence="default"
      />

      <header className={styles.header}>
        <a href="#top" className={styles.wordmark} aria-label="Alexis 雅思洋服">ALEXIS</a>
        <nav className={styles.nav} aria-label="主選單">
          <a href="#rule">規矩與破格</a>
          <a href="#cast">七種穿法</a>
          <a href="#process">量身</a>
          <a href="#visit">到訪</a>
        </nav>
        <a href={WHATSAPP_URL} className={styles.headerCta}>預約量身</a>
      </header>

      {/* 1 開場 */}
      <section id="top" className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Alexis 雅思洋服 · Hong Kong · Est. 2023</p>
          <h1 className={styles.heroTitle}>
            The suit is not the rule.
            <em>It’s the beginning.</em>
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.heroZh}>西裝不是規矩，是起點。</p>
          <div className={styles.heroActions}>
            <a href={WHATSAPP_URL} className={styles.btnPrimary}>預約量身</a>
            <a href="#rule" className={styles.btnGhost}>看看怎樣穿</a>
          </div>
        </div>
        <figure className={styles.heroFig}>
          <img src="/images/lookbook/marcel.jpg" alt="MARCEL：軍裝外套、打褶褲、鴨舌扁帽" width={864} height={1080} />
        </figure>
      </section>

      {/* 2 規矩與破格 */}
      <section id="rule" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Know the rules. Break one.</p>
          <h2 className={styles.h2}>先懂規矩，再破一條。</h2>
          <p className={styles.lead}>
            八分紀律，兩分破格。每一次破規矩，都建立在正確的規矩之上：合身的肩線、準確的褲長、乾淨的褲頭。之後，只破一條。
          </p>
        </div>
        <RuleBreak />
      </section>

      {/* 3 七種穿法 */}
      <section id="cast" className={`${styles.section} ${styles.castSection}`}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Seven ways to wear it</p>
          <h2 className={styles.h2}>同一套西裝，不止一種男人。</h2>
        </div>
        <ul className={styles.cast}>
          {CAST.map((p) => (
            <li key={p.name} className={styles.castItem}>
              <img src={p.src} alt={`${p.name}：${p.line}`} width={864} height={1080} loading="lazy" />
              <div className={styles.castMeta}>
                <span className={styles.castName}>{p.name}</span>
                <span className={styles.castLine}>{p.line}</span>
                <span className={styles.castBreak}>破：{p.brk}</span>
              </div>
            </li>
          ))}
          <li className={styles.castCta}>
            <a href={WHATSAPP_URL}>
              <span className={styles.castCtaKicker}>No. 8</span>
              <span className={styles.castCtaTitle}>第八種，<br />由你決定。</span>
              <span className={styles.castCtaLink}>預約量身 →</span>
            </a>
          </li>
        </ul>
        <p className={styles.note}>造型圖由 AI 生成，用作穿法示範。</p>
      </section>

      {/* 4 量身三步 */}
      <section id="process" className={styles.process}>
        <div className={styles.sectionHead}>
          <p className={`${styles.kicker} ${styles.kickerLight}`}>Made to measure</p>
          <h2 className={styles.h2}>量身，三步。</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepN}>{s.n}</span>
              <h3 className={styles.stepT}>{s.t}<small>{s.e}</small></h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5 布料 */}
      <section id="cloth" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Cloth</p>
          <h2 className={styles.h2}>冬天的西裝，從布料開始。</h2>
          <p className={styles.lead}>以上每一套的布料都可以在舖內親手摸過再揀。</p>
        </div>
        <ul className={styles.swatches}>
          {SWATCHES.map((s) => (
            <li key={s.name}>
              <span className={styles.swatch} style={{ background: s.c }} />
              <span className={styles.swName}>{s.name}</span>
              <span className={styles.swEn}>{s.en}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 到訪 */}
      <section id="visit" className={styles.visit}>
        <div className={styles.visitInner}>
          <p className={`${styles.kicker} ${styles.kickerGold}`}>Visit</p>
          <h2 className={styles.h2}>新地址，新的開始。</h2>
          <dl className={styles.visitList}>
            <div><dt>地址</dt><dd>{ADDRESS}</dd></div>
            <div><dt>營業時間</dt><dd>{HOURS}</dd></div>
            <div><dt>預約</dt><dd>WhatsApp，或者經 Instagram 留言</dd></div>
          </dl>
          <p className={styles.visitTourist}>Visiting Hong Kong? Book a fitting before you arrive.</p>
          <div className={styles.heroActions}>
            <a href={WHATSAPP_URL} className={styles.btnLight}>WhatsApp 預約</a>
            <a href={INSTAGRAM_URL} className={styles.btnGhostLight}>Instagram</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footMark}>ALEXIS</span>
        <span>雅思洋服 · Hong Kong · Est. 2023</span>
        <span>© {new Date().getFullYear()} Alexis</span>
      </footer>
    </div>
  );
}
