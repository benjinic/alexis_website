import { create } from 'zustand';
import { SuitConfiguration, Fabric } from '@/types/blueprint';

interface Measurements {
  height: number;
  weight: number;
  fit: 'slim' | 'regular' | 'comfort';
}

interface BlueprintStore {
  step: number;
  config: SuitConfiguration;
  measurements: Measurements; // ✨ 新增尺寸資料
  
  // Actions
  setFabric: (fabric: Fabric) => void;
  updateStyle: (style: Partial<SuitConfiguration['style']>) => void;
  updateMeasurements: (m: Partial<Measurements>) => void; // ✨ 新增更新方法
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useBlueprintStore = create<BlueprintStore>((set) => ({
  step: 1, 
  config: {
    fabric: null,
    style: {
      lapel: 'notch', 
      button: '2',    
      vent: 'double'  
    }
  },
  measurements: { // ✨ 預設值
    height: 175,
    weight: 70,
    fit: 'slim'
  },
  
  setFabric: (fabric) => set((state) => ({ 
    config: { ...state.config, fabric } 
  })),

  updateStyle: (newStyle) => set((state) => ({
    config: {
      ...state.config,
      style: { ...state.config.style, ...newStyle }
    }
  })),

  // ✨ 實作更新尺寸
  updateMeasurements: (m) => set((state) => ({
    measurements: { ...state.measurements, ...m }
  })),

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
}));