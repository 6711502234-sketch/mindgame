export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  studentIdCode?: string; // e.g. "STD-670301" or "รหัสนักเรียน 5 หลัก"
  teacherIdCode?: string; // e.g. "TCH-301"
  classRoom: string; // e.g. "ม.3/1"
  studentNo: string; // e.g. "12"
  avatar: string; // emoji or avatar identifier
  totalStars: number;
  unlockedStickers: string[]; // sticker IDs
}

export type HomeworkStatus = 'pending' | 'reviewed' | 'needs_fix';

export interface AssignmentTask {
  id: string;
  title: string;
  subject: string;
  description: string;
  targetClass: string; // e.g. "ทุกห้อง", "ม.3/1", "ม.3/2"
  maxScore: number; // e.g. 10, 20, 100
  dueDate: string; // e.g. "15 ก.ย. 2569"
  createdAt: string;
  authorTeacher: string;
  attachmentName?: string;
  attachmentLink?: string;
  rewardStars: number;
}

export interface Homework {
  id: string;
  taskId?: string; // ID of the AssignmentTask if linked
  title: string;
  subject: string;
  description: string;
  link: string;
  attachedFileName?: string;
  submittedAt: string;
  updatedAt: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentAvatar: string;
  status: HomeworkStatus;
  teacherScore?: number;
  maxScore?: number;
  teacherComment?: string;
  earnedStars: number;
}

export interface TeacherEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentAvatar?: string;
  studentNo?: string;
  ratingStars: number; // 1 - 5
  improvementText: string;
  recommendationText: string;
  submittedAt: string;
  isAnonymous: boolean;
  teacherReply?: string;
  teacherRepliedAt?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export interface QuizLesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badgeColor?: string;
  subject?: string;
  targetClass?: string;
  authorTeacher?: string;
  createdAt?: string;
  dueDate?: string;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  bestScore?: number;
  lastAttemptAt?: string;
}

export interface StudentExamScore {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentNo: string;
  studentAvatar: string;
  lessonId: string;
  lessonTitle: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  answers?: Record<number, number>;
}

export interface StickerAchievement {
  id: string;
  name: string;
  thaiTitle: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AwardedBadgeItem {
  id: string;
  stickerId: string;
  stickerName: string;
  thaiTitle: string;
  icon: string;
  awardedBy: string;
  awardedAt: string;
  starsAdded: number;
  note: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  studentIdCode: string;
  classRoom: string;
  studentNo: string;
  avatar: string;
  totalStars: number;
  unlockedStickers: string[];
  awardedBadges: AwardedBadgeItem[];
  homeworkCount: number;
  quizScores: Record<string, number>;
}

export type ActiveTab = 'homework' | 'quiz' | 'scorebook' | 'reflection';

