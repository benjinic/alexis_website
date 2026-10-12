export type Step = 'GARMENT' | 'FABRIC' | 'CUSTOMIZE';
export type GarmentType = 'SUIT' | 'JACKET' | 'TROUSERS' | 'VEST' | 'SHIRT';
export type FabricCategory = string;

export interface FabricData {
  id: string;
  name: string;
  imageUrl: string;
  imageGallery?: string[];
  itemCode: string;
  galleryCount: number;
  hasNameCollision: boolean;
  composition: string;
  weight: string;
  price: number;
}

export type SystemNode = {
  id: string;
  name: string;
  price: number;
  img?: string;
  imageUrl?: string;
  description?: string;
  restrict?: string[];
};

export type ProtocolCategory = {
  id: string;
  title: string;
  options: SystemNode[];
};

export const TERMINAL_DATABASE: Record<string, ProtocolCategory> = {
  lapel: {
    id: 'lapel',
    title: 'LAPEL_ARCHITECTURE (領型)',
    options: [
      {
        id: 'notch_35',
        name: '3.5" Notch Lapel (標準平駁領)',
        price: 0,
        img: '/icons/lapel-notch-35.svg',
        description: '經典義式風格，適合日常商務與休閒。'
      },
      {
        id: 'peak_425',
        name: '4.25" Peak Lapel (寬版劍領)',
        price: 0,
        img: '/icons/lapel-peak-425.svg',
        description: '氣場強大，適合雙排釦或展現個人風格。'
      },
      {
        id: 'shawl_satin',
        name: 'Satin Shawl Lapel (緞面青果領)',
        price: 50,
        img: '/icons/lapel-shawl-satin.svg',
        description: '偏正式晚裝語彙，適合禮服與晚宴場合。',
        restrict: ['pocket_patch']
      }
    ]
  },
  construction: {
    id: 'construction',
    title: 'CANVAS_CONSTRUCTION (內部結構)',
    options: [
      {
        id: 'half_canvas',
        name: 'Half-Canvassed (半毛襯)',
        price: 0,
        img: '/icons/const-half.svg',
        description: '平衡支撐與靈活度，適合多數商務與日常需求。'
      },
      {
        id: 'full_canvas',
        name: 'Fully-Canvassed (全毛襯)',
        price: 100,
        img: '/icons/const-full.svg',
        description: '更佳垂墜與立體感，隨穿著時間更貼合身形。'
      }
    ]
  },
  pocket: {
    id: 'pocket',
    title: 'POCKET_SYSTEM (口袋配置)',
    options: [
      {
        id: 'pocket_flap',
        name: 'Flap Pockets (翻蓋袋)',
        price: 0,
        img: '/icons/pocket-flap.svg',
        description: '最標準的西裝口袋形式，兼顧正式與實穿。'
      },
      {
        id: 'pocket_welt',
        name: 'Jetted Pockets (嵌線袋)',
        price: 0,
        img: '/icons/pocket-jetted.svg',
        description: '更俐落正式，常見於晚裝與極簡風格。'
      },
      {
        id: 'pocket_patch',
        name: 'Patch Pockets (貼袋)',
        price: 0,
        img: '/icons/pocket-patch.svg',
        description: '休閒感較強，適合春夏與 soft tailoring。',
        restrict: ['shawl_satin']
      }
    ]
  },
  button: {
    id: 'button',
    title: 'FASTENING_HARDWARE (鈕扣材質)',
    options: [
      {
        id: 'button_horn',
        name: 'Dark Horn (深色牛角釦)',
        price: 0,
        img: '/icons/button-horn.svg',
        description: '經典穩重，適合商務西裝。'
      },
      {
        id: 'button_satin',
        name: 'Silk Satin (絲緞包釦)',
        price: 20,
        img: '/icons/button-satin.svg',
        description: '更正式，適合禮服或特殊晚裝造型。'
      }
    ]
  },
  lining: {
    id: 'lining',
    title: 'INTERNAL_LINING (內裡)',
    options: [
      {
        id: 'lining_obsidian',
        name: 'Obsidian Black (黑曜石黑)',
        price: 0,
        img: '/icons/lining-obsidian.svg',
        description: '穩定低調，與深色西裝相容性最高。'
      },
      {
        id: 'lining_monogram',
        name: 'Monogram Silk (提花絲裡)',
        price: 50,
        img: '/icons/lining-monogram.svg',
        description: '增加內部細節層次，適合作為高級訂製識別。'
      }
    ]
  },
  waistband: {
    id: 'waistband',
    title: 'WAISTBAND_SYSTEM (褲頭結構)',
    options: [
      {
        id: 'waistband_extended_tab',
        name: 'Extended Tab (延伸褲頭)',
        price: 0,
        img: '/icons/waistband-extended.svg',
        description: '更俐落，常見於高級訂製西褲。'
      },
      {
        id: 'waistband_belt_loops',
        name: 'Belt Loops (皮帶環)',
        price: 0,
        img: '/icons/waistband-belt-loops.svg',
        description: '最實用，方便與日常皮帶搭配。'
      }
    ]
  },
  hem: {
    id: 'hem',
    title: 'HEM_FINISH (褲腳收尾)',
    options: [
      {
        id: 'hem_plain',
        name: 'Plain Hem (素面褲腳)',
        price: 0,
        img: '/icons/hem-plain.svg',
        description: '乾淨俐落，適合更現代的西褲比例。'
      },
      {
        id: 'hem_cuffed',
        name: 'Cuffed Hem (反摺褲腳)',
        price: 20,
        img: '/icons/hem-cuffed.svg',
        description: '增加份量感，適合經典義式褲型。'
      }
    ]
  }
};