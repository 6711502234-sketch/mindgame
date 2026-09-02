import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ActiveTab,
  Homework,
  TeacherEvaluation,
  QuizLesson,
  StickerAchievement,
  StudentExamScore,
  StudentRecord,
  AwardedBadgeItem,
  AssignmentTask,
} from './types';
import { initialQuizLessons } from './data/quizData';
import {
  initialStickers,
  sampleInitialHomeworks,
  sampleInitialEvaluations,
  sampleStudentExamScores,
  sampleStudentRecords,
  sampleInitialAssignmentTasks,
} from './data/stickersData';
import { triggerFestiveConfetti, triggerStarBurst } from './utils/confetti';
import { downloadStandaloneHtml } from './utils/singleFileGenerator';

import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { HomeworkView } from './components/HomeworkView';
import { QuizView } from './components/QuizView';
import { ScorebookView } from './components/ScorebookView';
import { TeacherEvaluationView } from './components/TeacherEvaluationView';
import { LoginView } from './components/LoginView';
import { CelebrationModal } from './components/CelebrationModal';

import { Download } from 'lucide-react';

export default function App() {
  // 0. Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hw_box_logged_in') === 'true';
  });

  // 1. User Profile State (persisted to localStorage)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hw_box_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'std-01',
      name: 'เด็กชายสมชาย สายวิทย์',
      role: 'student',
      classRoom: 'ม.3/1',
      studentNo: '12',
      avatar: '🧑‍🎓',
      totalStars: 100,
      unlockedStickers: ['first-step'],
      studentIdCode: 'STD-30112',
    };
  });

  // 2. Assignment Tasks (Posted by Teacher)
  const [assignmentTasks, setAssignmentTasks] = useState<AssignmentTask[]>(() => {
    const saved = localStorage.getItem('hw_box_assignment_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return sampleInitialAssignmentTasks;
  });

  // 3. Homework List State
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => {
    const saved = localStorage.getItem('hw_box_homeworks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return sampleInitialHomeworks;
  });

  // 4. Teacher Evaluations List
  const [evaluations, setEvaluations] = useState<TeacherEvaluation[]>(() => {
    const saved = localStorage.getItem('hw_box_evaluations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return sampleInitialEvaluations;
  });

  // 5. Quiz Lessons State
  const [lessons, setLessons] = useState<QuizLesson[]>(() => {
    const saved = localStorage.getItem('hw_box_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialQuizLessons;
  });

  // 6. Stickers State
  const [stickers, setStickers] = useState<StickerAchievement[]>(() => {
    const saved = localStorage.getItem('hw_box_stickers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialStickers;
  });

  // 7. Student Exam Scores (For Teacher & Classroom tracking)
  const [examScores, setExamScores] = useState<StudentExamScore[]>(() => {
    const saved = localStorage.getItem('hw_box_exam_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return sampleStudentExamScores;
  });

  // 8. Student Records (For Scorebook & Awarding stickers)
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('hw_box_student_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return sampleStudentRecords;
  });

  // Active Tab (Strictly 4 requested tabs)
  const [activeTab, setActiveTab] = useState<ActiveTab>('homework');

  // Celebration Modal State
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    starAmount?: number;
    icon?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('hw_box_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hw_box_logged_in', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hw_box_assignment_tasks', JSON.stringify(assignmentTasks));
  }, [assignmentTasks]);

  useEffect(() => {
    localStorage.setItem('hw_box_homeworks', JSON.stringify(homeworkList));
  }, [homeworkList]);

  useEffect(() => {
    localStorage.setItem('hw_box_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('hw_box_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('hw_box_stickers', JSON.stringify(stickers));
  }, [stickers]);

  useEffect(() => {
    localStorage.setItem('hw_box_exam_scores', JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem('hw_box_student_records', JSON.stringify(studentRecords));
  }, [studentRecords]);

  // Check & Unlock Stickers Helper
  const checkAndUnlockSticker = (stickerId: string) => {
    setStickers((prev) => {
      const target = prev.find((s) => s.id === stickerId);
      if (target && !target.isUnlocked) {
        // Unlock it!
        const updated = prev.map((s) =>
          s.id === stickerId
            ? { ...s, isUnlocked: true, unlockedAt: new Date().toLocaleDateString('th-TH') }
            : s
        );

        // Show celebratory popup
        setTimeout(() => {
          triggerFestiveConfetti();
          setCelebration({
            isOpen: true,
            title: `ปลดล็อกสติกเกอร์: ${target.thaiTitle}! 🎖️`,
            message: `ยินดีด้วย! คุณได้รับสติกเกอร์ความสำเร็จ "${target.name}" เข้าสู่สมุดคะแนนเรียบร้อยแล้ว`,
            icon: target.icon,
          });
        }, 500);

        return updated;
      }
      return prev;
    });
  };

  // Check all achievement conditions whenever stars or lists change
  useEffect(() => {
    if (user.role !== 'student') return;

    // 1. First Step (Submitting 1st homework)
    if (homeworkList.length >= 1) {
      checkAndUnlockSticker('first-step');
    }

    // 2. Super Critic (5-star review given)
    const hasFiveStarEval = evaluations.some((e) => e.overallRating === 5);
    if (hasFiveStarEval) {
      checkAndUnlockSticker('super-critic');
    }

    // 5. Century Star (100+ stars)
    if (user.totalStars >= 100) {
      checkAndUnlockSticker('century-star');
    }

    // 6. Homework Legend (all reviewed with great scores)
    if (homeworkList.length >= 3 && user.totalStars >= 200) {
      checkAndUnlockSticker('homework-legend');
    }
  }, [user.totalStars, homeworkList.length, evaluations]);

  // Handle Login
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setIsAuthenticated(true);
    triggerStarBurst();
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hw_box_logged_in');
  };

  // Award Stars with animation
  const handleAwardStars = (amount: number, reason: string) => {
    setUser((prev) => {
      const newStars = prev.totalStars + amount;
      return {
        ...prev,
        totalStars: newStars,
      };
    });

    triggerStarBurst();
    setCelebration({
      isOpen: true,
      title: `ได้รับดาวเพิ่ม +${amount} ⭐`,
      message: reason,
      starAmount: amount,
      icon: '⭐',
    });
  };

  // Assignment Tasks Management
  const handleCreateAssignmentTask = (newTask: AssignmentTask) => {
    setAssignmentTasks((prev) => [newTask, ...prev]);
    triggerFestiveConfetti();
  };

  const handleUpdateAssignmentTask = (updatedTask: AssignmentTask) => {
    setAssignmentTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleteAssignmentTask = (taskId: string) => {
    setAssignmentTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Student Submit Homework
  const handleSubmitHomework = (newHw: Homework) => {
    setHomeworkList((prev) => [newHw, ...prev]);
    handleAwardStars(50, 'ส่งชิ้นงานการบ้านเรียบร้อย (+50 ดาว)');

    // Update student record homework count
    setStudentRecords((prev) =>
      prev.map((s) => (s.id === user.id ? { ...s, homeworkCount: s.homeworkCount + 1 } : s))
    );
  };

  // Teacher Review / Edit Homework
  const handleUpdateHomework = (updated: Homework) => {
    setHomeworkList((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  // Delete Homework
  const handleDeleteHomework = (id: string) => {
    setHomeworkList((prev) => prev.filter((h) => h.id !== id));
  };

  // Student Submit Teacher Evaluation
  const handleSubmitEvaluation = (newEval: TeacherEvaluation) => {
    setEvaluations((prev) => [newEval, ...prev]);
    handleAwardStars(30, 'ส่งบันทึกมุมสะท้อนถึงคุณครู (+30 ดาว)');
  };

  // Teacher reply to evaluation
  const handleTeacherReply = (evalId: string, replyText: string) => {
    const repliedAt = new Date().toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    setEvaluations((prev) =>
      prev.map((e) =>
        e.id === evalId
          ? {
              ...e,
              teacherReply: replyText,
              teacherRepliedAt: repliedAt,
            }
          : e
      )
    );
  };

  // Teacher award sticker to student
  const handleAwardStickerToStudent = (
    studentId: string,
    stickerId: string,
    stickerName: string,
    thaiTitle: string,
    icon: string,
    bonusStars: number,
    note: string
  ) => {
    const newBadge: AwardedBadgeItem = {
      id: 'badge-' + Date.now(),
      stickerId,
      stickerName,
      thaiTitle,
      icon,
      awardedAt: new Date().toLocaleDateString('th-TH'),
      awardedBy: user.name,
      note,
      starsAdded: bonusStars,
    };

    setStudentRecords((prev) =>
      prev.map((std) => {
        if (std.id === studentId) {
          const alreadyHasSticker = std.unlockedStickers.includes(stickerId);
          return {
            ...std,
            totalStars: std.totalStars + bonusStars,
            unlockedStickers: alreadyHasSticker ? std.unlockedStickers : [...std.unlockedStickers, stickerId],
            awardedBadges: [newBadge, ...(std.awardedBadges || [])],
          };
        }
        return std;
      })
    );

    // If awarding to the currently logged in student, update their live profile
    if (user.id === studentId) {
      setUser((prev) => ({
        ...prev,
        totalStars: prev.totalStars + bonusStars,
        unlockedStickers: prev.unlockedStickers.includes(stickerId)
          ? prev.unlockedStickers
          : [...prev.unlockedStickers, stickerId],
      }));
    }
  };

  // Update Student Record directly (e.g. from score input fields)
  const handleUpdateStudentRecord = (updatedStudent: StudentRecord) => {
    setStudentRecords((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (user.id === updatedStudent.id) {
      setUser((prev) => ({
        ...prev,
        totalStars: updatedStudent.totalStars,
      }));
    }
  };

  // Create, Update, Delete Quiz Lessons (For Teacher)
  const handleCreateLesson = (newLesson: QuizLesson) => {
    setLessons((prev) => [newLesson, ...prev]);
    triggerFestiveConfetti();
  };

  const handleUpdateLesson = (updatedLesson: QuizLesson) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l))
    );
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  };

  // Quiz Finish
  const handleFinishQuiz = (lessonId: string, score: number, earnedStars: number) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === lessonId) {
          const currentBest = l.bestScore ?? 0;
          return {
            ...l,
            bestScore: Math.max(currentBest, score),
            lastAttemptAt: new Date().toLocaleDateString('th-TH'),
          };
        }
        return l;
      })
    );

    // Also record into student exam scores
    const targetLesson = lessons.find((l) => l.id === lessonId);
    const lessonTitle =
      targetLesson?.title ||
      (lessonId === 'ev-technology'
        ? '1. เทคโนโลยีรถยนต์ไฟฟ้า (EV)'
        : '2. กลศาสตร์และกฎการเคลื่อนที่ (Physics)');
    const maxScore = targetLesson?.questions?.length || 10;

    const newScoreEntry: StudentExamScore = {
      id: 'exam-' + Date.now(),
      studentId: user.id,
      studentName: user.name,
      studentNo: user.studentNo || '12',
      studentClass: user.classRoom || 'ม.3/1',
      studentAvatar: user.avatar,
      lessonId,
      lessonTitle,
      score,
      maxScore,
      submittedAt: new Date().toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    setExamScores((prev) => [newScoreEntry, ...prev]);

    if (lessonId === 'ev-technology' && score >= 8) {
      checkAndUnlockSticker('ev-master');
    }
    if (lessonId === 'mechanics-physics' && score >= 8) {
      checkAndUnlockSticker('mechanics-guru');
    }
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} initialRole={user.role} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] notebook-grid p-3 sm:p-5 md:p-8 flex flex-col justify-between">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <Header user={user} onLogout={handleLogout} />

        {/* Navigation Tabs (4 Core Tabs) */}
        <NavigationTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={user.role}
          pendingHomeworkCount={homeworkList.filter((h) => h.status === 'pending').length}
        />

        {/* Main Content Area */}
        <main className="mb-10">
          {activeTab === 'homework' && (
            <HomeworkView
              currentUser={user}
              homeworkList={homeworkList}
              assignmentTasks={assignmentTasks}
              studentRecords={studentRecords}
              onSubmitHomework={handleSubmitHomework}
              onUpdateHomework={handleUpdateHomework}
              onDeleteHomework={handleDeleteHomework}
              onCreateAssignmentTask={handleCreateAssignmentTask}
              onUpdateAssignmentTask={handleUpdateAssignmentTask}
              onDeleteAssignmentTask={handleDeleteAssignmentTask}
              onAwardStars={handleAwardStars}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              currentUser={user}
              lessons={lessons}
              examScores={examScores}
              onCreateLesson={handleCreateLesson}
              onUpdateLesson={handleUpdateLesson}
              onDeleteLesson={handleDeleteLesson}
              onFinishQuiz={handleFinishQuiz}
              onAwardStars={handleAwardStars}
            />
          )}

          {activeTab === 'scorebook' && (
            <ScorebookView
              currentUser={user}
              stickers={stickers}
              quizLessons={lessons}
              homeworkList={homeworkList}
              studentRecords={studentRecords}
              onAwardStickerToStudent={handleAwardStickerToStudent}
              onUpdateStudentRecord={handleUpdateStudentRecord}
            />
          )}

          {activeTab === 'reflection' && (
            <TeacherEvaluationView
              currentUser={user}
              evaluations={evaluations}
              onSubmitEvaluation={handleSubmitEvaluation}
              onTeacherReply={handleTeacherReply}
              onAwardStars={handleAwardStars}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t-3 border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-zinc-600 pb-4">
        <div className="flex items-center gap-2">
          <span>📦 กล่องการบ้าน (Homework Box ม.3)</span>
          <span>• สไตล์ภาพวาดลายเส้นการ์ตูน</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadStandaloneHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-zinc-950 rounded-lg sketch-btn cursor-pointer font-black shadow-[2px_2px_0px_#000]"
            title="ดาวน์โหลดไฟล์ Single File HTML สำหรับรันแบบ Offline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก Single File HTML</span>
          </button>
        </div>
      </footer>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        message={celebration.message}
        starAmount={celebration.starAmount}
        icon={celebration.icon}
      />
    </div>
  );
}
