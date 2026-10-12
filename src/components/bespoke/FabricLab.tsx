'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FabricCategory, FabricData } from '@/lib/bespoke-config';

const resolveItemCode = (code: unknown, name: string, documentId: string) => {
  if (typeof code === 'string' && code.trim().length > 0) {
    return code.trim().toUpperCase();
  }

  const trailingCode = name.match(/([A-Z]{1,6}\d{2,}[A-Z0-9-]*)$/i)?.[1]?.toUpperCase();
  return trailingCode || documentId.slice(-6).toUpperCase();
};

export type FabricLabProps = {
  /** Terminal-style header title. */
  title?: string;
  /** Label for the back/abort action shown top-left. Omit `onBack` to hide it entirely. */
  backLabel?: string;
  onBack?: () => void;
  /** Label for the primary CTA button in the detail panel. */
  ctaLabel?: string;
  /** Called with the currently selected fabric + its category when the CTA is pressed. */
  onMount: (fabric: FabricData, category: FabricCategory) => void;
  /**
   * Fabric id to pre-select once inventory has loaded (e.g. carried over via
   * `?fabricId=` from `/fabric-lab`). Falls back to the default (first
   * category, first item) if the id isn't found. The user can still freely
   * change the selection afterwards.
   */
  initialFabricId?: string;
};

/**
 * FABRIC LAB — 布料資料庫瀏覽/選擇引擎。
 * 從 Firestore `inventory` 集合即時抓取上架布料，依 category 分組，
 * 提供分類側欄 + 網格瀏覽 + 詳細規格面板。
 *
 * 抽出為獨立元件，讓 `/bespoke` 的 FABRIC 步驟與獨立的 `/fabric-lab`
 * 展示頁共用同一套邏輯，避免重複維護。
 */
