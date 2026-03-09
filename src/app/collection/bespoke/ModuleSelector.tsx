import { ModuleOption } from '@/types/bespoke';

interface ModuleSelectorProps<T> {
  title: string;
  moduleCode: string;
  options: ModuleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function ModuleSelector<T extends string>({ 
  title, 
  moduleCode, 
  options, 
  value, 
  onChange 
}: ModuleSelectorProps<T>) {
  return (
    <div className="space-y-3">
      {/* Module header */}
      <div className="flex items-center justify-between">
        <h3 className="terminal-text text-muted-foreground">{title}</h3>
        <span className="font-mono text-[10px] text-lava">{moduleCode}</span>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((option) => {
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
                w-full text-left px-4 py-3 border transition-all duration-200
                ${isActive 
                  ? 'border-lava bg-lava/10 glow-lava' 
                  : 'border-border bg-carbon-light hover:border-muted-foreground hover:bg-carbon-lighter'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs tracking-wider">
                    {option.code}
                  </span>
                  <span className="mx-2 text-muted-foreground">//</span>
                  <span className="text-sm">{option.label}</span>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-lava animate-pulse" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 tracking-wider">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleSelector;
