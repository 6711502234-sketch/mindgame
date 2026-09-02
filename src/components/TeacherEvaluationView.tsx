import React, { useState } from 'react';
import { UserProfile, TeacherEvaluation } from '../types';
import { AvatarDisplay } from './DoodleAvatars';
import { triggerFestiveConfetti } from '../utils/confetti';
import {
  Star,
  MessageSquareHeart,
  CheckCircle2,
  Send,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ThumbsUp,
  Search,
  MessageCircle,
  Reply,
  Heart,
  Check,
  Filter,
  User
} from 'lucide-react';

interface TeacherEvaluationViewProps {
  currentUser: UserProfile;
  evaluations: TeacherEvaluation[];
  onSubmitEvaluation: (newEval: TeacherEvaluation) => void;
  onTeacherReply?: (evalId: string, replyText: string) => void;
  onAwardStars: (amount: number, reason: string) => void;
}

const RATING_DESCRIPTIONS: Record<number, { title: string; subtitle: string; emoji: string; color: string }> = {
  1: {
    title: '1/5 ดาว (อยากให้ปรับปรุง)',
    subtitle: 'กิจกรรมยังยากเกินไป หรือยังไม่ค่อยเข้าใจเนื้อหา',
    emoji: '🥺',
    color: 'bg-rose-100 border-rose-400 text-rose-800',
  },
  2: {
    title: '2/5 ดาว (พอใช้ได้)',
    subtitle: 'อยากให้มีกิจกรรมหลากหลายและเพิ่มเวลาอธิบายเพิ่มเติม',
    emoji: '😐',
    color: 'bg-orange-100 border-orange-400 text-orange-800',
  },
  3: {
    title: '3/5 ดาว (ปานกลาง / สนุกดี)',
    subtitle: 'กิจกรรมสนุกดี แต่ยังอยากได้ลูกเล่นและการทดลองเพิ่ม',
    emoji: '🙂',
    color: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  },
  4: {
    title: '4/5 ดาว (สนุกมาก)',
    subtitle: 'เข้าใจง่าย กิจกรรมน่าสนใจและได้ร่วมสนุกกับเพื่อนๆ',
    emoji: '😄',
    color: 'bg-lime-100 border-lime-400 text-lime-800',
  },
  5: {
    title: '5/5 ดาว (สนุกมากที่สุด!)',
    subtitle: 'เลิฟคาบนี้มาก! ครูสอนเข้าใจง่าย กิจกรรมสุดยอด อยากเรียนอีก',
    emoji: '🥳',
    color: 'bg-emerald-100 border-emerald-500 text-emerald-900',
  },
};

