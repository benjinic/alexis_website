const ScanningOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-muted-foreground/20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-muted-foreground/20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-muted-foreground/20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-muted-foreground/20" />

      {/* Status indicator */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span className="terminal-text text-terminal-green text-[10px]">RENDERING</span>
      </div>
    </div>
  );
};

export default ScanningOverlay;
