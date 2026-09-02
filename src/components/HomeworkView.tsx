import React, { useState } from 'react';
import { UserProfile, Homework, HomeworkStatus, AssignmentTask, StudentRecord } from '../types';
import { AvatarDisplay } from './DoodleAvatars';
import { triggerFestiveConfetti, triggerStarBurst } from '../utils/confetti';
import {
  UploadCloud,
  FileText,
  Link as LinkIcon,
  PlusCircle,
  ExternalLink,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  X,
  Save,
  Trash2,
  Paperclip,
  Check,
  Sparkles,
  PackageCheck,
  MessageSquare,
  Filter,
  Award,
  UserCheck,
  Plus,
  BookOpen,
  Calendar,
  Layers,
  Send,
  Eye,
  CheckSquare,
  Users,
  UserX,
  FileCheck
} from 'lucide-react';

interface HomeworkViewProps {
  currentUser: UserProfile;
  homeworkList: Homework[];
  assignmentTasks: AssignmentTask[];
  studentRecords?: StudentRecord[];
  onCreateAssignmentTask?: (task: AssignmentTask) => void;
  onUpdateAssignmentTask?: (task: AssignmentTask) => void;
  onDeleteAssignmentTask?: (id: string) => void;
  onSubmitHomework: (homework: Homework) => void;
  onUpdateHomework: (updated: Homework) => void;
  onDeleteHomework: (id: string) => void;
  onAwardStars: (amount: number, reason: string) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentUser,
  homeworkList,
  assignmentTasks = [],
  studentRecords = [],
  onCreateAssignmentTask,
  onUpdateAssignmentTask,
  onDeleteAssignmentTask,
  onSubmitHomework,
  onUpdateHomework,
  onDeleteHomework,
  onAwardStars,
}) => {
  const isTeacher = currentUser.role === 'teacher';

  // Sub-tab selection:
  // For Teacher: 'tasks' (ชิ้นงานที่โพสต์มอบหมาย) vs 'submissions' (ตรวจงานและกรอกคะแนน)
  // For Student: 'tasks' (ชิ้นงานที่ได้รับมอบหมาย) vs 'submit' (ส่งผลงาน/ประวัติการส่ง)
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'submissions' | 'submit'>(
    isTeacher ? 'tasks' : 'tasks'
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'needs_fix'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<string>('all');

  // Inline Quick Score State for Teacher: { [homeworkId: string]: string | number }
  const [inlineScores, setInlineScores] = useState<Record<string, string>>({});
  const [savedFeedbackId, setSavedFeedbackId] = useState<string | null>(null);

  // --- Modal State: Task Submissions Roster & Inspector (For Teacher & Student) ---
  const [rosterModalTask, setRosterModalTask] = useState<AssignmentTask | null>(null);
  const [rosterSubTab, setRosterSubTab] = useState<'submitted' | 'pending'>('submitted');
  const [rosterSearch, setRosterSearch] = useState<string>('');

  // --- Modal State: Post/Edit Assignment Task (For Teacher) ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('วิทยาศาสตร์และเทคโนโลยี ม.3');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTargetClass, setTaskTargetClass] = useState('ทุกห้อง');
  const [taskMaxScore, setTaskMaxScore] = useState<number>(10);
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAttachmentName, setTaskAttachmentName] = useState('');
  const [taskAttachmentLink, setTaskAttachmentLink] = useState('');
  const [taskRewardStars, setTaskRewardStars] = useState<number>(50);

  // --- Student Submission Form State ---
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('วิทยาศาสตร์และเทคโนโลยี ม.3');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // --- Detail / Grading Modal State ---
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editAttachedFile, setEditAttachedFile] = useState('');

  // Teacher grading inputs in modal
  const [teacherScoreInput, setTeacherScoreInput] = useState<number>(10);
  const [teacherCommentInput, setTeacherCommentInput] = useState<string>('ทำงานได้ยอดเยี่ยม ชัดเจน ครบถ้วนตามตัวชี้วัด ม.3!');
  const [teacherStatusInput, setTeacherStatusInput] = useState<HomeworkStatus>('reviewed');
  const [bonusStarsInput, setBonusStarsInput] = useState<number>(10);

  // --------------------------------------------------------------------------
  // Handlers for Teacher Assignment Tasks
  // --------------------------------------------------------------------------
  const handleOpenCreateTaskModal = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskSubject('วิทยาศาสตร์และเทคโนโลยี ม.3');
    setTaskDescription('');
    setTaskTargetClass('ทุกห้อง');
    setTaskMaxScore(10);
    setTaskDueDate('15 ก.ย. 2569');
    setTaskAttachmentName('');
    setTaskAttachmentLink('');
    setTaskRewardStars(50);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: AssignmentTask) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskSubject(task.subject);
    setTaskDescription(task.description);
    setTaskTargetClass(task.targetClass);
    setTaskMaxScore(task.maxScore);
    setTaskDueDate(task.dueDate);
    setTaskAttachmentName(task.attachmentName || '');
    setTaskAttachmentLink(task.attachmentLink || '');
    setTaskRewardStars(task.rewardStars);
    setIsTaskModalOpen(true);
  };

  const handleSaveAssignmentTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTaskId) {
      // Update existing task
      const existing = assignmentTasks.find((t) => t.id === editingTaskId);
      if (existing && onUpdateAssignmentTask) {
        const updated: AssignmentTask = {
          ...existing,
          title: taskTitle.trim(),
          subject: taskSubject.trim() || 'วิทยาศาสตร์และเทคโนโลยี ม.3',
          description: taskDescription.trim(),
          targetClass: taskTargetClass,
          maxScore: Number(taskMaxScore) || 10,
          dueDate: taskDueDate.trim() || 'ไม่มีกำหนด',
          attachmentName: taskAttachmentName.trim() || undefined,
          attachmentLink: taskAttachmentLink.trim() || undefined,
          rewardStars: Number(taskRewardStars) || 50,
        };
        onUpdateAssignmentTask(updated);
      }
    } else {
      // Create new task
      const newTask: AssignmentTask = {
        id: 'task-' + Date.now(),
        title: taskTitle.trim(),
        subject: taskSubject.trim() || 'วิทยาศาสตร์และเทคโนโลยี ม.3',
        description: taskDescription.trim(),
        targetClass: taskTargetClass,
        maxScore: Number(taskMaxScore) || 10,
        dueDate: taskDueDate.trim() || '15 ก.ย. 2569',
        createdAt: new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' }),
        authorTeacher: currentUser.name,
        attachmentName: taskAttachmentName.trim() || (taskAttachmentLink ? 'เอกสารประกอบ_ใบงาน.pdf' : undefined),
        attachmentLink: taskAttachmentLink.trim() || undefined,
        rewardStars: Number(taskRewardStars) || 50,
      };
      if (onCreateAssignmentTask) {
        onCreateAssignmentTask(newTask);
      }
      triggerFestiveConfetti();
    }

    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบชิ้นงานนี้?')) {
      if (onDeleteAssignmentTask) {
        onDeleteAssignmentTask(taskId);
      }
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for Student Submissions
  // --------------------------------------------------------------------------
  const handleSelectTaskToSubmit = (task: AssignmentTask) => {
    setSelectedTaskForSubmission(task.id);
    setTitle(`ส่งผลงาน: ${task.title}`);
    setSubject(task.subject);
    setActiveSubTab('submit');
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedTask = assignmentTasks.find((t) => t.id === selectedTaskForSubmission);

    const newHw: Homework = {
      id: 'hw-' + Date.now(),
      taskId: selectedTaskForSubmission || undefined,
      title: title.trim(),
      subject: subject.trim() || matchedTask?.subject || 'วิทยาศาสตร์และเทคโนโลยี ม.3',
      description: description.trim() || 'ส่งการบ้านเรียบร้อยครับ/ค่ะ',
      link: link.trim(),
      attachedFileName: attachedFileName || (link ? 'ผลงาน_ลิงก์แนบ.url' : 'ไฟล์การบ้าน_ม3.pdf'),
      submittedAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
      updatedAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentClass: currentUser.classRoom,
      studentAvatar: currentUser.avatar,
      status: 'pending',
      maxScore: matchedTask?.maxScore || 10,
      earnedStars: matchedTask?.rewardStars || 50,
    };

    onSubmitHomework(newHw);
    onAwardStars(matchedTask?.rewardStars || 50, `ส่งชิ้นงาน: ${title} (+${matchedTask?.rewardStars || 50} ⭐)`);
    triggerFestiveConfetti();

    // Reset Form
    setTitle('');
    setDescription('');
    setLink('');
    setAttachedFileName('');
    setSelectedTaskForSubmission('');
  };

  // --------------------------------------------------------------------------
  // Handlers for Teacher Score Entry (Direct Inline Input & Modal)
  // --------------------------------------------------------------------------
  const handleInlineScoreChange = (hwId: string, value: string) => {
    setInlineScores((prev) => ({
      ...prev,
      [hwId]: value,
    }));
  };

  const handleSaveInlineScore = (hw: Homework) => {
    const rawVal = inlineScores[hw.id];
    const scoreNum = rawVal !== undefined && rawVal !== '' ? Number(rawVal) : (hw.teacherScore ?? 10);
    const max = hw.maxScore || 10;
    const finalScore = Math.min(Math.max(0, scoreNum), max);

    const updated: Homework = {
      ...hw,
      teacherScore: finalScore,
      status: 'reviewed',
      teacherComment: hw.teacherComment || 'ครูตรวจและบันทึกคะแนนเรียบร้อยแล้ว ยอดเยี่ยมมาก!',
      updatedAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    onUpdateHomework(updated);
    setSavedFeedbackId(hw.id);
    setTimeout(() => setSavedFeedbackId(null), 2500);
    triggerStarBurst();
  };

  const openDetailModal = (hw: Homework) => {
    setSelectedHomework(hw);
    setIsEditingModal(false);
    setEditTitle(hw.title);
    setEditDescription(hw.description);
    setEditLink(hw.link);
    setEditAttachedFile(hw.attachedFileName || '');
    setTeacherScoreInput(hw.teacherScore ?? (hw.maxScore || 10));
    setTeacherCommentInput(hw.teacherComment || 'ทำงานได้เรียบร้อย ถูกต้องตามหลักการและตัวชี้วัดยอดเยี่ยมมาก!');
    setTeacherStatusInput(hw.status === 'needs_fix' ? 'needs_fix' : 'reviewed');
    setBonusStarsInput(10);
  };

  const handleTeacherGradeHomework = () => {
    if (!selectedHomework) return;

    const updated: Homework = {
      ...selectedHomework,
      status: teacherStatusInput,
      teacherScore: Number(teacherScoreInput),
      teacherComment: teacherCommentInput.trim(),
      earnedStars: selectedHomework.earnedStars + (teacherStatusInput === 'reviewed' ? bonusStarsInput : 0),
      updatedAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    onUpdateHomework(updated);
    setSelectedHomework(updated);
    triggerFestiveConfetti();
  };

  const handleSaveEditedHomework = () => {
    if (!selectedHomework || !editTitle.trim()) return;

    const updated: Homework = {
      ...selectedHomework,
      title: editTitle.trim(),
      description: editDescription.trim(),
      link: editLink.trim(),
      attachedFileName: editAttachedFile,
      updatedAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    onUpdateHomework(updated);
    setSelectedHomework(updated);
    setIsEditingModal(false);
  };

  // Counts & Filter logic
  const pendingCount = homeworkList.filter((h) => h.status === 'pending').length;
  const reviewedCount = homeworkList.filter((h) => h.status === 'reviewed').length;
  const needsFixCount = homeworkList.filter((h) => h.status === 'needs_fix').length;

  const filteredHomeworkList = homeworkList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchClass = classFilter === 'all' || item.studentClass.includes(classFilter);
    const matchTask = taskFilter === 'all' || item.taskId === taskFilter;

    return matchSearch && matchStatus && matchClass && (isTeacher ? true : item.studentId === currentUser.id || true);
  });

  const mySubmissions = homeworkList.filter((h) => h.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="sketch-border rounded-[22px_14px_24px_16px] p-5 md:p-6 shadow-[5px_5px_0px_#18181b] relative overflow-hidden bg-[#FEF08A]"
      >
        <div className="washi-tape -top-2 left-12 rotate-[-2deg] bg-pink-200" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-amber-400 sketch-border rounded-[14px_10px_16px_12px] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
              {isTeacher ? '📦' : '📝'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-zinc-900">
                  {isTeacher
                    ? '1. เพิ่มชิ้นงาน (สามารถโพสต์งานให้นักเรียนทำได้)'
                    : '1. เพิ่มชิ้นงาน & ส่งภาระงานที่ได้รับมอบหมาย'}
                </h2>
                {isTeacher ? (
                  <span className="bg-purple-300 text-purple-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-zinc-900 shadow-[1px_1px_0px_#000]">
                    โหมดคุณครูผู้สอน
                  </span>
                ) : (
                  <span className="bg-emerald-300 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-zinc-900 shadow-[1px_1px_0px_#000]">
                    +50 ⭐ ทุกชิ้นงาน
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm font-semibold text-zinc-700 mt-0.5">
                {isTeacher
                  ? 'โพสต์ชิ้นงาน/ภาระงานใหม่ให้นักเรียนทำ ตรวจสอบงานที่ส่ง และกรอกคะแนนประเมินผลงานนักเรียน'
                  : 'ดูรายการชิ้นงานที่ครูโพสต์มอบหมาย แนบไฟล์ผลงาน/ลิงก์ส่งการบ้าน และติดตามคะแนนที่ครูตรวจ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isTeacher ? (
              <button
                type="button"
                onClick={handleOpenCreateTaskModal}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl sketch-btn flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181b]"
              >
                <Plus className="w-4 h-4" />
                <span>➕ โพสต์ชิ้นงานใหม่</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border-2 border-zinc-900 text-xs font-bold shadow-[2px_2px_0px_#000]">
                <span>ชิ้นงานที่ครูมอบหมาย: {assignmentTasks.length} ชิ้น</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b-2 border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('tasks')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm border-2 border-zinc-900 flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'tasks'
              ? 'bg-amber-300 text-zinc-950 shadow-[3px_3px_0px_#18181b] translate-y-[-2px]'
              : 'bg-white text-zinc-700 hover:bg-amber-50 shadow-[1px_1px_0px_#000]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isTeacher ? '➕ เพิ่มชิ้นงาน (โพสต์งานให้นักเรียนทำ)' : '📋 ชิ้นงานที่ได้รับมอบหมาย'}</span>
          <span className="bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {assignmentTasks.length}
          </span>
        </button>

        {isTeacher ? (
          <button
            type="button"
            onClick={() => setActiveSubTab('submissions')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm border-2 border-zinc-900 flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'submissions'
                ? 'bg-amber-300 text-zinc-950 shadow-[3px_3px_0px_#18181b] translate-y-[-2px]'
                : 'bg-white text-zinc-700 hover:bg-amber-50 shadow-[1px_1px_0px_#000]'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>📝 ตรวจการบ้าน & กรอกคะแนน</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {pendingCount} รอตรวจ
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveSubTab('submit')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm border-2 border-zinc-900 flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'submit'
                ? 'bg-amber-300 text-zinc-950 shadow-[3px_3px_0px_#18181b] translate-y-[-2px]'
                : 'bg-white text-zinc-700 hover:bg-amber-50 shadow-[1px_1px_0px_#000]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>📤 ส่งผลงาน & ประวัติการส่งของฉัน</span>
            <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              ส่งแล้ว {mySubmissions.length}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: ASSIGNMENT TASKS LIST (ทั้งครูและนักเรียน) */}
      {/* ========================================================================= */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 p-3.5 rounded-xl border border-amber-300 text-xs font-semibold text-zinc-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {isTeacher
                  ? 'คุณครูสามารถกดปุ่ม "➕ โพสต์ชิ้นงานใหม่" เพื่อมอบหมายภาระงาน ใบงาน หรือโครงงานให้นักเรียนทำได้'
                  : 'เลือกชิ้นงานที่ต้องการทำ จากนั้นกดปุ่ม "📤 ส่งชิ้นงานนี้" เพื่อแนบไฟล์หรือลิงก์ผลงาน'}
              </span>
            </div>
            {isTeacher && (
              <button
                type="button"
                onClick={handleOpenCreateTaskModal}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black rounded-lg border border-zinc-900 shadow-[1px_1px_0px_#000] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> โพสต์ชิ้นงานใหม่
              </button>
            )}
          </div>

          {assignmentTasks.length === 0 ? (
            <div className="bg-white sketch-border rounded-[22px_16px_20px_18px] p-10 text-center shadow-[4px_4px_0px_#18181b]">
              <div className="text-5xl mb-3">📋</div>
              <h4 className="text-lg font-black text-zinc-900">ยังไม่มีชิ้นงานที่โพสต์มอบหมาย</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-1">
                {isTeacher ? 'กดปุ่มด้านบนเพื่อเริ่มโพสต์งานชิ้นแรก' : 'รอคุณครูโพสต์มอบหมายงานใหม่'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignmentTasks.map((task) => {
                const submissionsForTask = homeworkList.filter((h) => h.taskId === task.id);
                const isSubmittedByMe = mySubmissions.some((h) => h.taskId === task.id);
                const mySubmissionItem = mySubmissions.find((h) => h.taskId === task.id);

                return (
                  <div
                    key={task.id}
                    className="bg-white sketch-border rounded-[20px_14px_18px_16px] p-5 shadow-[4px_4px_0px_#18181b] flex flex-col justify-between hover:translate-y-[-2px] transition-all relative"
                  >
                    <div className="space-y-2.5">
                      {/* Tags & Class */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-zinc-900">
                          {task.subject}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          <span className="bg-purple-100 text-purple-950 px-2 py-0.5 rounded border border-purple-300">
                            🏫 {task.targetClass}
                          </span>
                          <span className="bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded border border-emerald-400 font-black">
                            ⭐ +{task.rewardStars}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-zinc-900 leading-snug">
                        {task.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs font-semibold text-zinc-600 line-clamp-3">
                        {task.description}
                      </p>

                      {/* Details Box */}
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 text-[11px] font-bold text-zinc-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-zinc-600">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" /> กำหนดส่ง:
                          </span>
                          <span className="font-black text-rose-600">{task.dueDate}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-zinc-600">
                            <Award className="w-3.5 h-3.5 text-amber-500" /> คะแนนเต็ม:
                          </span>
                          <span className="font-black text-zinc-900">{task.maxScore} คะแนน</span>
                        </div>

                        {task.attachmentName && (
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-200">
                            <span className="flex items-center gap-1 text-zinc-600">
                              <Paperclip className="w-3 h-3" /> ใบความรู้/ไฟล์:
                            </span>
                            {task.attachmentLink ? (
                              <a
                                href={task.attachmentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline flex items-center gap-0.5 font-bold truncate max-w-[140px]"
                              >
                                <ExternalLink className="w-3 h-3" /> {task.attachmentName}
                              </a>
                            ) : (
                              <span className="text-zinc-700 font-bold truncate max-w-[140px]">
                                {task.attachmentName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-3 border-t-2 border-zinc-100 flex items-center justify-between gap-2">
                      {isTeacher ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setRosterModalTask(task);
                              setRosterSubTab('submitted');
                              setRosterSearch('');
                            }}
                            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl sketch-btn flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181b]"
                            title="คลิกเพื่อดูรายชื่อนักเรียนที่ส่งงานและเข้าไปดูผลงาน"
                          >
                            <Eye className="w-4 h-4" />
                            <span>ดูชิ้นงาน ({submissionsForTask.length} คนส่ง)</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditTaskModal(task)}
                              className="p-2 bg-amber-100 hover:bg-amber-200 text-zinc-800 rounded-xl border border-zinc-400 cursor-pointer shadow-[1px_1px_0px_#000]"
                              title="แก้ไขชิ้นงาน"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl border border-rose-300 cursor-pointer shadow-[1px_1px_0px_#000]"
                              title="ลบชิ้นงาน"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {isSubmittedByMe ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> ส่งแล้ว
                                {mySubmissionItem?.teacherScore !== undefined && (
                                  <span>({mySubmissionItem.teacherScore}/{task.maxScore} คะแนน)</span>
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => setActiveSubTab('submit')}
                                className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                              >
                                ดูงานที่ส่ง ↗
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectTaskToSubmit(task)}
                              className="w-full py-2 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black text-xs rounded-xl sketch-btn flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>📤 ส่งชิ้นงานนี้ (+{task.rewardStars} ⭐)</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TEACHER SUBMISSIONS BOARD WITH DIRECT SCORE INPUT FIELDS */}
      {/* ========================================================================= */}
      {isTeacher && activeSubTab === 'submissions' && (
        <div className="space-y-4">
          {/* Teacher Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div
              onClick={() => setStatusFilter('all')}
              className={`p-3.5 rounded-[18px_12px_16px_14px] border-2 border-zinc-900 cursor-pointer transition-all ${
                statusFilter === 'all'
                  ? 'bg-amber-300 shadow-[4px_4px_0px_#18181b] translate-y-[-2px]'
                  : 'bg-white shadow-[2px_2px_0px_#000] hover:bg-amber-50'
              }`}
            >
              <div className="text-xs font-bold text-zinc-600">ผลงานทั้งหมด</div>
              <div className="text-2xl font-black text-zinc-950 mt-0.5">{homeworkList.length} งาน</div>
            </div>

            <div
              onClick={() => setStatusFilter('pending')}
              className={`p-3.5 rounded-[18px_12px_16px_14px] border-2 border-zinc-900 cursor-pointer transition-all ${
                statusFilter === 'pending'
                  ? 'bg-sky-300 shadow-[4px_4px_0px_#18181b] translate-y-[-2px]'
                  : 'bg-white shadow-[2px_2px_0px_#000] hover:bg-sky-50'
              }`}
            >
              <div className="text-xs font-bold text-sky-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> รอการตรวจ
              </div>
              <div className="text-2xl font-black text-sky-950 mt-0.5">{pendingCount} งาน</div>
            </div>

            <div
              onClick={() => setStatusFilter('reviewed')}
              className={`p-3.5 rounded-[18px_12px_16px_14px] border-2 border-zinc-900 cursor-pointer transition-all ${
                statusFilter === 'reviewed'
                  ? 'bg-emerald-300 shadow-[4px_4px_0px_#18181b] translate-y-[-2px]'
                  : 'bg-white shadow-[2px_2px_0px_#000] hover:bg-emerald-50'
              }`}
            >
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> ตรวจเรียบร้อย
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-0.5">{reviewedCount} งาน</div>
            </div>

            <div
              onClick={() => setStatusFilter('needs_fix')}
              className={`p-3.5 rounded-[18px_12px_16px_14px] border-2 border-zinc-900 cursor-pointer transition-all ${
                statusFilter === 'needs_fix'
                  ? 'bg-orange-300 shadow-[4px_4px_0px_#18181b] translate-y-[-2px]'
                  : 'bg-white shadow-[2px_2px_0px_#000] hover:bg-orange-50'
              }`}
            >
              <div className="text-xs font-bold text-orange-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> ส่งกลับแก้ไข
              </div>
              <div className="text-2xl font-black text-orange-950 mt-0.5">{needsFixCount} งาน</div>
            </div>
          </div>

          {/* Filter Bar for Teacher */}
          <div className="bg-white sketch-border rounded-[18px_12px_16px_14px] p-4 shadow-[4px_4px_0px_#18181b] flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่องาน หรือชื่อนักเรียน..."
                className="w-full bg-zinc-50 pl-9 pr-3 py-2 rounded-xl border border-zinc-300 focus:border-zinc-900 text-xs font-semibold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Task filter */}
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className="bg-zinc-100 px-3 py-2 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-800"
              >
                <option value="all">📋 ทุกชิ้นงานที่มอบหมาย</option>
                {assignmentTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title.substring(0, 30)}...
                  </option>
                ))}
              </select>

              {/* Class Filter */}
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

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-300 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'all' ? 'bg-zinc-900 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'pending' ? 'bg-sky-600 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  รอตรวจ
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('reviewed')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'reviewed' ? 'bg-emerald-600 text-white font-black' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  ตรวจแล้ว
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Submissions List with Inline Editable Score Input Fields */}
          {filteredHomeworkList.length === 0 ? (
            <div className="bg-white sketch-border rounded-[22px_16px_20px_18px] p-10 text-center shadow-[4px_4px_0px_#18181b]">
              <div className="text-5xl mb-3">📭</div>
              <h4 className="text-lg font-black text-zinc-900">ไม่พบรายการผลงานตามเงื่อนไขที่เลือก</h4>
              <p className="text-xs font-semibold text-zinc-500 mt-1">ลองเปลี่ยนคำค้นหาหรือรีเซ็ตตัวกรองสถานะ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHomeworkList.map((hw) => {
                const currentScoreVal =
                  inlineScores[hw.id] !== undefined
                    ? inlineScores[hw.id]
                    : hw.teacherScore !== undefined
                    ? hw.teacherScore
                    : '';
                const max = hw.maxScore || 10;
                const isSaved = savedFeedbackId === hw.id;

                return (
                  <div
                    key={hw.id}
                    className="bg-white hover:bg-amber-50/30 sketch-border rounded-[20px_14px_18px_16px] p-5 shadow-[4px_4px_0px_#18181b] transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-zinc-900">
                          {hw.subject}
                        </span>

                        {hw.status === 'reviewed' ? (
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-500 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            ตรวจแล้ว: ได้ {hw.teacherScore ?? 10}/{max} คะแนน
                          </span>
                        ) : hw.status === 'needs_fix' ? (
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-950 border border-orange-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-orange-700" /> รอให้นักเรียนแก้ไข
                          </span>
                        ) : (
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-500 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-sky-700" /> รอคุณครูตรวจ
                          </span>
                        )}

                        <span className="text-xs font-bold text-zinc-500">
                          ส่งเมื่อ: {hw.submittedAt}
                        </span>
                      </div>

                      <h4 className="text-base md:text-lg font-black text-zinc-900">
                        {hw.title}
                      </h4>

                      <p className="text-xs md:text-sm font-semibold text-zinc-600">
                        {hw.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold text-zinc-700">
                        <div className="bg-zinc-100 px-2.5 py-1 rounded-xl border border-zinc-300 flex items-center gap-2">
                          <AvatarDisplay avatar={hw.studentAvatar} className="w-6 h-6" />
                          <span>{hw.studentName} ({hw.studentClass})</span>
                        </div>

                        {hw.link && (
                          <a
                            href={hw.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-700 hover:underline flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-300 font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> เปิดดูผลงาน/ลิงก์
                          </a>
                        )}

                        {hw.attachedFileName && (
                          <span className="text-zinc-600 flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-xl border border-zinc-300">
                            <FileText className="w-3.5 h-3.5" /> {hw.attachedFileName}
                          </span>
                        )}
                      </div>

                      {/* Teacher Comment */}
                      {hw.teacherComment && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-950">
                          <span className="font-bold">💬 คำติชมของครู:</span> "{hw.teacherComment}"
                        </div>
                      )}
                    </div>

                    {/* Right: Direct Editable Score Input Field & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto bg-amber-50/70 p-3.5 rounded-2xl border-2 border-amber-300">
                      <div className="w-full">
                        <label className="block text-[11px] font-black text-zinc-800 mb-1">
                          ✏️ ช่องกรอกคะแนน (คะแนนเต็ม {max}):
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={max}
                            step="0.5"
                            value={currentScoreVal}
                            onChange={(e) => handleInlineScoreChange(hw.id, e.target.value)}
                            placeholder={`0-${max}`}
                            className="w-20 px-2 py-1.5 bg-white border-2 border-zinc-900 rounded-xl text-center font-black text-sm focus:bg-yellow-50 focus:ring-2 focus:ring-purple-400"
                          />
                          <span className="text-xs font-bold text-zinc-600">/ {max}</span>
                          <button
                            type="button"
                            onClick={() => handleSaveInlineScore(hw)}
                            className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black text-xs rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>บันทึก</span>
                          </button>
                        </div>
                        {isSaved && (
                          <span className="text-[10px] font-black text-emerald-700 mt-1 flex items-center gap-0.5 animate-bounce">
                            <Check className="w-3 h-3" /> บันทึกคะแนนสำเร็จ!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => openDetailModal(hw)}
                          className="w-full px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl sketch-btn flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181b]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>🔍 เข้าไปดูชิ้นงาน & ตรวจละเอียด</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: STUDENT SUBMISSION FORM & MY SUBMISSIONS */}
      {/* ========================================================================= */}
      {!isTeacher && activeSubTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Submit New Work */}
          <div className="lg:col-span-5 bg-white sketch-border rounded-[22px_16px_20px_18px] p-6 shadow-[5px_5px_0px_#18181b] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-zinc-900">แบบฟอร์มส่งชิ้นงาน ม.3</h3>
              </div>
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-400">
                +50 ⭐
              </span>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              {/* Select Task if any */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  📌 เลือกชิ้นงานที่ต้องการส่ง (ถ้ามี):
                </label>
                <select
                  value={selectedTaskForSubmission}
                  onChange={(e) => {
                    setSelectedTaskForSubmission(e.target.value);
                    const t = assignmentTasks.find((item) => item.id === e.target.value);
                    if (t) {
                      setTitle(`ส่งผลงาน: ${t.title}`);
                      setSubject(t.subject);
                    }
                  }}
                  className="w-full bg-amber-50/50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold"
                >
                  <option value="">-- ส่งงานทั่วไป หรือเลือกจากชิ้นงานที่ครูมอบหมาย --</option>
                  {assignmentTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.subject} - กำหนดส่ง: {t.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  หัวข้อ / ชื่องานที่ส่ง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น รายงานการวิเคราะห์ระบบแบตเตอรี่ EV..."
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">วิชา / กลุ่มสาระ</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">คำอธิบายสรุป / บันทึกถึงคุณครู</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="สรุปแนวคิด หรือสิ่งที่จะนำเสนอให้คุณครูทราบ..."
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-semibold sketch-input"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">แนบลิงก์ผลงาน (Canva / Google Drive / URL)</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-zinc-50 pl-9 pr-3 py-2 rounded-xl border-2 border-zinc-900 text-xs font-semibold sketch-input"
                  />
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">แนบไฟล์ผลงาน (PDF / รูปภาพ / เอกสาร)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 bg-zinc-50 hover:bg-zinc-100 p-2.5 rounded-xl border-2 border-dashed border-zinc-400 flex items-center justify-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                    <Paperclip className="w-4 h-4 text-zinc-500" />
                    <span>{attachedFileName || 'คลิกเพื่อเลือกไฟล์ส่งงาน...'}</span>
                    <input type="file" onChange={handleSimulatedFileUpload} className="hidden" />
                  </label>
                  {attachedFileName && (
                    <button
                      type="button"
                      onClick={() => setAttachedFileName('')}
                      className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-sm rounded-xl sketch-btn flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181b]"
              >
                <Send className="w-4 h-4" />
                <span>ส่งชิ้นงานเข้ากล่องการบ้าน (+50 ⭐)</span>
              </button>
            </form>
          </div>

          {/* Right: My Submitted Works with Scores */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl sketch-border shadow-[3px_3px_0px_#000]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-zinc-900">
                  ประวัติการส่งชิ้นงานของฉัน ({mySubmissions.length} รายการ)
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-500">
                นักเรียน: {currentUser.name}
              </span>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="bg-white sketch-border rounded-[22px_16px_20px_18px] p-8 text-center shadow-[4px_4px_0px_#18181b]">
                <div className="text-4xl mb-2">📭</div>
                <h4 className="text-base font-black text-zinc-900">คุณยังไม่ได้ส่งชิ้นงานใดๆ</h4>
                <p className="text-xs font-semibold text-zinc-500 mt-1">
                  กรอกแบบฟอร์มด้านซ้าย หรือเลือกชิ้นงานจากแท็บ "ชิ้นงานที่ได้รับมอบหมาย" เพื่อส่งงาน
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map((hw) => {
                  return (
                    <div
                      key={hw.id}
                      className="bg-white sketch-border rounded-[18px_14px_16px_14px] p-4 shadow-[3px_3px_0px_#18181b] space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-zinc-900">
                          {hw.subject}
                        </span>

                        {hw.status === 'reviewed' ? (
                          <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-100 text-emerald-950 border-2 border-emerald-500 flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            ครูตรวจแล้ว: ได้ {hw.teacherScore ?? 10}/{hw.maxScore || 10} คะแนน ⭐
                          </span>
                        ) : hw.status === 'needs_fix' ? (
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-950 border border-orange-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-orange-700" /> รอให้นักเรียนแก้ไข
                          </span>
                        ) : (
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-500 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-sky-700" /> รอคุณครูตรวจและให้คะแนน
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-zinc-900">{hw.title}</h4>
                      <p className="text-xs font-semibold text-zinc-600">{hw.description}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-zinc-600">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                          📅 ส่งเมื่อ: {hw.submittedAt}
                        </span>
                        {hw.link && (
                          <a
                            href={hw.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-700 hover:underline flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-300"
                          >
                            <ExternalLink className="w-3 h-3" /> เปิดดูลิงก์ที่แนบ
                          </a>
                        )}
                        {hw.attachedFileName && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {hw.attachedFileName}
                          </span>
                        )}
                      </div>

                      {/* Teacher Comment */}
                      {hw.teacherComment && (
                        <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs font-semibold text-emerald-950 space-y-1 mt-2">
                          <div className="font-black flex items-center gap-1 text-emerald-900">
                            <MessageSquare className="w-3.5 h-3.5" /> คำติชมและข้อเสนอแนะจากคุณครู:
                          </div>
                          <p>"{hw.teacherComment}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TEACHER POST / EDIT ASSIGNMENT TASK */}
      {/* ========================================================================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white sketch-border rounded-[24px_16px_22px_18px] p-6 max-w-xl w-full shadow-[8px_8px_0px_#18181b] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <h3 className="text-lg font-black text-zinc-900">
                  {editingTaskId ? 'แก้ไขชิ้นงานที่มอบหมาย' : '➕ โพสต์ชิ้นงานใหม่ให้นักเรียนทำ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-full border border-zinc-300 cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-700" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignmentTask} className="space-y-3.5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  หัวข้อ / ชื่อภาระงาน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="เช่น ใบงานที่ 3: การประยุกต์ใช้กฎการอนุรักษ์พลังงาน..."
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                />
              </div>

              {/* Subject & Target Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">วิชา / กลุ่มสาระ</label>
                  <input
                    type="text"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">ห้องเรียนเป้าหมาย</label>
                  <select
                    value={taskTargetClass}
                    onChange={(e) => setTaskTargetClass(e.target.value)}
                    className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                  >
                    <option value="ทุกห้อง">ทุกห้อง (ม.3/1 และ ม.3/2)</option>
                    <option value="ม.3/1">เฉพาะ ม.3/1</option>
                    <option value="ม.3/2">เฉพาะ ม.3/2</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  คำสั่ง / คำชี้แจงและเกณฑ์การประเมิน
                </label>
                <textarea
                  rows={3}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="ระบุสิ่งที่ให้นักเรียนทำ รูปแบบการส่ง และเกณฑ์การให้คะแนน..."
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-semibold sketch-input"
                />
              </div>

              {/* Max Score & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">คะแนนเต็ม</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={taskMaxScore}
                    onChange={(e) => setTaskMaxScore(Number(e.target.value))}
                    className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-black sketch-input text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">กำหนดส่ง</label>
                  <input
                    type="text"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    placeholder="เช่น 15 ก.ย. 2569"
                    className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-bold sketch-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">ดาวรางวัลเมื่อส่ง</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={taskRewardStars}
                    onChange={(e) => setTaskRewardStars(Number(e.target.value))}
                    className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-black sketch-input text-center"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2 bg-zinc-50 p-3 rounded-xl border border-zinc-300">
                <label className="block text-xs font-black text-zinc-800">
                  📎 แนบเอกสารใบงาน / สื่อการสอน (ทางเลือก):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={taskAttachmentName}
                    onChange={(e) => setTaskAttachmentName(e.target.value)}
                    placeholder="ชื่อไฟล์ เช่น ใบความรู้_กลศาสตร์.pdf"
                    className="w-full bg-white p-2 rounded-lg border border-zinc-300 text-xs font-semibold"
                  />
                  <input
                    type="url"
                    value={taskAttachmentLink}
                    onChange={(e) => setTaskAttachmentLink(e.target.value)}
                    placeholder="ลิงก์ดาวน์โหลด เช่น https://..."
                    className="w-full bg-white p-2 rounded-lg border border-zinc-300 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl sketch-btn flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTaskId ? 'บันทึกการแก้ไข' : 'โพสต์ชิ้นงานนี้ทันที'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TEACHER TASK SUBMISSIONS ROSTER & STUDENT WORKS VIEWER */}
      {/* ========================================================================= */}
      {rosterModalTask && (() => {
        const task = rosterModalTask;
        const taskSubmissions = homeworkList.filter((h) => h.taskId === task.id);
        const submittedStudentIds = new Set(taskSubmissions.map((h) => h.studentId));
        
        // Target students in class
        const targetStudents = studentRecords.filter((s) => {
          if (task.targetClass === 'ทุกห้อง' || !task.targetClass) return true;
          return s.classRoom === task.targetClass;
        });

        const unsubmittedList = targetStudents.filter((s) => !submittedStudentIds.has(s.id));

        // Filtered submissions
        const filteredSubmissions = taskSubmissions.filter((h) => {
          if (!rosterSearch.trim()) return true;
          const q = rosterSearch.toLowerCase();
          return (
            h.studentName.toLowerCase().includes(q) ||
            h.title.toLowerCase().includes(q) ||
            (h.studentClass && h.studentClass.toLowerCase().includes(q))
          );
        });

        // Filtered unsubmitted
        const filteredUnsubmitted = unsubmittedList.filter((s) => {
          if (!rosterSearch.trim()) return true;
          const q = rosterSearch.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.studentNo.includes(q) ||
            (s.studentIdCode && s.studentIdCode.toLowerCase().includes(q))
          );
        });

        const reviewedCount = taskSubmissions.filter((h) => h.status === 'reviewed').length;
        const pendingCount = taskSubmissions.filter((h) => h.status === 'pending').length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white sketch-border rounded-[24px_16px_22px_18px] p-5 sm:p-6 max-w-4xl w-full shadow-[8px_8px_0px_#18181b] space-y-4 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-300 text-amber-950 border border-zinc-900">
                      {task.subject}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300">
                      🏫 {task.targetClass}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
                      📅 กำหนดส่ง: {task.dueDate}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400">
                      ⭐ คะแนนเต็ม {task.maxScore} คะแนน
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mt-1">
                    📋 รายชื่อนักเรียนและผลงาน: {task.title}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-600">
                    {task.description}
                  </p>
                  {task.attachmentName && (
                    <div className="pt-1 flex items-center gap-2 text-xs font-bold text-sky-700">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>ไฟล์ประกอบใบงาน:</span>
                      {task.attachmentLink ? (
                        <a
                          href={task.attachmentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-300"
                        >
                          <ExternalLink className="w-3 h-3" /> {task.attachmentName}
                        </a>
                      ) : (
                        <span className="text-zinc-700">{task.attachmentName}</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setRosterModalTask(null)}
                  className="p-1.5 hover:bg-zinc-100 rounded-full border border-zinc-300 cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 text-zinc-700" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-center">
                  <div className="text-[11px] font-bold text-zinc-600">ส่งแล้วทั้งหมด</div>
                  <div className="text-xl font-black text-zinc-900">{taskSubmissions.length} คน</div>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-300 text-center">
                  <div className="text-[11px] font-bold text-sky-700">รอครูตรวจ & ให้คะแนน</div>
                  <div className="text-xl font-black text-sky-950">{pendingCount} คน</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center">
                  <div className="text-[11px] font-bold text-emerald-700">ตรวจแล้วเรียบร้อย</div>
                  <div className="text-xl font-black text-emerald-950">{reviewedCount} คน</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-300 text-center">
                  <div className="text-[11px] font-bold text-rose-700">ยังไม่ส่งงาน</div>
                  <div className="text-xl font-black text-rose-950">{unsubmittedList.length} คน</div>
                </div>
              </div>

              {/* Search & Tabs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRosterSubTab('submitted')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 border-zinc-900 flex items-center gap-1.5 cursor-pointer transition-all ${
                      rosterSubTab === 'submitted'
                        ? 'bg-emerald-300 text-zinc-950 shadow-[2px_2px_0px_#000]'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>นักเรียนที่ส่งผลงานแล้ว ({taskSubmissions.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRosterSubTab('pending')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 border-zinc-900 flex items-center gap-1.5 cursor-pointer transition-all ${
                      rosterSubTab === 'pending'
                        ? 'bg-rose-300 text-zinc-950 shadow-[2px_2px_0px_#000]'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    <span>ยังไม่ส่งงาน ({unsubmittedList.length})</span>
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="ค้นหาชื่อหรือเลขที่นักเรียน..."
                    className="w-full bg-zinc-50 pl-9 pr-3 py-1.5 rounded-xl border border-zinc-300 text-xs font-semibold focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* TAB CONTENT: SUBMITTED LIST */}
              {rosterSubTab === 'submitted' && (
                <div className="space-y-3">
                  {filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-300">
                      <div className="text-3xl mb-1">📭</div>
                      <p className="text-xs font-black text-zinc-700">ยังไม่มีนักเรียนส่งชิ้นงานนี้</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        เมื่อนักเรียนกดส่งงาน ผลงานและลิงก์จะปรากฏที่นี่เพื่อให้คุณครูเข้าไปดูและตรวจให้คะแนน
                      </p>
                    </div>
                  ) : (
                    filteredSubmissions.map((hw) => {
                      const max = hw.maxScore || task.maxScore || 10;
                      const currentScoreVal =
                        inlineScores[hw.id] !== undefined
                          ? inlineScores[hw.id]
                          : hw.teacherScore !== undefined
                          ? hw.teacherScore
                          : '';
                      const isSaved = savedFeedbackId === hw.id;

                      return (
                        <div
                          key={hw.id}
                          className="bg-white hover:bg-amber-50/40 p-4 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_#18181b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                        >
                          {/* Student & Work Info */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="shrink-0 pt-0.5">
                              <AvatarDisplay avatar={hw.studentAvatar} className="w-12 h-12" />
                            </div>

                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-black text-sm text-zinc-900">
                                  {hw.studentName}
                                </span>
                                <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 rounded border border-zinc-300 text-zinc-700">
                                  {hw.studentClass}
                                </span>
                                <span className="text-[11px] font-semibold text-zinc-500">
                                  ส่งเมื่อ: {hw.submittedAt}
                                </span>

                                {hw.status === 'reviewed' ? (
                                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-500 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                                    ตรวจแล้ว: {hw.teacherScore ?? 10}/{max} คะแนน
                                  </span>
                                ) : hw.status === 'needs_fix' ? (
                                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-950 border border-orange-500">
                                    ⚠️ ส่งกลับแก้ไข
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-sky-100 text-sky-950 border border-sky-500 animate-pulse">
                                    ⏳ รอคุณครูตรวจ
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-bold text-zinc-800 line-clamp-2">
                                <span className="text-zinc-500 font-semibold">รายละเอียดที่ส่ง: </span>
                                {hw.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-bold">
                                {hw.link && (
                                  <a
                                    href={hw.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-700 hover:underline flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-300"
                                  >
                                    <ExternalLink className="w-3 h-3" /> เปิดผลงาน (Canva/Drive)
                                  </a>
                                )}

                                {hw.attachedFileName && (
                                  <span className="text-zinc-700 flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-300">
                                    <FileText className="w-3 h-3" /> {hw.attachedFileName}
                                  </span>
                                )}
                              </div>

                              {hw.teacherComment && (
                                <div className="text-xs font-semibold text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                                  <span className="font-black">💬 คำติชม: </span>"{hw.teacherComment}"
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Score Box & View Work Button */}
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 w-full md:w-auto bg-amber-50/80 p-3 rounded-xl border border-amber-300">
                            <div className="flex items-center gap-1.5">
                              <label className="text-xs font-black text-zinc-800">คะแนน:</label>
                              <input
                                type="number"
                                min="0"
                                max={max}
                                step="0.5"
                                value={currentScoreVal}
                                onChange={(e) => handleInlineScoreChange(hw.id, e.target.value)}
                                placeholder={`0-${max}`}
                                className="w-16 px-1.5 py-1 bg-white border-2 border-zinc-900 rounded-lg text-center font-black text-xs"
                              />
                              <span className="text-xs font-bold text-zinc-600">/{max}</span>
                              <button
                                type="button"
                                onClick={() => handleSaveInlineScore(hw)}
                                className="px-2.5 py-1 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black text-xs rounded-lg border border-zinc-900 shadow-[1px_1px_0px_#000] cursor-pointer"
                              >
                                บันทึก
                              </button>
                            </div>

                            {isSaved && (
                              <span className="text-[10px] font-black text-emerald-700">
                                ✓ บันทึกสำเร็จ
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setRosterModalTask(null);
                                openDetailModal(hw);
                              }}
                              className="w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl sketch-btn flex items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>🔍 เข้าไปดูชิ้นงาน & ตรวจละเอียด</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB CONTENT: UN-SUBMITTED LIST */}
              {rosterSubTab === 'pending' && (
                <div className="space-y-2.5">
                  {filteredUnsubmitted.length === 0 ? (
                    <div className="p-8 text-center bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                      <div className="text-3xl mb-1">🎉</div>
                      <p className="text-sm font-black text-emerald-950">นักเรียนทุกคนส่งชิ้นงานนี้ครบถ้วนแล้ว!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredUnsubmitted.map((std) => (
                        <div
                          key={std.id}
                          className="bg-white p-3 rounded-xl border-2 border-zinc-300 flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <AvatarDisplay avatar={std.avatar} className="w-10 h-10" />
                            <div>
                              <div className="text-xs font-black text-zinc-900">{std.name}</div>
                              <div className="text-[11px] font-bold text-zinc-500">
                                {std.classRoom} • เลขที่ {std.studentNo} {std.studentIdCode ? `(${std.studentIdCode})` : ''}
                              </div>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            ยังไม่ส่งงาน
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Close button */}
              <div className="flex justify-end pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setRosterModalTask(null)}
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs rounded-xl cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 3: TEACHER DETAILED GRADING & FEEDBACK MODAL */}
      {/* ========================================================================= */}
      {selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white sketch-border rounded-[24px_16px_22px_18px] p-6 max-w-2xl w-full shadow-[8px_8px_0px_#18181b] space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <AvatarDisplay avatar={selectedHomework.studentAvatar} className="w-12 h-12" />
                <div>
                  <h3 className="text-base md:text-lg font-black text-zinc-900">
                    ตรวจประเมินผลงานและกรอกคะแนนนักเรียน
                  </h3>
                  <span className="text-xs font-bold text-zinc-600">
                    นักเรียน: {selectedHomework.studentName} ({selectedHomework.studentClass})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHomework(null)}
                className="p-1.5 hover:bg-zinc-100 rounded-full border border-zinc-300 cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-700" />
              </button>
            </div>

            {/* Submission Preview Card */}
            <div className="bg-amber-50/70 p-4 rounded-xl border-2 border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-amber-200 text-amber-950 border border-zinc-900">
                  {selectedHomework.subject}
                </span>
                <span className="text-xs font-bold text-zinc-500">
                  ส่งเมื่อ: {selectedHomework.submittedAt}
                </span>
              </div>

              <h4 className="text-base font-black text-zinc-900">{selectedHomework.title}</h4>
              <p className="text-xs font-semibold text-zinc-700">{selectedHomework.description}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                {selectedHomework.link && (
                  <a
                    href={selectedHomework.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-sky-300"
                  >
                    <ExternalLink className="w-3 h-3" /> เปิดผลงานที่ส่ง (URL)
                  </a>
                )}
                {selectedHomework.attachedFileName && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-zinc-300 flex items-center gap-1 text-zinc-700">
                    <FileText className="w-3 h-3" /> {selectedHomework.attachedFileName}
                  </span>
                )}
              </div>
            </div>

            {/* Grading Form */}
            <div className="space-y-3.5 pt-1">
              {/* Score Input */}
              <div className="bg-white p-4 rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_#18181b] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-zinc-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>ช่องกรอกคะแนนที่ได้ของนักเรียน (คะแนนเต็ม {selectedHomework.maxScore || 10}):</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[10, 9, 8, 7].map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setTeacherScoreInput(sc)}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs rounded border border-amber-400 cursor-pointer"
                      >
                        +{sc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max={selectedHomework.maxScore || 10}
                    step="0.5"
                    value={teacherScoreInput}
                    onChange={(e) => setTeacherScoreInput(Number(e.target.value))}
                    className="w-28 px-3 py-2 bg-yellow-50 border-2 border-zinc-900 rounded-xl text-center font-black text-xl shadow-[2px_2px_0px_#000]"
                  />
                  <span className="text-sm font-bold text-zinc-700">
                    / {selectedHomework.maxScore || 10} คะแนน
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">สถานะการตรวจ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTeacherStatusInput('reviewed')}
                    className={`py-2 px-3 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      teacherStatusInput === 'reviewed'
                        ? 'bg-emerald-300 border-zinc-900 shadow-[2px_2px_0px_#000]'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-800" />
                    <span>ตรวจผ่านเรียบร้อย (มีคะแนน)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTeacherStatusInput('needs_fix')}
                    className={`py-2 px-3 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      teacherStatusInput === 'needs_fix'
                        ? 'bg-orange-300 border-zinc-900 shadow-[2px_2px_0px_#000]'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-orange-800" />
                    <span>ส่งกลับให้นักเรียนแก้ไข</span>
                  </button>
                </div>
              </div>

              {/* Teacher Comment */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  คำติชม / ข้อเสนอแนะของคุณครู
                </label>
                <textarea
                  rows={3}
                  value={teacherCommentInput}
                  onChange={(e) => setTeacherCommentInput(e.target.value)}
                  placeholder="พิมพ์คำแนะนำ หรือสิ่งที่นักเรียนทำได้ดี..."
                  className="w-full bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-900 text-xs font-semibold sketch-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setSelectedHomework(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={handleTeacherGradeHomework}
                  className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-black text-xs md:text-sm rounded-xl sketch-btn flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#18181b]"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกคะแนนและคำติชม ✨</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
