'use client';

import type { SuitConfiguration } from '@/types/bespoke';
import { FABRIC_OPTIONS, LAPEL_OPTIONS, POCKET_OPTIONS, STYLE_OPTIONS } from '@/types/bespoke';

interface ConfigPanelProps {
  config: SuitConfiguration;
  onConfigChange: (changes: Partial<SuitConfiguration>) => void;
  sandboxMode: boolean;
  onSandboxToggle: (enabled: boolean) => void;
}

export default function ConfigPanel({
  config,
  onConfigChange,
  sandboxMode,
  onSandboxToggle,
}: ConfigPanelProps) {
  return (
    <div className="h-full border-r border-zinc-800 bg-zinc-950/80 p-4 text-zinc-100">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wider uppercase">Bespoke Config</h2>

        <div>
          <label className="mb-2 block text-xs text-zinc-400">Style</label>
          <select
            value={config.style}
            onChange={(event) => onConfigChange({ style: event.target.value as SuitConfiguration['style'] })}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {STYLE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-400">Lapel</label>
          <select
            value={config.lapel}
            onChange={(event) => onConfigChange({ lapel: event.target.value as SuitConfiguration['lapel'] })}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {LAPEL_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-400">Pocket</label>
          <select
            value={config.pocket}
            onChange={(event) => onConfigChange({ pocket: event.target.value as SuitConfiguration['pocket'] })}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {POCKET_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-400">Fabric</label>
          <select
            value={config.fabric}
            onChange={(event) => onConfigChange({ fabric: event.target.value as SuitConfiguration['fabric'] })}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            {FABRIC_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
          <span>Sandbox Mode</span>
          <input
            type="checkbox"
            checked={sandboxMode}
            onChange={(event) => onSandboxToggle(event.target.checked)}
            className="h-4 w-4 accent-red-500"
          />
        </label>
      </div>
    </div>
  );
}
