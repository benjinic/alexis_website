import { FabricOption, FabricType } from '@/types/bespoke';
import type { StaticImageData } from 'next/image';

import navyWool from '@/app/assets/fabrics/navy-wool.jpg';
import charcoalPinstripe from '@/app/assets/fabrics/charcoal-pinstripe.jpg';
import brownGlenPlaid from '@/app/assets/fabrics/brown-glen-plaid.jpg';
import blackHerringbone from '@/app/assets/fabrics/black-herringbone.jpg';

interface FabricSelectorProps {
  options: FabricOption[];
  value: FabricType;
  onChange: (value: FabricType) => void;
}

const fabricImages: Record<string, string | StaticImageData> = {
  'navy-wool': navyWool,
  'charcoal-pinstripe': charcoalPinstripe,
  'brown-glen-plaid': brownGlenPlaid,
  'black-herringbone': blackHerringbone,
};

const FabricSelector = ({ options, value, onChange }: FabricSelectorProps) => {
  return (
    <div className="space-y-3">
      {/* Module header */}
      <div className="flex items-center justify-between">
        <h3 className="terminal-text text-muted-foreground">布料材質</h3>
        <span className="font-mono text-[10px] text-lava">FABRIC_BLEND_MODULE</span>
      </div>

      {/* Blend mode indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-carbon-lighter border border-border">
        <div className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
        <span className="text-[10px] font-mono text-terminal-green tracking-wider">
          MIX-BLEND: MULTIPLY
        </span>
      </div>

      {/* Fabric swatches */}
      <div className="grid grid-cols-5 gap-2">
        {options.map((option) => {
          const isActive = value === option.id;
          const img = fabricImages[option.id];
          const imgSrc = img ? (typeof img === 'string' ? img : img.src) : undefined;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
                relative aspect-square border-2 transition-all duration-200 overflow-hidden group
                ${isActive 
                  ? 'border-lava glow-lava scale-110 z-10' 
                  : 'border-border hover:border-muted-foreground'
                }
              `}
              title={option.label}
            >
              {option.id === 'none' ? (
                <div className="absolute inset-0 bg-carbon-lighter flex items-center justify-center">
                  <span className="text-[8px] font-mono text-muted-foreground">OFF</span>
                </div>
              ) : imgSrc ? (
                <img src={imgSrc} alt={option.label} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div 
                  className="absolute inset-0" 
                  style={{ backgroundColor: option.colorHint }} 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active fabric detail */}
      {value !== 'none' && (
        <div className="px-4 py-3 border border-lava/30 bg-lava/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-wider">
              {options.find(o => o.id === value)?.code}
            </span>
            <span className="text-[10px] text-lava font-mono">ACTIVE</span>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-wider">
            {options.find(o => o.id === value)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default FabricSelector;
