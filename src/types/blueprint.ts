// src/types/blueprint.ts

export interface Fabric {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  inStock?: boolean;
}

export interface SuitConfiguration {
  fabric: Fabric | null;
  style: {
    lapel: 'notch' | 'peak' | 'shawl';
    button: '1' | '2' | 'double';
    vent: 'single' | 'double' | 'none';
  };
}