interface WireframeLayerProps {
  label: string;
  zIndex: number;
  color: string;
  visible: boolean;
  offsetIndex: number;
}

const WireframeLayer = ({ label, zIndex, color, visible, offsetIndex }: WireframeLayerProps) => {
  if (!visible) return null;

  const offset = offsetIndex * 16;

  return (
    <div 
      className="absolute border-2 border-dashed transition-all duration-300"
      style={{ 
        zIndex, 
        borderColor: color,
        backgroundColor: `${color}20`,
        top: `${offset}px`,
        left: `${offset}px`,
        right: `${offset}px`,
        bottom: `${offset}px`,
      }}
    >
      {/* Top-left label */}
      <div 
        className="absolute top-0 left-0 px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
        style={{ 
          backgroundColor: color, 
          color: '#0a0a0a',
        }}
      >
        Z-{zIndex} | {label}
      </div>

      {/* Corner markers */}
      <div className="absolute top-1 right-1 w-2 h-2" style={{ borderRight: `2px solid ${color}`, borderTop: `2px solid ${color}` }} />
      <div className="absolute bottom-1 left-1 w-2 h-2" style={{ borderLeft: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
      <div className="absolute bottom-1 right-1 w-2 h-2" style={{ borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
    </div>
  );
};

export default WireframeLayer;
