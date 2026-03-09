export type SuitStyle = 'single-breasted' | 'double-breasted';
export type LapelType = 'notch' | 'peak' | 'shawl';
export type PocketType = 'flap' | 'patch' | 'jetted';
export type FabricType = 'navy-wool' | 'charcoal-pinstripe' | 'brown-glen-plaid' | 'black-herringbone' | 'none';

export interface SuitConfiguration {
  style: SuitStyle;
  lapel: LapelType;
  pocket: PocketType;
  fabric: FabricType;
}

export interface ModuleOption<T> {
  id: T;
  label: string;
  code: string;
  description: string;
}

export interface FabricOption {
  id: FabricType;
  label: string;
  code: string;
  description: string;
  colorHint: string;
}

export const STYLE_OPTIONS: ModuleOption<SuitStyle>[] = [
  { id: 'single-breasted', label: '單排釦', code: 'SB-01', description: 'SINGLE BREASTED' },
  { id: 'double-breasted', label: '雙排釦', code: 'DB-01', description: 'DOUBLE BREASTED' },
];

export const LAPEL_OPTIONS: ModuleOption<LapelType>[] = [
  { id: 'notch', label: '平駁領', code: 'LP-N', description: 'NOTCH LAPEL' },
  { id: 'peak', label: '劍領', code: 'LP-P', description: 'PEAK LAPEL' },
  { id: 'shawl', label: '青果領', code: 'LP-S', description: 'SHAWL LAPEL' },
];

export const POCKET_OPTIONS: ModuleOption<PocketType>[] = [
  { id: 'flap', label: '翻蓋袋', code: 'PK-F', description: 'FLAP POCKET' },
  { id: 'patch', label: '貼袋', code: 'PK-P', description: 'PATCH POCKET' },
  { id: 'jetted', label: '嵌線袋', code: 'PK-J', description: 'JETTED POCKET' },
];

export const FABRIC_OPTIONS: FabricOption[] = [
  { id: 'none', label: '無材質', code: 'FB-00', description: 'NO FABRIC / RAW', colorHint: 'transparent' },
  { id: 'navy-wool', label: '海軍藍羊毛', code: 'FB-NW', description: 'NAVY WOOL 120S', colorHint: '#0a1a4a' },
  { id: 'charcoal-pinstripe', label: '炭灰細條紋', code: 'FB-CP', description: 'CHARCOAL PINSTRIPE', colorHint: '#2a2a2a' },
  { id: 'brown-glen-plaid', label: '棕色格紋', code: 'FB-GP', description: 'BROWN GLEN PLAID', colorHint: '#4a2a1a' },
  { id: 'black-herringbone', label: '黑色人字紋', code: 'FB-HB', description: 'BLACK HERRINGBONE', colorHint: '#1a1a1a' },
];
