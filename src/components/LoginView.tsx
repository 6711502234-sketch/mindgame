import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { triggerFestiveConfetti, triggerStarBurst } from '../utils/confetti';
import { DoodleStudent, DoodleTeacher, DoodleHomeworkBox } from './DoodleIcons';
import {
  STUDENT_DOODLE_AVATARS,
  TEACHER_DOODLE_AVATARS,
  AvatarDisplay,
} from './DoodleAvatars';
import {
  Package,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Star,
  LogIn,
  Check
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Student form fields
  const [studentName, setStudentName] = useState('');
  const [studentIdCode, setStudentIdCode] = useState('');
  const [classRoom, setClassRoom] = useState('ม.3/1');
  const [studentNo, setStudentNo] = useState('');
  const [studentAvatar, setStudentAvatar] = useState('student-boy-glasses');

  // Teacher form fields
  const [teacherName, setTeacherName] = useState('');
  const [teacherIdCode, setTeacherIdCode] = useState('');
  const [teachingSubject, setTeachingSubject] = useState('วิทยาศาสตร์และเทคโนโลยี ม.3');
  const [teacherAvatar, setTeacherAvatar] = useState('teacher-female-glasses');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const user: UserProfile = {
      id: 'std-' + (studentIdCode.trim() || Date.now().toString()),
      name: studentName.trim(),
      role: 'student',
      studentIdCode: studentIdCode.trim() || 'STD-' + Math.floor(1000 + Math.random() * 9000),
      classRoom: classRoom || 'ม.3/1',
      studentNo: studentNo.trim() || '1',
      avatar: studentAvatar,
      totalStars: 100,
      unlockedStickers: ['first-step'],
    };

    triggerFestiveConfetti();
    onLogin(user);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    const user: UserProfile = {
      id: 'tch-' + (teacherIdCode.trim() || Date.now().toString()),
      name: teacherName.trim(),
      role: 'teacher',
      teacherIdCode: teacherIdCode.trim() || 'TCH-' + Math.floor(100 + Math.random() * 900),
      classRoom: teachingSubject.trim() || 'ระดับชั้น ม.3',
      studentNo: 'ครูผู้สอน',
      avatar: teacherAvatar,
      totalStars: 500,
      unlockedStickers: ['first-step', 'super-critic', 'century-star'],
    };

    triggerFestiveConfetti();
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Clean Header (No large yellow container, just clean box branding) */}
        <div className="text-center mb-8 relative">
          {/* Centered Box Icon & Title */}
          <div className="inline-flex flex-col items-center">
            <div className="relative mb-3 group">
              <div className="w-20 h-20 bg-amber-300 sketch-border rounded-[22px_18px_20px_16px] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#18181b] rotate-[-2deg] group-hover:rotate-0 transition-transform">
                <DoodleHomeworkBox className="w-14 h-14" />
              </div>
              <div className="washi-tape -top-2.5 -right-3 rotate-[12deg] bg-pink-300" />
            </div>

            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight drop-shadow-xs">
                กล่องการบ้าน
              </h1>
              <span className="bg-sky-200 text-sky-950 font-black text-sm md:text-base px-3.5 py-1 rounded-full border-2 border-zinc-900 shadow-[2px_2px_0px_#000] rotate-[3deg]">
                ม.3
              </span>
            </div>

            <p className="text-base md:text-lg font-bold text-zinc-600 max-w-md mx-auto">
              ระบบส่งการบ้าน แบบทดสอบ และสมุดบันทึกคะแนน
            </p>
          </div>
        </div>

        {/* Role Selection Screen (Stage 1) */}
        {!selectedRole ? (
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-black text-zinc-800 bg-white px-5 py-1.5 rounded-full border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_#18181b]">
                <span>✨</span>
                <span>กรุณาเลือกบทบาทเพื่อเข้าสู่ระบบ</span>
                <span>✨</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Student Role Card */}
              <div
                onClick={() => {
                  setSelectedRole('student');
                  triggerStarBurst();
                }}
                className="bg-linear-to-b from-emerald-50/80 via-white to-emerald-50/30 sketch-border-lg rounded-[26px_18px_24px_20px] p-6 md:p-7 shadow-[6px_6px_0px_#18181b] hover:translate-y-[-4px] hover:shadow-[9px_9px_0px_#18181b] transition-all cursor-pointer relative group flex flex-col justify-between"
              >
                <div className="washi-tape -top-3.5 left-8 bg-emerald-200 rotate-[-2deg]" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-22 h-22 rounded-[22px_16px_20px_14px] bg-emerald-100 border-3 border-zinc-900 flex items-center justify-center p-2 shadow-[3px_3px_0px_#18181b] group-hover:scale-105 group-hover:rotate-3 transition-transform">
                      <DoodleStudent className="w-18 h-18" />
                    </div>
                    <span className="bg-emerald-200 text-emerald-950 font-black text-sm px-4 py-1.5 rounded-full border-2 border-zinc-900 shadow-[2px_2px_0px_#000]">
                      สำหรับนักเรียน
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2 flex items-center gap-2">
                    <span>นักเรียน ม.3</span>
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </h3>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 bg-emerald-300 group-hover:bg-emerald-400 text-zinc-950 font-black text-base rounded-xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181b] mt-4"
                >
                  <span>เข้าสู่ระบบในฐานะ นักเรียน</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Teacher Role Card */}
              <div
                onClick={() => {
                  setSelectedRole('teacher');
                  triggerStarBurst();
                }}
                className="bg-linear-to-b from-purple-50/80 via-white to-purple-50/30 sketch-border-lg rounded-[20px_26px_18px_24px] p-6 md:p-7 shadow-[6px_6px_0px_#18181b] hover:translate-y-[-4px] hover:shadow-[9px_9px_0px_#18181b] transition-all cursor-pointer relative group flex flex-col justify-between"
              >
                <div className="washi-tape -top-3.5 right-8 bg-purple-200 rotate-[3deg]" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-22 h-22 rounded-[18px_22px_16px_20px] bg-purple-100 border-3 border-zinc-900 flex items-center justify-center p-2 shadow-[3px_3px_0px_#18181b] group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform">
                      <DoodleTeacher className="w-18 h-18" />
                    </div>
                    <span className="bg-purple-200 text-purple-950 font-black text-sm px-4 py-1.5 rounded-full border-2 border-zinc-900 shadow-[2px_2px_0px_#000]">
                      สำหรับคุณครู
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2 flex items-center gap-2">
                    <span>คุณครูผู้สอน</span>
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </h3>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 bg-purple-300 group-hover:bg-purple-400 text-zinc-950 font-black text-base rounded-xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181b] mt-4"
                >
                  <span>เข้าสู่ระบบในฐานะ คุณครู</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Login Form Screen (Stage 2) */
          <div className="bg-white sketch-border-lg rounded-[26px_18px_24px_20px] p-6 md:p-8 shadow-[6px_6px_0px_#18181b] relative">
            <div
              className={`washi-tape -top-3.5 left-10 ${
                selectedRole === 'student' ? 'bg-emerald-200' : 'bg-purple-200'
              } rotate-[-2deg]`}
            />

            {/* Back to Role Selection Button */}
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-2 text-sm font-black text-zinc-700 hover:text-zinc-950 mb-5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border-2 border-zinc-900 cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับไปเลือกบทบาท</span>
            </button>

            {/* STUDENT LOGIN FORM */}
            {selectedRole === 'student' ? (
              <form onSubmit={handleStudentLogin} className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-zinc-200">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 border-2 border-zinc-900 flex items-center justify-center p-1.5 shadow-[2px_2px_0px_#000]">
                    <DoodleStudent className="w-11 h-11" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">
                      เข้าสู่ระบบ: นักเรียน ม.3
                    </h3>
                    <p className="text-xs font-bold text-zinc-600">
                      กรุณากรอกชื่อหรือรหัสนักเรียนเพื่อเข้าใช้งานกล่องการบ้าน
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      ชื่อ-นามสกุล นักเรียน <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="เช่น เด็กชายสมชาย สายวิทย์"
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      รหัสนักเรียน / เลขประจำตัว <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentIdCode}
                      onChange={(e) => setStudentIdCode(e.target.value)}
                      placeholder="เช่น 35812 หรือ STD-01"
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      ห้องเรียน
                    </label>
                    <select
                      value={classRoom}
                      onChange={(e) => setClassRoom(e.target.value)}
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900"
                    >
                      <option value="ม.3/1">ม.3/1 (ห้องเรียนวิทย์-คณิต)</option>
                      <option value="ม.3/2">ม.3/2</option>
                      <option value="ม.3/3">ม.3/3</option>
                      <option value="ม.3/4">ม.3/4</option>
                      <option value="ม.3/5">ม.3/5</option>
                      <option value="ม.3/6">ม.3/6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      เลขที่
                    </label>
                    <input
                      type="text"
                      value={studentNo}
                      onChange={(e) => setStudentNo(e.target.value)}
                      placeholder="เช่น 12"
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900"
                    />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-2">
                    เลือกรูปภาพประจำตัว (ภาพวาดลายเส้นเด็ก Doodle Avatar) <span className="text-amber-600 font-normal">★ เลือกคาแรคเตอร์ที่ชอบ</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {STUDENT_DOODLE_AVATARS.map((item) => {
                      const isSelected = studentAvatar === item.id;
                      const IconComp = item.component;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStudentAvatar(item.id)}
                          className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center ${
                            isSelected
                              ? 'bg-amber-300 border-zinc-900 shadow-[3px_3px_0px_#18181b] -translate-y-1 scale-105'
                              : 'bg-white/90 border-zinc-300 hover:border-zinc-800 hover:bg-amber-50/80 hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="relative">
                            <IconComp className="w-12 h-12" />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 text-amber-300 rounded-full flex items-center justify-center border border-white text-xs font-black shadow-sm">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] font-black leading-tight line-clamp-1 ${isSelected ? 'text-zinc-950' : 'text-zinc-700'}`}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-base rounded-xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#18181b]"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>เข้าสู่ระบบกล่องการบ้าน 📦</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TEACHER LOGIN FORM */
              <form onSubmit={handleTeacherLogin} className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-zinc-200">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 border-2 border-zinc-900 flex items-center justify-center p-1.5 shadow-[2px_2px_0px_#000]">
                    <DoodleTeacher className="w-11 h-11" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900">
                      เข้าสู่ระบบ: คุณครูผู้สอน
                    </h3>
                    <p className="text-xs font-bold text-zinc-600">
                      กรุณากรอกชื่อคุณครูหรือรหัสประจำตัวเพื่อตรวจการบ้านและดูแลห้องเรียน
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      ชื่อ-นามสกุล คุณครู <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="เช่น คุณครูนิภาภรณ์ ใจดี"
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 mb-1">
                      รหัสประจำตัวครู / Teacher Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherIdCode}
                      onChange={(e) => setTeacherIdCode(e.target.value)}
                      placeholder="เช่น TCH-301"
                      className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-1">
                    กลุ่มสาระการเรียนรู้ / วิชาที่สอน
                  </label>
                  <input
                    type="text"
                    value={teachingSubject}
                    onChange={(e) => setTeachingSubject(e.target.value)}
                    placeholder="เช่น วิทยาศาสตร์และเทคโนโลยี ม.3"
                    className="w-full bg-[#FFFDF5] p-3 rounded-xl sketch-input text-sm font-semibold text-zinc-900"
                  />
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-2">
                    เลือกรูปภาพประจำตัวคุณครู (ภาพวาดลายเส้น Doodle Avatar) <span className="text-purple-600 font-normal">★ เลือกคาแรคเตอร์ประจำตัว</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {TEACHER_DOODLE_AVATARS.map((item) => {
                      const isSelected = teacherAvatar === item.id;
                      const IconComp = item.component;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTeacherAvatar(item.id)}
                          className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer text-center ${
                            isSelected
                              ? 'bg-purple-300 border-zinc-900 shadow-[3px_3px_0px_#18181b] -translate-y-1 scale-105'
                              : 'bg-white/90 border-zinc-300 hover:border-zinc-800 hover:bg-purple-50/80 hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="relative">
                            <IconComp className="w-12 h-12" />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 text-purple-300 rounded-full flex items-center justify-center border border-white text-xs font-black shadow-sm">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] font-black leading-tight line-clamp-1 ${isSelected ? 'text-zinc-950' : 'text-zinc-700'}`}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-purple-400 hover:bg-purple-500 text-zinc-950 font-black text-base rounded-xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#18181b]"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>เข้าสู่ระบบในฐานะคุณครู 👨‍🏫</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
