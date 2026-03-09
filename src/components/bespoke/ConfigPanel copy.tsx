import { SuitConfiguration, STYLE_OPTIONS, LAPEL_OPTIONS, POCKET_OPTIONS, FABRIC_OPTIONS } from '@/types/bespoke';
import FabricSelector from './FabricSelector';
import ModuleSelector from './ModuleSelector';
import { Switch } from '@/components/ui/switch';

interface ConfigPanelProps {
  config: SuitConfiguration;
  onConfigChange: (config: Partial<SuitConfiguration>) => void;
  sandboxMode: boolean;
  onSandboxToggle: (enabled: boolean) => void;
}

const ConfigPanel = ({ config, onConfigChange, sandboxMode, onSandboxToggle }: ConfigPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-lava glow-lava" />
          <h1 className="font-display text-lg tracking-[0.2em]">ALEXIS</h1>
        </div>
        <p className="terminal-text text-muted-foreground">BESPOKE CONFIGURATOR</p>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <ModuleSelector
          title="基礎版型"
          moduleCode="SYS_STYLE_MODULE"
          options={STYLE_OPTIONS}
          value={config.style}
          onChange={(style) => onConfigChange({ style })}
        />

        <div className="h-px bg-border" />

        <ModuleSelector
          title="領型配置"
          moduleCode="LAPEL_CONFIG"
          options={LAPEL_OPTIONS}
          value={config.lapel}
          onChange={(lapel) => onConfigChange({ lapel })}
        />

        <div className="h-px bg-border" />

        <ModuleSelector
          title="口袋配置"
          moduleCode="POCKET_CONFIG"
          options={POCKET_OPTIONS}
          value={config.pocket}
          onChange={(pocket) => onConfigChange({ pocket })}
        />

        <div className="h-px bg-border" />

        <FabricSelector
          options={FABRIC_OPTIONS}
          value={config.fabric}
          onChange={(fabric) => onConfigChange({ fabric })}
        />
      </div>

      {/* Footer controls */}
      <div className="p-6 border-t border-border space-y-4">
        {/* Sandbox toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="terminal-text text-muted-foreground">DEV SANDBOX</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              顯示圖層堆疊結構
            </p>
          </div>
          <Switch 
            checked={sandboxMode} 
            onCheckedChange={onSandboxToggle}
            className="data-[state=checked]:bg-lava"
          />
        </div>

        {/* Build info */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
            <span>BUILD v0.1.0-alpha</span>
            <span>2D_ENGINE::ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
