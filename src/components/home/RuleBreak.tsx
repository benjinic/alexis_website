'use client';

import { useState } from 'react';
import styles from '@/app/home.module.css';

type Pair = {
  name: string;
  rule: { src: string; text: string };
  brk: { src: string; text: string };
};

const PAIRS: Pair[] = [
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

export default function RuleBreak() {
  const [active, setActive] = useState(0);
  const pair = PAIRS[active];

  return (
    <div className={styles.rbWrap}>
      <div className={styles.rbTabs} role="tablist" aria-label="選擇造型">
        {PAIRS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? `${styles.rbTab} ${styles.rbTabOn}` : styles.rbTab}
            onClick={() => setActive(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.rbPair}>
        <figure className={styles.rbFig}>
          <img src={pair.rule.src} alt={`${pair.name}：守規矩版`} width={864} height={1080} loading="lazy" />
          <figcaption>
            <span className={styles.rbLabel}>規矩 · Rule</span>
            <span>{pair.rule.text}</span>
          </figcaption>
        </figure>
        <figure className={styles.rbFig}>
          <img src={pair.brk.src} alt={`${pair.name}：破一條規矩`} width={864} height={1080} loading="lazy" />
          <figcaption>
            <span className={`${styles.rbLabel} ${styles.rbLabelBreak}`}>破 · Break</span>
            <span>{pair.brk.text}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
