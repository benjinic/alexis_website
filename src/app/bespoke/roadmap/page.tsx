'use client';

import { useState } from 'react';

type TaskStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  steps?: string[]; // 新增：詳細步驟清單
}

interface Phase {
  id: string;
  title: string;
  timeline: string;
  description: string;
  tasks: Task[];
}

// 🌟 更新後的 Roadmap 資料庫
const ROADMAP_DATA: Phase[] = [
  {
    id: 'phase-0',
    title: 'SYS.CORE_ARCHITECTURE',
    timeline: 'COMPLETED',
    description: '核心架構、約束引擎與版面整合',
    tasks: [
      { id: 't0-1', name: '現代化 React 組件拆分 (VisualEngine, Sidebar)', status: 'COMPLETED', steps: ['建立 StepNavigator 組件', '建立 VisualEngine 靜態預覽', '建立 ConfigSidebar 控制台'] },
      { id: 't0-2', name: 'Firebase 即時布料資料庫串接', status: 'COMPLETED' },
      { id: 't0-3', name: '約束引擎 (Constraint Engine) 互斥邏輯實作', status: 'COMPLETED' },
      { id: 't0-4', name: '全域版面整合與防呆 (UI/UX)', status: 'COMPLETED', steps: ['加入 pt-[80px] 避開全域 Navbar', '實作 e.stopPropagation() 阻擋點擊穿透', '完成白底 Toolbar 與黑紅面板的高對比設計'] },
    ]
  },
  {
    id: 'phase-1',
    title: 'MVP_VISUALS_&_DETAILS',
    timeline: 'WEEK 1 (CURRENT)',
    description: '完善 Path A 視覺與細節配置 (參考 Proper Cloth 邏輯)',
    tasks: [
      { 
        id: 't1-1', 
        name: '準備各款布料高清展示照 (Firebase Storage)', 
        status: 'IN_PROGRESS',
        steps: [
          '[已完成] 使用 AI 生成淺灰色西裝母圖',
          '[已完成] 使用 Canva 變換布料顏色 (Navy, Charcoal 等) 並壓縮',
          '[進行中] 在 Firebase Storage 建立 suit_previews 資料夾並上傳圖片',
          '[下一步] 取得 Download URL，更新至 Firestore inventory 裡的 imageUrl 欄位'
        ]
      },
      { 
        id: 't1-2', 
        name: '實作進階選項面板與 SVG 線稿', 
        status: 'PENDING',
        steps: [
          '擴充 bespoke-config.ts，為每個選項加入 img 屬性',
          '下載領型、口袋的 SVG 線稿圖示存入 public/icons/',
          '升級 ConfigSidebar 的按鈕，顯示圖示與加價 (+ $50)',
          '在右側面板實作「CURRENT_PROTOCOL (目前配置總結)」區塊'
        ]
      },
      { 
        id: 't1-3', 
        name: '串接真實 Gemini AI 顧問', 
        status: 'PENDING',
        steps: [
          '取得 Google Gemini API Key',
          '將使用者的 selections 打包成 Prompt 傳送',
          '將 AI 回傳的風格建議顯示在面板上'
        ]
      },
    ]
  },
  {
    id: 'phase-2',
    title: 'METRICS_&_CHECKOUT',
    timeline: 'WEEK 2',
    description: '數位量身與結帳流程',
    tasks: [
      { 
        id: 't2-1', 
        name: '開發 Step 2 (Metrics)：身型數據輸入介面', 
        status: 'PENDING',
        steps: ['建立表單收集身高、體重、年齡', '建立圖文選項收集身型特徵 (平肩、斜肩等)']
      },
      { 
        id: 't2-2', 
        name: '開發 Step 3 (Confirm)：訂單總結與聯絡表單', 
        status: 'PENDING',
        steps: ['條列顯示所有選擇項目與最終總價', '建立收件人姓名、電話、地址表單']
      },
    ]
  },
  {
    id: 'phase-3',
    title: 'BACKEND_&_PAYMENTS',
    timeline: 'WEEK 3',
    description: '資料庫寫入與金流整合',
    tasks: [
      { 
        id: 't3-1', 
        name: '將完整訂單寫入 Firestore', 
        status: 'PENDING',
        steps: ['建立 orders 集合', '將 selections、身型數據與收件資料打包為 JSON 寫入資料庫']
      },
    ]
  }
];