export const TeacherEvaluationView: React.FC<TeacherEvaluationViewProps> = ({
  currentUser,
  evaluations,
  onSubmitEvaluation,
  onTeacherReply,
  onAwardStars,
}) => {
  // Student Form State
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [improvementText, setImprovementText] = useState<string>('');
  const [recommendationText, setRecommendationText] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [showSuccessCard, setShowSuccessCard] = useState<boolean>(false);

  // Teacher Filter & Search State
  const [searchStudent, setSearchStudent] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3_lower'>('all');
  const [classFilter, setClassFilter] = useState('all');

  // Teacher Reply State (ID of eval currently replying to)
  const [replyingEvalId, setReplyingEvalId] = useState<string | null>(null);
  const [replyTextInput, setReplyTextInput] = useState<string>('');

  const isTeacher = currentUser.role === 'teacher';
  const currentDisplayRating = hoveredRating || ratingStars;
  const ratingInfo = RATING_DESCRIPTIONS[currentDisplayRating] || RATING_DESCRIPTIONS[5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEval: TeacherEvaluation = {
      id: 'eval-' + Date.now(),
      studentId: currentUser.id,
      studentName: isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : currentUser.name,
      studentClass: currentUser.classRoom,
      studentNo: currentUser.studentNo,
      studentAvatar: currentUser.avatar,
      ratingStars,
      improvementText: improvementText.trim() || 'ไม่มีข้อเสนอแนะเพิ่มเติม ทุกอย่างลงตัวดีแล้วครับ/ค่ะ',
      recommendationText: recommendationText.trim() || 'คุณครูสอนสนุกและเข้าใจง่ายมากครับ/ค่ะ!',
      submittedAt: new Date().toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      isAnonymous,
    };

    onSubmitEvaluation(newEval);
    onAwardStars(20, 'ส่งแบบประเมินคุณครู ม.3 (+20 ⭐)');
    triggerFestiveConfetti();
    setShowSuccessCard(true);

    setImprovementText('');
    setRecommendationText('');
  };

  const handleSendReply = (evalId: string) => {
    if (!replyTextInput.trim() || !onTeacherReply) return;

    onTeacherReply(evalId, replyTextInput.trim());
    setReplyingEvalId(null);
    setReplyTextInput('');
    triggerFestiveConfetti();
  };

  // Filter evaluations
  const filteredEvaluations = evaluations.filter((item) => {
    const matchSearch =
      item.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      item.improvementText.toLowerCase().includes(searchStudent.toLowerCase()) ||
      item.recommendationText.toLowerCase().includes(searchStudent.toLowerCase()) ||
      item.studentClass.toLowerCase().includes(searchStudent.toLowerCase());

    const matchClass = classFilter === 'all' || item.studentClass.includes(classFilter);

    let matchRating = true;
    if (ratingFilter === '5') matchRating = item.ratingStars === 5;
    else if (ratingFilter === '4') matchRating = item.ratingStars === 4;
    else if (ratingFilter === '3_lower') matchRating = item.ratingStars <= 3;

    return matchSearch && matchClass && matchRating;
  });

  const avgRating =
    evaluations.length > 0
      ? (evaluations.reduce((acc, curr) => acc + curr.ratingStars, 0) / evaluations.length).toFixed(1)
      : '5.0';

  const count5Star = evaluations.filter((e) => e.ratingStars === 5).length;
  const count4Star = evaluations.filter((e) => e.ratingStars === 4).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FCE7F3] sketch-border rounded-[22px_14px_24px_16px] p-5 md:p-6 shadow-[5px_5px_0px_#18181b] relative overflow-hidden">
        <div className="washi-tape top-[-6px] left-8 rotate-[-3deg] bg-yellow-200" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-300 sketch-border rounded-[12px_16px_10px_14px] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-zinc-900">
                  {isTeacher
                    ? '4. มุมสะท้อน & เสียงตอบรับจากนักเรียน (Student Feedback)'
                    : '4. มุมสะท้อนคิด & ประเมินคุณครูผู้สอน'}
                </h2>
                {isTeacher ? (
                  <span className="bg-purple-300 text-purple-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-zinc-900">
                    มุมมองคุณครู
                  </span>
                ) : (
                  <span className="bg-amber-300 text-zinc-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-zinc-900 animate-pulse">
                    +20 ดาวสะสม! ⭐
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm font-semibold text-zinc-700 mt-0.5">
                {isTeacher
                  ? 'ตรวจสอบสิ่งที่นักเรียนเขียนถึงคุณครู ใครเป็นคนเขียน และตอบกลับข้อเสนอแนะ'
                  : 'ความคิดเห็นของนักเรียนทุกคน มีคุณค่าต่อการพัฒนาการสอนและกิจกรรมในคาบเรียน'}
              </p>
            </div>
          </div>

          <div className="text-xs bg-white/90 px-3.5 py-1.5 rounded-xl border-2 border-zinc-900 font-bold text-zinc-800 shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>ความพึงพอใจเฉลี่ย: ⭐ {avgRating} / 5.0 ({evaluations.length} เสียงสะท้อน)</span>
          </div>
        </div>
      </div>

      {/* TEACHER DASHBOARD: VIEW WHO WROTE AND WHAT THEY WROTE */}
      {isTeacher ? (
        <div className="space-y-4">
          {/* Summary Metric Cards for Teacher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-[18px_12px_16px_14px] sketch-border shadow-[3px_3px_0px_#18181b]">
              <span className="text-xs font-bold text-zinc-600">ข้อคิดเห็นทั้งหมด</span>
              <div className="text-2xl font-black text-zinc-950 mt-0.5">{evaluations.length} รายการ</div>
              <span className="text-[11px] font-semibold text-pink-700">จากนักเรียน ม.3</span>
            </div>

            <div className="bg-white p-4 rounded-[18px_12px_16px_14px] sketch-border shadow-[3px_3px_0px_#18181b]">
              <span className="text-xs font-bold text-zinc-600">คะแนนความสุขเฉลี่ย</span>
              <div className="text-2xl font-black text-amber-900 mt-0.5">⭐ {avgRating} / 5</div>
              <span className="text-[11px] font-semibold text-emerald-700">ระดับดีเยี่ยม</span>
            </div>

            <div className="bg-white p-4 rounded-[18px_12px_16px_14px] sketch-border shadow-[3px_3px_0px_#18181b]">
              <span className="text-xs font-bold text-zinc-600">ประเมิน 5 ดาวเต็ม</span>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">{count5Star} คน</div>
              <span className="text-[11px] font-semibold text-zinc-600">
                {evaluations.length > 0 ? Math.round((count5Star / evaluations.length) * 100) : 0}% ของห้อง
              </span>
            </div>

            <div className="bg-white p-4 rounded-[18px_12px_16px_14px] sketch-border shadow-[3px_3px_0px_#18181b]">
              <span className="text-xs font-bold text-zinc-600">ประเมิน 4 ดาว</span>
              <div className="text-2xl font-black text-sky-900 mt-0.5">{count4Star} คน</div>
              <span className="text-[11px] font-semibold text-zinc-600">ชอบมาก</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white sketch-border rounded-[18px_12px_16px_14px] p-4 shadow-[4px_4px_0px_#18181b] flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="ค้นหาชื่อผู้เขียน หรือข้อความสะท้อน..."
                className="w-full bg-zinc-50 pl-9 pr-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-300 text-xs font-bold">
                <span className="px-2 text-zinc-500">ดาว:</span>
                <button
                  type="button"
                  onClick={() => setRatingFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    ratingFilter === 'all' ? 'bg-zinc-900 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setRatingFilter('5')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    ratingFilter === '5' ? 'bg-amber-400 text-zinc-950 font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ⭐⭐⭐⭐⭐ 5 ดาว
                </button>
                <button
                  type="button"
                  onClick={() => setRatingFilter('4')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    ratingFilter === '4' ? 'bg-amber-400 text-zinc-950 font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  4 ดาว
                </button>
              </div>

              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-300 text-xs font-bold">
                <span className="px-2 text-zinc-500">ห้อง:</span>
                <button
                  type="button"
                  onClick={() => setClassFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    classFilter === 'all' ? 'bg-zinc-900 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setClassFilter('ม.3/1')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    classFilter === 'ม.3/1' ? 'bg-purple-600 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ม.3/1
                </button>
                <button
                  type="button"
                  onClick={() => setClassFilter('ม.3/2')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    classFilter === 'ม.3/2' ? 'bg-purple-600 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ม.3/2
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Cards List */}
          {filteredEvaluations.length === 0 ? (
            <div className="bg-white sketch-border rounded-[22px_16px_20px_18px] p-8 text-center shadow-[4px_4px_0px_#18181b]">
              <div className="text-4xl mb-2">💬</div>
              <h4 className="font-black text-zinc-800 text-base">ไม่พบเสียงสะท้อนตามเงื่อนไขที่ค้นหา</h4>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvaluations.map((item) => {
                const desc = RATING_DESCRIPTIONS[item.ratingStars] || RATING_DESCRIPTIONS[5];
                const isReplying = replyingEvalId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white sketch-border rounded-[22px_16px_20px_18px] p-5 md:p-6 shadow-[5px_5px_0px_#18181b] space-y-4 relative"
                  >
                    {/* Header: WHO WROTE IT */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-zinc-200">
                      <div className="flex items-center gap-3">
                        <AvatarDisplay avatar={item.studentAvatar} className="w-12 h-12" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-zinc-900">
                              ผู้เขียน: {item.studentName}
                            </h4>
                            <span className="text-[11px] font-black bg-pink-100 text-pink-950 px-2 py-0.5 rounded border border-pink-300">
                              ห้อง {item.studentClass} {item.studentNo ? `เลขที่ ${item.studentNo}` : ''}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-500">
                            ส่งเมื่อ: {item.submittedAt}
                          </span>
                        </div>
                      </div>

                      {/* Stars Given */}
                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 self-start sm:self-auto">
                        <span className="text-base">{desc.emoji}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= item.ratingStars
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-zinc-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-950 ml-1">
                          {item.ratingStars}/5 ดาว
                        </span>
                      </div>
                    </div>

                    {/* Content: WHAT THEY WROTE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Improvement Text */}
                      <div className="p-4 bg-orange-50/70 rounded-xl border-2 border-orange-300 space-y-1">
                        <div className="text-xs font-black text-orange-950 flex items-center gap-1.5">
                          <span>💡</span>
                          <span>สิ่งที่นักเรียนอยากให้ครูปรับปรุง / ข้อเสนอแนะ:</span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-zinc-800 leading-relaxed whitespace-pre-wrap">
                          "{item.improvementText}"
                        </p>
                      </div>

                      {/* Recommendation & Praises */}
                      <div className="p-4 bg-emerald-50/70 rounded-xl border-2 border-emerald-300 space-y-1">
                        <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <span>💌</span>
                          <span>สิ่งที่นักเรียนแนะนำ / ข้อความกำลังใจถึงคุณครู:</span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-zinc-800 leading-relaxed whitespace-pre-wrap">
                          "{item.recommendationText}"
                        </p>
                      </div>
                    </div>

                    {/* Teacher Reply Section */}
                    {item.teacherReply ? (
                      <div className="p-3.5 bg-purple-50 rounded-xl border-2 border-purple-400 space-y-1">
                        <div className="flex items-center justify-between text-xs font-black text-purple-950">
                          <span className="flex items-center gap-1">
                            <span>👩‍🏫</span>
                            <span>คุณครูตอบกลับนักเรียน:</span>
                          </span>
                          {item.teacherRepliedAt && (
                            <span className="text-[10px] font-semibold text-purple-700">
                              {item.teacherRepliedAt}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-purple-950 italic pl-5">
                          "{item.teacherReply}"
                        </p>
                      </div>
                    ) : (
                      <div className="pt-1">
                        {isReplying ? (
                          <div className="p-3 bg-purple-50 rounded-xl border-2 border-purple-400 space-y-2">
                            <label className="block text-xs font-black text-purple-950">
                              พิมพ์ข้อความตอบกลับ {item.studentName}:
                            </label>
                            <textarea
                              rows={2}
                              value={replyTextInput}
                              onChange={(e) => setReplyTextInput(e.target.value)}
                              placeholder="เช่น ขอบคุณสำหรับข้อเสนอแนะนะจ๊ะ ครูจะนำไปปรับในคาบหน้า..."
                              className="w-full bg-white p-2.5 rounded-xl sketch-input text-xs font-semibold"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingEvalId(null);
                                  setReplyTextInput('');
                                }}
                                className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-lg cursor-pointer"
                              >
                                ยกเลิก
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendReply(item.id)}
                                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-lg sketch-btn flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>ส่งคำตอบกลับ</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingEvalId(item.id);
                              setReplyTextInput('');
                            }}
                            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-purple-100 text-zinc-800 hover:text-purple-950 text-xs font-bold rounded-lg border border-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>พิมพ์ตอบกลับนักเรียนคนนี้</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* STUDENT FORM VIEW */
        <form
          onSubmit={handleSubmit}
          className="bg-white sketch-border-lg rounded-[24px_16px_26px_18px] p-6 md:p-8 shadow-[6px_6px_0px_#18181b] relative space-y-6"
        >
          <div className="washi-tape -top-3 right-16 rotate-[2deg] bg-sky-200" />

          {/* Section 1: Interactive 5-Star Rating */}
          <div className="p-5 md:p-6 bg-[#FFFBEB] rounded-[20px_14px_18px_12px] border-3 border-zinc-900 shadow-[3px_3px_0px_#18181b]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 border-2 border-zinc-900 flex items-center justify-center text-sm font-black text-zinc-900 shadow-[1px_1px_0px_#000]">
                1
              </span>
              <label className="text-lg md:text-xl font-black text-zinc-900">
                ข้อ 1: นักเรียนสนุกกับกิจกรรมที่ครูจัดมั้ย? <span className="text-rose-500">*</span>
              </label>
            </div>
            <p className="text-sm font-bold text-zinc-600 mb-4 ml-10">
              คลิกเลือกจำนวนดาว (1 - 5 ดาว) เพื่อบอกระดับความสนุกและความเข้าใจในคาบเรียนนี้
            </p>

            {/* Stars Row */}
            <div className="flex flex-wrap items-center gap-3 ml-10 mb-4">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isLit = starIndex <= (hoveredRating || ratingStars);
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onMouseEnter={() => setHoveredRating(starIndex)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => setRatingStars(starIndex)}
                    className="p-1 rounded-xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                        isLit
                          ? 'text-amber-500 fill-amber-400 drop-shadow-[2px_2px_0px_#18181b]'
                          : 'text-zinc-300 fill-transparent hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Selected Rating Description Banner */}
            <div
              className={`ml-10 p-3.5 rounded-xl border-2 border-zinc-900 flex items-center gap-3 transition-all ${ratingInfo.color} shadow-[2px_2px_0px_#000]`}
            >
              <span className="text-3xl">{ratingInfo.emoji}</span>
              <div>
                <div className="font-black text-sm md:text-base">{ratingInfo.title}</div>
                <div className="text-xs font-semibold text-zinc-700">{ratingInfo.subtitle}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Improvement Feedback */}
          <div className="p-5 md:p-6 bg-[#EFF6FF] rounded-[20px_14px_18px_12px] border-3 border-zinc-900 shadow-[3px_3px_0px_#18181b]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-full bg-sky-300 border-2 border-zinc-900 flex items-center justify-center text-sm font-black text-zinc-900 shadow-[1px_1px_0px_#000]">
                2
              </span>
              <label className="text-lg md:text-xl font-black text-zinc-900">
                ข้อ 2: สิ่งที่อยากให้ครูปรับปรุงในคาบต่อไป
              </label>
            </div>
            <p className="text-xs md:text-sm font-bold text-zinc-600 mb-3 ml-10">
              เช่น อยากให้มีภาพประกอบเพิ่ม, อธิบายสูตรช้าลงนิดนึง, หรืออยากให้มีกิจกรรมทดลองกลุ่ม
            </p>

            <div className="ml-10">
              <textarea
                rows={3}
                value={improvementText}
                onChange={(e) => setImprovementText(e.target.value)}
                placeholder="เขียนสิ่งที่อยากให้คุณครูปรับปรุง หรือสิ่งที่รู้สึกว่ายังยาก..."
                className="w-full bg-white p-3.5 rounded-xl sketch-input text-sm md:text-base font-semibold text-zinc-900 resize-y"
              />
            </div>
          </div>

          {/* Section 3: Recommendations & Messages to Teacher */}
          <div className="p-5 md:p-6 bg-[#FDF2F8] rounded-[20px_14px_18px_12px] border-3 border-zinc-900 shadow-[3px_3px_0px_#18181b]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-full bg-pink-300 border-2 border-zinc-900 flex items-center justify-center text-sm font-black text-zinc-900 shadow-[1px_1px_0px_#000]">
                3
              </span>
              <label className="text-lg md:text-xl font-black text-zinc-900">
                ข้อ 3: ข้อความแนะนำ / คำชมและกำลังใจถึงคุณครู ❤️
              </label>
            </div>
            <p className="text-xs md:text-sm font-bold text-zinc-600 mb-3 ml-10">
              บอกสิ่งที่ชอบในคาบเรียนนี้ หรือส่งข้อความน่ารักๆ ให้คุณครูมีกำลังใจในการสอน!
            </p>

            <div className="ml-10">
              <textarea
                rows={3}
                value={recommendationText}
                onChange={(e) => setRecommendationText(e.target.value)}
                placeholder="เช่น ชอบการสอนแบบยกตัวอย่างรถ EV มากครับ, ครูสอนสนุกและใจดีมากๆ..."
                className="w-full bg-white p-3.5 rounded-xl sketch-input text-sm md:text-base font-semibold text-zinc-900 resize-y"
              />
            </div>
          </div>

          {/* Anonymous Toggle & Student Info */}
          <div className="p-4 bg-zinc-50 rounded-xl border-2 border-zinc-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-zinc-900 text-pink-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-sm font-bold text-zinc-800">
                🔒 ส่งแบบไม่ระบุชื่อ (ซ่อนชื่อผู้ส่ง)
              </span>
            </label>

            <div className="text-xs font-semibold text-zinc-500">
              ผู้ส่ง: {isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : `${currentUser.avatar} ${currentUser.name} (${currentUser.classRoom})`}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-zinc-950 font-black text-base md:text-lg rounded-2xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#18181b]"
          >
            <Send className="w-5 h-5" />
            <span>ส่งแบบประเมินและสะท้อนคิด (รับ +20 ⭐)</span>
          </button>
        </form>
      )}

      {/* Success Modal for Student */}
      {showSuccessCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF5] sketch-border-lg rounded-[26px_18px_24px_20px] p-6 md:p-8 max-w-md w-full relative animate-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="washi-tape -top-3.5 left-1/2 -translate-x-1/2 bg-pink-300 rotate-[-1deg]" />

            <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 border-3 border-zinc-900 flex items-center justify-center text-4xl shadow-[2px_2px_0px_#000]">
              💌
            </div>

            <h3 className="text-2xl font-black text-zinc-900">
              ขอบคุณสำหรับเสียงสะท้อนนะจ๊ะ!
            </h3>

            <p className="text-xs md:text-sm font-semibold text-zinc-600 leading-relaxed">
              คุณครูได้รับข้อคิดเห็นของเธอเรียบร้อยแล้ว ทุกคำแนะนำจะนำไปปรับปรุงคาบเรียนให้ดียิ่งขึ้น
            </p>

            <div className="p-3 bg-amber-100 rounded-xl border-2 border-amber-400 text-amber-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]">
              <span>⭐ ได้รับเพิ่ม +20 ดาวสะสม!</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessCard(false)}
              className="w-full py-3 bg-zinc-900 text-white font-black text-sm rounded-xl cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              รับทราบ & ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
