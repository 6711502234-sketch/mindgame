import React from 'react';
import { UserProfile, UserRole } from '../types';
import { AvatarDisplay } from './DoodleAvatars';
import { Sparkles, UserCheck, GraduationCap, School, Star, Repeat, LogOut, Package, Box } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  onQuickToggleRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onQuickToggleRole,
}) => {
  return (
    <header className="w-full bg-[#FEF08A] sketch-border rounded-[22px_14px_24px_16px] p-4 md:p-5 mb-6 shadow-[5px_5px_0px_#18181b] relative overflow-hidden">
      {/* Decorative Hand-drawn Washi Tapes & Doodles */}
      <div className="washi-tape -top-3 left-10 rotate-[-4deg] bg-amber-300" />
      <div className="washi-tape -top-3 right-12 rotate-[3deg] bg-pink-300" />

      {/* Hand-drawn pencil / star watermark */}
      <div className="absolute right-2 bottom-1 text-2xl opacity-20 pointer-events-none select-none">
        ✏️ 📐 ⭐
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Logo and Brand - กล่องการบ้าน */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-amber-400 sketch-border rounded-[16px_22px_14px_20px] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#18181b] rotate-[-3deg] shrink-0 animate-doodle-float">
            📦
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                <span>กล่องการบ้าน</span>
                <span className="text-2xl">🎒</span>
              </h1>
              <span className="bg-sky-200 text-sky-950 text-sm font-black px-3 py-0.5 rounded-full border-2 border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b]">
                ม.3
              </span>
            </div>
            <p className="text-sm md:text-base font-bold text-zinc-700">
              ระบบส่งงานการบ้าน แบบทดสอบ สมุดคะแนน และมุมสะท้อน
            </p>
          </div>
        </div>

        {/* User Info & Role Actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5 w-full md:w-auto">
          {/* Star Balance Pill */}
          <div className="flex items-center gap-2.5 bg-amber-100 px-4 py-2 sketch-border rounded-[18px_12px_20px_14px] shadow-[3px_3px_0px_#18181b]">
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-zinc-900 flex items-center justify-center text-lg animate-bounce">
              ⭐
            </div>
            <div>
              <div className="text-xs font-black text-zinc-600 uppercase tracking-wider">
                ดาวสะสม
              </div>
              <div className="text-lg md:text-xl font-black text-amber-950 leading-none">
                {user.totalStars}{' '}
                <span className="text-xs font-bold text-amber-800">ดวง</span>
              </div>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 sketch-border rounded-[16px_20px_14px_18px] text-left">
            <div className="shrink-0">
              <AvatarDisplay avatar={user.avatar} className="w-10 h-10" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-black text-zinc-900 truncate max-w-[150px]">
                  {user.name}
                </span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-md border border-zinc-900 ${
                    user.role === 'teacher'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {user.role === 'teacher' ? 'คุณครู' : user.classRoom}
                </span>
              </div>
              <div className="text-xs font-bold text-zinc-600 flex items-center gap-1.5 mt-0.5">
                {user.role === 'teacher' ? (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                    <span>{user.teacherIdCode ? `รหัส: ${user.teacherIdCode}` : 'ครูผู้สอน'}</span>
                  </>
                ) : (
                  <>
                    <School className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user.studentIdCode ? `รหัส: ${user.studentIdCode}` : `เลขที่ ${user.studentNo}`}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Role Switcher if provided */}
          {onQuickToggleRole && (
            <button
              onClick={onQuickToggleRole}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-black rounded-[14px_18px_12px_16px] sketch-btn cursor-pointer ${
                user.role === 'teacher'
                  ? 'bg-emerald-300 hover:bg-emerald-400 text-zinc-900'
                  : 'bg-rose-300 hover:bg-rose-400 text-zinc-900'
              }`}
              title="สลับบทบาทระหว่างนักเรียนและครู"
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">
                {user.role === 'teacher' ? 'สลับเป็นนักเรียน' : 'สลับเป็นคุณครู'}
              </span>
            </button>
          )}

          {/* Logout / Switch Account Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-black rounded-[14px_10px_16px_12px] sketch-btn cursor-pointer"
            title="ออกจากระบบ หรือเปลี่ยนบัญชีผู้ใช้งาน"
          >
            <LogOut className="w-4 h-4 text-zinc-700" />
            <span>สลับบัญชี/ออก</span>
          </button>
        </div>
      </div>
    </header>
  );
};

