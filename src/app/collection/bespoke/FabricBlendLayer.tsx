import { FabricType } from '@/types/bespoke';
import type { StaticImageData } from 'next/image';

import navyWool from '@/assets/fabrics/navy-wool.jpg';
import charcoalPinstripe from '@/assets/fabrics/charcoal-pinstripe.jpg';
import brownGlenPlaid from '@/assets/fabrics/brown-glen-plaid.jpg';
import blackHerringbone from '@/assets/fabrics/black-herringbone.jpg';

interface FabricBlendLayerProps {
  fabric: FabricType;
  sandboxMode: boolean;
}

const fabricImages: Record<string, string | StaticImageData> = {
  'navy-wool': navyWool,
  'charcoal-pinstripe': charcoalPinstripe,
  'brown-glen-plaid': brownGlenPlaid,
  'black-herringbone': blackHerringbone,
};

const FabricBlendLayer = ({ fabric, sandboxMode }: FabricBlendLayerProps) => {
  if (fabric === 'none') return null;

  const img = fabricImages[fabric];
  if (!img) return null;

  const imageSrc = typeof img === 'string' ? img : img.src;

  if (sandboxMode) {
    return (
      <div 
        className="absolute inset-0 border-2 border-dashed flex items-center justify-center transition-all duration-300"
        style={{ 
          zIndex: 30, 
          borderColor: '#f97316',
          backgroundColor: '#f9731615',
          mixBlendMode: 'multiply',
        }}
      >
        <div className="text-center">
          <div 
            className="px-3 py-1.5 font-mono text-xs uppercase tracking-widest mb-2 inline-block"
            style={{ backgroundColor: '#f97316', color: '#0a0a0a' }}
          >
            Z-30 | FABRIC BLEND
          </div>
          <p className="font-mono text-[10px] text-[#f97316] tracking-wider">
            mix-blend-mode: multiply
          </p>
          {/* Show small texture preview */}
          <div className="mt-2 mx-auto w-16 h-16 border border-[#f97316]/50 overflow-hidden">
            <img src={imageSrc} alt="texture preview" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 transition-all duration-500"
      style={{ 
        zIndex: 30,
        mixBlendMode: 'multiply',
      }}
    >
      <img 
        src={imageSrc} 
        alt="fabric texture" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FabricBlendLayer;
