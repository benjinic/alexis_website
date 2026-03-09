import { SuitConfiguration } from '@/types/bespoke';
import ScanningOverlay from './ScanningOverlay';
import WireframeLayer from './WireframeLayer';
import FabricBlendLayer from './FabricBlendLayer';

interface SuitVisualizerProps {
  config: SuitConfiguration;
  sandboxMode: boolean;
}

const SuitVisualizer = ({ config, sandboxMode }: SuitVisualizerProps) => {
  const getStyleLabel = () => config.style === 'single-breasted' ? 'SB BASE' : 'DB BASE';
  const getLapelLabel = () => config.lapel.toUpperCase() + ' LAPEL';
  const getPocketLabel = () => config.pocket.toUpperCase() + ' POCKET';

  return (
    <div className="relative w-full h-full bg-carbon-light overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Visualizer container */}
      <div className="absolute inset-8 flex items-center justify-center">
        <div className="relative w-full max-w-[400px] aspect-[3/4]">
          {sandboxMode ? (
            <>
              <WireframeLayer label={getStyleLabel()} zIndex={0} color="#6b7280" visible={true} offsetIndex={0} />
              <WireframeLayer label={getLapelLabel()} zIndex={10} color="#3b82f6" visible={true} offsetIndex={1} />
              <WireframeLayer label={getPocketLabel()} zIndex={20} color="#22c55e" visible={true} offsetIndex={2} />
              <FabricBlendLayer fabric={config.fabric} sandboxMode={true} />
            </>
          ) : (
            <>
              {/* Grayscale base for blend demo */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#999] via-[#777] to-[#555]" />
              {/* Fabric blend layer */}
              <FabricBlendLayer fabric={config.fabric} sandboxMode={false} />
              {config.fabric === 'none' && (
                <div className="absolute inset-0 z-0 bg-carbon-lighter flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="terminal-text mb-2">SELECT FABRIC</p>
                    <p className="text-[10px] opacity-50">Choose a material to preview blend</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ScanningOverlay />

      {/* Config display */}
      <div className="absolute top-6 right-6 text-right z-40">
        <p className="terminal-text text-muted-foreground mb-1">ACTIVE CONFIG</p>
        <p className="font-display text-sm tracking-wider">
          {config.style.toUpperCase().replace('-', '_')}
        </p>
        <p className="font-display text-sm tracking-wider text-lava">
          {config.lapel.toUpperCase()} / {config.pocket.toUpperCase()}
        </p>
        {config.fabric !== 'none' && (
          <p className="font-mono text-[10px] text-terminal-green mt-1 tracking-wider">
            BLEND: {config.fabric.toUpperCase().replace('-', '_')}
          </p>
        )}
      </div>
    </div>
  );
};

export default SuitVisualizer;
