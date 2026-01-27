// src/store/useBlueprintStore.ts
import { create } from 'zustand';
import { SuitConfiguration, Fabric } from '@/types/blueprint';

interface BlueprintStore {
  step: number;
  config: SuitConfiguration;
  setFabric: (fabric: Fabric) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useBlueprintStore = create<BlueprintStore>((set) => ({
  step: 1, // 初始在第 1 步
  config: {
    fabric: null, // 一開始沒選布料
    style: { lapel: 'notch', button: '2', vent: 'double' }, // 預設剪裁
  },

  setFabric: (fabric) => set((state) => ({
    config: { ...state.config, fabric },
  })),

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
}));