export default function FabricLab({
  title = 'Initialize Material',
  backLabel = '< ABORT_AND_RETURN',
  onBack,
  ctaLabel = 'MOUNT_MATERIAL',
  onMount,
  initialFabricId,
}: FabricLabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fabricDB, setFabricDB] = useState<Record<FabricCategory, FabricData[]>>({});
  const [fabricCategories, setFabricCategories] = useState<FabricCategory[]>([]);
  const [fabricCategory, setFabricCategory] = useState<FabricCategory>('');
  const [currentFabricId, setCurrentFabricId] = useState<string>('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const q = query(collection(db, 'inventory'), where('isOnline', '==', true));
        const querySnapshot = await getDocs(q);
        const groupedData: Record<string, FabricData[]> = {};
        const inventoryRecords = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const cat = (data.category || 'OTHER').toUpperCase();
          const name = data.name || 'UNKNOWN_MATERIAL';
          const imageGallery = Array.isArray(data.imageGallery)
            ? data.imageGallery.filter((image: unknown): image is string => typeof image === 'string' && image.trim().length > 0)
            : [];

          return {
            id: doc.id,
            cat,
            name,
            code: data.code,
            imageUrl: data.imageUrl || '/images/placeholder-fabric.jpg',
            imageGallery,
            composition: data.description || 'DATA_MISSING',
            price: data.retailPrice || 0,
          };
        });
        const nameCollisionMap = new Map<string, number>();

        inventoryRecords.forEach((record) => {
          const collisionKey = `${record.cat}::${record.name.toUpperCase()}`;
          nameCollisionMap.set(collisionKey, (nameCollisionMap.get(collisionKey) || 0) + 1);
        });

        inventoryRecords.forEach((record) => {
          if (!groupedData[record.cat]) groupedData[record.cat] = [];

          const galleryArray = record.imageGallery.length > 0 ? record.imageGallery : [record.imageUrl];
          const collisionKey = `${record.cat}::${record.name.toUpperCase()}`;

          groupedData[record.cat].push({
            id: record.id,
            name: record.name,
            imageUrl: record.imageUrl,
            imageGallery: galleryArray,
            itemCode: resolveItemCode(record.code, record.name, record.id),
            galleryCount: galleryArray.length,
            hasNameCollision: (nameCollisionMap.get(collisionKey) || 0) > 1,
            composition: record.composition,
            weight: 'STANDARD',
            price: record.price,
          });
        });

        setFabricDB(groupedData);
        const categories = Object.keys(groupedData);
        setFabricCategories(categories);

        // 若帶有 initialFabricId (例如從 /fabric-lab 帶過來的 ?fabricId=)，
        // 優先定位到該布料所屬的分類並預選；找不到則退回預設 (第一分類第一項)。
        const preselected = initialFabricId
          ? categories
              .map((cat) => ({ cat, item: groupedData[cat].find((f) => f.id === initialFabricId) }))
              .find((entry) => entry.item)
          : undefined;

        if (preselected?.item) {
          setFabricCategory(preselected.cat);
          setCurrentFabricId(preselected.item.id);
        } else if (categories.length > 0) {
          setFabricCategory(categories[0]);
          if (groupedData[categories[0]].length > 0) {
            setCurrentFabricId(groupedData[categories[0]][0].id);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Firebase Sync Error:', error);
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const selectedFabricData = useMemo(() => {
    return fabricDB[fabricCategory]?.find((f) => f.id === currentFabricId) || null;
  }, [fabricDB, fabricCategory, currentFabricId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col items-center justify-center font-mono pt-[80px]">
        <span className="text-[#F42B26] text-xs tracking-widest mb-2 animate-pulse">&gt; ESTABLISHING_SECURE_CONNECTION...</span>
        <span className="text-[#8c8c8c] text-[10px] tracking-widest">&gt; FETCHING_INVENTORY_DATABANKS [FIREBASE]</span>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] text-[#f2f2f2] flex flex-col font-mono pt-[100px] px-8 pb-8">
      <header className="mb-8 border-b border-[#2e2e2e] pb-6 flex justify-between items-end shrink-0">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-[#8c8c8c] hover:text-[#F42B26] text-[10px] tracking-widest mb-4 block transition-colors">
              {backLabel}
            </button>
          )}
          <h1 className="text-3xl text-white font-serif tracking-widest uppercase">{title}</h1>
        </div>
        <span className="text-[#16a34a] text-[10px] tracking-widest uppercase animate-pulse">DATABASE_SYNCED</span>
      </header>

      <div className="flex gap-8 flex-grow overflow-hidden h-full">
        <aside className="w-48 border-r border-[#2e2e2e] pr-4 flex flex-col gap-2 shrink-0">
          {fabricCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFabricCategory(cat)}
              className={`text-[10px] tracking-[0.2em] w-full text-left py-3 border-l-2 pl-4 transition-all duration-200 ${fabricCategory === cat ? 'border-[#F42B26] text-white bg-[#141414]' : 'border-transparent text-[#595959] hover:text-[#8c8c8c]'}`}
            >
              [ {cat} ]
            </button>
          ))}
        </aside>

        <main className="flex-grow overflow-y-auto pr-4 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start pb-20 custom-scrollbar">
          <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {fabricDB[fabricCategory]?.map((fabric) => (
            <button
              key={fabric.id}
              onClick={() => setCurrentFabricId(fabric.id)}
              className={`group relative border transition-all duration-300 bg-[#141414] p-3 flex flex-col rounded-none ${currentFabricId === fabric.id ? 'border-[#F42B26] shadow-[0_0_15px_rgba(244,43,38,0.2)]' : 'border-[#2e2e2e] hover:border-[#595959]'}`}
            >
              <div className="w-full aspect-[4/5] mb-3 bg-[#1f1f1f] overflow-hidden flex items-center justify-center">
                {fabric.imageUrl !== '/images/placeholder-fabric.jpg' ? (
                  <img
                    src={fabric.imageUrl}
                    alt={fabric.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${currentFabricId === fabric.id ? 'scale-105' : 'group-hover:scale-105 opacity-70 group-hover:opacity-100'}`}
                  />
                ) : (
                  <span className="text-[#595959] text-[9px] tracking-widest text-center">
                    NO_IMAGE
                    <br />
                    DATA
                  </span>
                )}
              </div>
              <div className="text-left w-full">
                <span className={`block text-[10px] tracking-[0.2em] mb-1 truncate ${currentFabricId === fabric.id ? 'text-[#F42B26]' : 'text-white'}`}>{fabric.name}</span>
                {fabric.hasNameCollision && <span className="block text-[8px] text-[#F42B26] font-mono tracking-[0.25em] uppercase mb-2">Duplicate Name / Check Ref Before Mount</span>}
                <div className="border-t border-[#2e2e2e] pt-2 space-y-1 text-[9px] font-mono tracking-[0.2em] uppercase text-[#b5b5b5]">
                  <div className="flex items-center justify-between gap-3">
                    <span>{fabricCategory}</span>
                    <span>HKD {fabric.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white">Ref {fabric.itemCode}</span>
                    <span>{fabric.galleryCount.toString().padStart(2, '0')} View</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </main>

        <aside className="w-[300px] flex flex-col justify-between border border-[#2e2e2e] bg-[#141414] p-6 relative shrink-0">
          {selectedFabricData && (
            <div>
              <span className="text-[#F42B26] text-[9px] tracking-widest block mb-6 animate-pulse">&gt; MATERIAL_SCANNED</span>
              <h2 className="text-xl font-serif text-white mb-8 tracking-widest uppercase">{selectedFabricData.name}</h2>
              <div className="space-y-4 text-[10px] tracking-widest font-mono">
                <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                  <span className="text-[#595959]">ITEM_CODE</span>
                  <span className="text-white text-right max-w-[60%]">{selectedFabricData.itemCode}</span>
                </div>
                <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                  <span className="text-[#595959]">PREVIEW_VIEWS</span>
                  <span className="text-white">{selectedFabricData.galleryCount.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                  <span className="text-[#595959]">COMPOSITION</span>
                  <span className="text-white text-right max-w-[60%]">{selectedFabricData.composition}</span>
                </div>
                <div className="flex justify-between border-b border-[#2e2e2e] pb-2">
                  <span className="text-[#595959]">BASE_PRICE</span>
                  <span className="text-white">${selectedFabricData.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => selectedFabricData && onMount(selectedFabricData, fabricCategory)}
            disabled={!selectedFabricData}
            className="w-full bg-[#F42B26] hover:bg-[#A40000] disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 transition-colors rounded-none mt-8 border border-transparent"
          >
            <span className="font-mono font-bold tracking-[0.25em] text-[10px] uppercase">{ctaLabel}</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
