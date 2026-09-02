import React from 'react';
import { ActiveTab, UserRole } from '../types';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  pendingHomeworkCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  pendingHomeworkCount = 0,
}) => {
  const tabs = [
    {
      id: 'homework' as ActiveTab,
      label: 'เพิ่มชิ้นงาน',
      icon: '📦',
      badge: userRole === 'teacher' 
        ? (pendingHomeworkCount > 0 ? `${pendingHomeworkCount} รอตรวจ` : 'โพสต์ & ตรวจงาน') 
        : 'รับมอบหมายงาน',
      color: 'hover:bg-amber-100',
      activeColor: 'bg-amber-300 text-zinc-950 font-black shadow-[4px_4px_0px_#18181b] rotate-[-1deg]',
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'แบบทดสอบ&สอบ',
      icon: '🧪',
      badge: userRole === 'teacher' ? 'ดูคะแนนนักเรียน' : '2 บทเรียน',
      color: 'hover:bg-sky-100',
      activeColor: 'bg-sky-300 text-zinc-950 font-black shadow-[4px_4px_0px_#18181b] rotate-[1deg]',
    },
    {
      id: 'scorebook' as ActiveTab,
      label: 'สมุดคะแนน',
      icon: '🌟',
      badge: userRole === 'teacher' ? 'ให้สติกเกอร์ ⭐' : 'เกียรติยศ',
      color: 'hover:bg-emerald-100',
      activeColor: 'bg-emerald-300 text-zinc-950 font-black shadow-[4px_4px_0px_#18181b] rotate-[-1deg]',
    },
    {
      id: 'reflection' as ActiveTab,
      label: 'มุมสะท้อน',
      badge: userRole === 'teacher' ? 'อ่านเสียงสะท้อน' : '+20 ⭐',
      icon: '💬',
      color: 'hover:bg-pink-100',
      activeColor: 'bg-pink-300 text-zinc-950 font-black shadow-[4px_4px_0px_#18181b] rotate-[1deg]',
    },
  ];

  return (
    <nav className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`w-full min-h-[60px] flex items-center justify-center gap-2 px-3 py-3 rounded-[18px_14px_20px_16px] border-2 border-zinc-900 text-base md:text-lg font-black transition-all cursor-pointer ${
              isActive
                ? `${tab.activeColor} translate-y-[-3px]`
                : `bg-white/95 text-zinc-800 ${tab.color} hover:translate-y-[-1px] shadow-[3px_3px_0px_#18181b]`
            }`}
          >
            <span className="text-2xl shrink-0">{tab.icon}</span>
            <span className="tracking-tight truncate">{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full border border-zinc-900 shadow-[1px_1px_0px_#000] shrink-0 ${
                  tab.id === 'reflection'
                    ? 'bg-amber-300 text-zinc-950'
                    : 'bg-rose-400 text-zinc-950'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};


