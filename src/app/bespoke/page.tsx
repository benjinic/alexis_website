'use client'; // Next.js 必須宣告這是客戶端元件

import { useState } from 'react';
import { SuitConfiguration } from '@/types/bespoke';
import ConfigPanel from '@/components/bespoke/ConfigPanel';
import SuitVisualizer from '@/components/bespoke/SuitVisualizer';

export default function BespokePage() {
  const [config, setConfig] = useState<SuitConfiguration>({
    style: 'single-breasted',
    lapel: 'notch',
    pocket: 'flap',
    fabric: 'navy-wool',
  });

  const [sandboxMode, setSandboxMode] = useState(true);

  const handleConfigChange = (changes: Partial<SuitConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...changes }));
  };

  return (
    // 這裡的佈局與原本的 Index.tsx 相同
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <div className="w-[380px] flex-shrink-0 relative z-10">
        <ConfigPanel
          config={config}
          onConfigChange={handleConfigChange}
          sandboxMode={sandboxMode}
          onSandboxToggle={setSandboxMode}
        />
      </div>
      <div className="flex-1 relative">
        <SuitVisualizer config={config} sandboxMode={sandboxMode} />
      </div>
    </div>
  );
}