const StatusBadge = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case 'COMPLETED':
      return <span className="text-[9px] px-2 py-0.5 border border-[#16a34a] text-[#16a34a] bg-[#16a34a]/10 tracking-widest shrink-0">[ OK ]</span>;
    case 'IN_PROGRESS':
      return <span className="text-[9px] px-2 py-0.5 border border-[#F42B26] text-[#F42B26] bg-[#F42B26]/10 tracking-widest animate-pulse shrink-0">[ ACTIVE ]</span>;
    default:
      return <span className="text-[9px] px-2 py-0.5 border border-[#595959] text-[#595959] tracking-widest shrink-0">[ STANDBY ]</span>;
  }
};

export default function DevRoadmapPage() {
  const [phases] = useState<Phase[]>(ROADMAP_DATA);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phases.reduce((acc, phase) => acc + phase.tasks.filter(t => t.status === 'COMPLETED').length, 0);
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (taskId: string) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] font-mono p-8 md:p-16 selection:bg-[#F42B26] selection:text-white">
      
      <header className="mb-12 border-b border-[#2e2e2e] pb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[#F42B26] text-[10px] tracking-[0.3em] uppercase mb-2 block animate-pulse">
              {'>'} Developer Access Granted
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              ALEXIS_BESPOKE <span className="text-[#595959] font-light">// ROADMAP</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-[#8c8c8c] tracking-widest block mb-1">SYSTEM_BUILD_v1.0</span>
            <span className="text-[10px] text-[#16a34a] tracking-widest">STATUS: ONLINE</span>
          </div>
        </div>

        <div className="w-full bg-[#141414] border border-[#2e2e2e] h-4 mt-6 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#F42B26] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDRMMCAwTDQgNEwwIDRaIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMikiLz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-[#8c8c8c] tracking-widest">
          <span>INITIALIZING</span>
          <span className="text-[#F42B26]">PROGRESS: {progressPercentage}%</span>
          <span>LAUNCH</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 custom-scrollbar">
        {phases.map((phase, index) => (
          <div 
            key={phase.id} 
            className={`border p-6 transition-colors ${
              phase.timeline.includes('COMPLETED') 
                ? 'border-[#16a34a]/30 bg-[#16a34a]/5' 
                : phase.timeline.includes('CURRENT')
                  ? 'border-[#F42B26] bg-[#0f0f0f] shadow-[0_0_20px_rgba(244,43,38,0.1)]'
                  : 'border-[#2e2e2e] bg-[#0a0a0a]'
            }`}
          >
            <div className="flex justify-between items-start mb-4 border-b border-[#2e2e2e]/50 pb-4">
              <div>
                <span className={`text-[10px] tracking-widest block mb-1 ${phase.timeline.includes('CURRENT') ? 'text-[#F42B26]' : 'text-[#8c8c8c]'}`}>
                  PHASE 0{index} // {phase.timeline}
                </span>
                <h2 className="text-lg font-bold text-white tracking-widest">{phase.title}</h2>
                <p className="text-[10px] text-[#595959] mt-1 tracking-wider">{phase.description}</p>
              </div>
            </div>

            <ul className="space-y-2 mt-4">
              {phase.tasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;
                const hasSteps = task.steps && task.steps.length > 0;

                return (
                  <li 
                    key={task.id} 
                    className={`p-2 transition-colors border-l-2 ${isExpanded ? 'bg-[#141414] border-[#F42B26]' : 'border-transparent hover:bg-white/5 hover:border-[#595959]'} ${hasSteps ? 'cursor-pointer' : ''}`}
                    onClick={() => hasSteps && toggleTask(task.id)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className={`text-[11px] leading-relaxed tracking-wide flex items-center gap-2 ${task.status === 'COMPLETED' ? 'text-[#595959] line-through' : 'text-[#cccccc]'}`}>
                        <span className="text-[#F42B26] font-bold shrink-0">{hasSteps ? (isExpanded ? '[-]' : '[+]') : '>'}</span> 
                        {task.name}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>

                    {isExpanded && hasSteps && (
                      <div className="mt-3 ml-6 pl-3 border-l border-[#2e2e2e] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {task.steps!.map((step, stepIndex) => (
                          <p key={stepIndex} className={`text-[10px] tracking-widest leading-relaxed ${step.includes('[已完成]') ? 'text-[#16a34a] line-through opacity-70' : step.includes('[進行中]') ? 'text-[#F42B26]' : 'text-[#8c8c8c]'}`}>
                            {stepIndex + 1}. {step}
                          </p>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}