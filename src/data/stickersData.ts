import { StickerAchievement, AssignmentTask, Homework } from '../types';

export const initialStickers: StickerAchievement[] = [
  {
    id: 'first-step',
    name: 'First Step',
    thaiTitle: 'ผู้เริ่มต้นไฟแรง',
    description: 'ส่งการบ้านชิ้นแรกเข้าสู่กล่องการบ้านเรียบร้อย',
    icon: '🌟',
    color: 'from-amber-200 to-yellow-400 border-amber-500',
    condition: 'ส่งการบ้านสำเร็จอย่างน้อย 1 ชิ้น',
    isUnlocked: true, // initial state for demo or unlocked upon first homework
    unlockedAt: '2026-09-02'
  },
  {
    id: 'super-critic',
    name: 'Super Critic',
    thaiTitle: 'นักประเมินยอดเยี่ยม',
    description: 'ส่งแบบประเมินและข้อเสนอแนะให้คุณครูด้วยความตั้งใจ',
    icon: '💖',
    color: 'from-pink-200 to-rose-400 border-rose-500',
    condition: 'ส่งแบบประเมินกิจกรรมคุณครูอย่างน้อย 1 ครั้ง',
    isUnlocked: false
  },
  {
    id: 'ev-master',
    name: 'EV Master',
    thaiTitle: 'เซียนรถยนต์ไฟฟ้า EV',
    description: 'ทำแบบทดสอบเทคโนโลยียานยนต์ไฟฟ้าได้คะแนน 8/10 ขึ้นไป',
    icon: '⚡',
    color: 'from-emerald-200 to-teal-400 border-emerald-500',
    condition: 'ได้คะแนนควิซ EV ≥ 8 ข้อ (80%)',
    isUnlocked: false
  },
  {
    id: 'mechanics-guru',
    name: 'Mechanics Guru',
    thaiTitle: 'อัจฉริยะกลศาสตร์ ม.3',
    description: 'ทำแบบทดสอบฟิสิกส์กลศาสตร์และงาน-พลังงานได้คะแนน 8/10 ขึ้นไป',
    icon: '⚙️',
    color: 'from-sky-200 to-blue-400 border-blue-500',
    condition: 'ได้คะแนนควิซกลศาสตร์ ≥ 8 ข้อ (80%)',
    isUnlocked: false
  },
  {
    id: 'century-star',
    name: 'Century Star',
    thaiTitle: 'ดาวรุ่งพุ่งแรง 100+',
    description: 'สะสมดาวจากกิจกรรมทั้งหมดครบ 100 ดวงขึ้นไป',
    icon: '🏆',
    color: 'from-purple-200 to-indigo-400 border-purple-500',
    condition: 'มีดาวสะสมรวมครบ 100 ⭐',
    isUnlocked: false
  },
  {
    id: 'homework-legend',
    name: 'Homework Legend',
    thaiTitle: 'แชมป์กล่องการบ้าน ม.3',
    description: 'สุดยอดนักเรียนตัวอย่าง ส่งการบ้าน ทำควิซ และประเมินครบทุกเมนู',
    icon: '👑',
    color: 'from-amber-300 to-orange-400 border-orange-500',
    condition: 'ส่งการบ้าน + ทำควิซทั้ง 2 บท + ส่งแบบประเมินครู',
    isUnlocked: false
  }
];

export const sampleInitialAssignmentTasks: AssignmentTask[] = [
  {
    id: 'task-1',
    title: 'ใบงานที่ 1: วิเคราะห์และเปรียบเทียบระบบขับเคลื่อนรถยนต์ไฟฟ้า (EV vs ICE)',
    subject: 'วิทยาศาสตร์และเทคโนโลยี ม.3',
    description: 'ให้นักเรียนศึกษาโครงสร้างของรถยนต์ไฟฟ้า BEV, PHEV, HEV พร้อมสรุปข้อดี-ข้อจำกัด และส่วนประกอบหลัก 4 ส่วน (แบตเตอรี่, มอเตอร์, Inverter, BMS) จัดทำเป็นรายงานหรืออินโฟกราฟิก',
    targetClass: 'ทุกห้อง',
    maxScore: 10,
    dueDate: '10 ก.ย. 2569',
    createdAt: '2026-09-01 08:30',
    authorTeacher: 'คุณครูวิทยาศาสตร์ ม.3',
    attachmentName: 'ใบความรู้_ยานยนต์ไฟฟ้า_ม3.pdf',
    attachmentLink: 'https://example.com/ev-lesson-m3.pdf',
    rewardStars: 50,
  },
  {
    id: 'task-2',
    title: 'ใบงานที่ 2: การคำนวณงาน กำลัง และการประยุกต์ใช้เครื่องกลอย่างง่ายในชีวิตประจำวัน',
    subject: 'ฟิสิกส์พื้นฐาน ม.3',
    description: 'ให้นักเรียนแสดงวิธีทำโจทย์คำนวณงาน (W = F x s), กำลัง (P = W/t) และความได้เปรียบเชิงกล (MA) ของคาน รอก พื้นเอียง จำนวน 5 ข้อ พร้อมวาดรูปประกอบ',
    targetClass: 'ม.3/1',
    maxScore: 10,
    dueDate: '15 ก.ย. 2569',
    createdAt: '2026-09-02 09:00',
    authorTeacher: 'คุณครูวิทยาศาสตร์ ม.3',
    attachmentName: 'โจทย์การคำนวณกลศาสตร์_ม3.pdf',
    attachmentLink: 'https://example.com/mechanics-sheet.pdf',
    rewardStars: 50,
  },
  {
    id: 'task-3',
    title: 'โครงงานจำลอง: การออกแบบระบบเบรกจ่ายพลังงานคืน (Regenerative Braking)',
    subject: 'การออกแบบและเทคโนโลยี ม.3',
    description: 'ออกแบบผังจำลองการเปลี่ยนพลังงานจลน์เป็นพลังงานไฟฟ้าขณะเหยียบเบรกรถยนต์ พร้อมเขียนสรุปกฎการอนุรักษ์พลังงานในชีวิตจริง',
    targetClass: 'ม.3/2',
    maxScore: 20,
    dueDate: '20 ก.ย. 2569',
    createdAt: '2026-09-02 10:15',
    authorTeacher: 'คุณครูวิทยาศาสตร์ ม.3',
    attachmentName: 'คู่มือโครงงานสะเต็ม_ม3.pdf',
    attachmentLink: 'https://example.com/stem-project.pdf',
    rewardStars: 80,
  }
];

export const sampleInitialHomeworks: Homework[] = [
  {
    id: 'hw-1',
    taskId: 'task-1',
    title: 'รายงานการวิเคราะห์เซลล์แบตเตอรี่ LFP และมอเตอร์ขับเคลื่อนในรถ EV',
    subject: 'วิทยาศาสตร์และเทคโนโลยี ม.3',
    description: 'สรุปโครงสร้างของแบตเตอรี่ Blade Battery ชนิด LFP เปรียบเทียบกับ NMC พร้อมหลักการทำงานของมอเตอร์ PMSM',
    link: 'https://drive.google.com/drive/folders/sample-ev-report-m3',
    attachedFileName: 'EV_Battery_Report_M3.pdf',
    submittedAt: '2026-09-01 14:30',
    updatedAt: '2026-09-01 14:30',
    studentId: 'std-01',
    studentName: 'เด็กชายสมชาย สายวิทย์',
    studentClass: 'ม.3/1',
    studentAvatar: 'student-boy-glasses',
    status: 'reviewed',
    teacherScore: 10,
    maxScore: 10,
    teacherComment: 'ยอดเยี่ยมมาก มีการเปรียบเทียบตารางความปลอดภัยและค่า C-rate ได้ชัดเจน!',
    earnedStars: 50
  },
  {
    id: 'hw-2',
    taskId: 'task-2',
    title: 'แบบฝึกหัดคำนวณงาน กำลัง และความได้เปรียบเชิงกลของคานและรอก',
    subject: 'ฟิสิกส์พื้นฐาน ม.3',
    description: 'ทำโจทย์คำนวณโมเมนต์ทวน-โมเมนต์ตาม 10 ข้อ พร้อมวาดแผนภาพ Free Body Diagram',
    link: 'https://canva.com/design/sample-mechanics-diagram',
    attachedFileName: 'Mechanics_Exercise_Final.png',
    submittedAt: '2026-09-02 09:15',
    updatedAt: '2026-09-02 09:15',
    studentId: 'std-01',
    studentName: 'เด็กชายสมชาย สายวิทย์',
    studentClass: 'ม.3/1',
    studentAvatar: 'student-boy-glasses',
    status: 'pending',
    teacherScore: 9,
    maxScore: 10,
    teacherComment: 'แสดงวิธีทำได้ถูกต้อง ลายมืออ่านง่าย',
    earnedStars: 50
  }
];

export const sampleInitialEvaluations = [
  {
    id: 'eval-demo-1',
    studentId: 'std-02',
    studentName: 'เด็กหญิงฟ้าใส ใฝ่เรียนรู้',
    studentClass: 'ม.3/1',
    studentNo: '05',
    studentAvatar: 'student-girl-ponytail',
    ratingStars: 5,
    improvementText: 'อยากให้มีคลิปจำลอง 3D ของการทำงานมอเตอร์ไฟฟ้าเพิ่มเติมในสไลด์ค่ะ',
    recommendationText: 'คุณครูสอนสนุกมาก มีการยกตัวอย่างรถยนต์ไฟฟ้าจริงในชีวิตประจำวันทำให้เข้าใจง่ายสุดๆ ขอบคุณค่ะครู!',
    submittedAt: '2026-09-01 16:20',
    isAnonymous: false,
    teacherReply: 'ขอบคุณสำหรับข้อเสนอแนะนะจ๊ะฟ้าใส คาบหน้าครูเตรียมวิดีโอ 3D Explosion ของมอเตอร์ PMSM มาให้ดูแน่นอนจ้ะ!',
    teacherRepliedAt: '2026-09-01 17:00'
  },
  {
    id: 'eval-demo-2',
    studentId: 'std-03',
    studentName: 'เด็กชายธนภัทร กล้าหาญ',
    studentClass: 'ม.3/1',
    studentNo: '08',
    studentAvatar: 'student-boy-cap',
    ratingStars: 4,
    improvementText: 'อยากให้เพิ่มเวลาช่วงทดลองรอกและคานในห้องปฏิบัติการอีกนิดครับ สนุกมากแต่ทำไม่ทัน',
    recommendationText: 'เกมตอบคำถามท้ายคาบสนุกมาก ได้แข่งเก็บดาวกับเพื่อนๆ ในห้อง ชอบกิจกรรมแบบนี้ครับครู',
    submittedAt: '2026-09-02 08:45',
    isAnonymous: false
  },
  {
    id: 'eval-demo-3',
    studentId: 'std-01',
    studentName: 'เด็กชายสมชาย สายวิทย์',
    studentClass: 'ม.3/1',
    studentNo: '12',
    studentAvatar: 'student-boy-glasses',
    ratingStars: 5,
    improvementText: 'ไม่มีครับ ทุกอย่างลงตัวดีมาก ขอให้คงเกมและควิซเก็บดาวแบบนี้ไว้ตลอดเทอมครับ',
    recommendationText: 'ครูอธิบายสูตรโมเมนต์และการคิดแรงเสียดทานเข้าใจง่ายมากครับ จากเดิมที่งงตอนนี้ทำข้อสอบได้คล่องแล้ว!',
    submittedAt: '2026-09-02 10:30',
    isAnonymous: false
  },
  {
    id: 'eval-demo-4',
    studentId: 'std-04',
    studentName: 'เด็กหญิงพิมพ์ชนก ดวงแก้ว',
    studentClass: 'ม.3/2',
    studentNo: '15',
    studentAvatar: 'student-kid-artist',
    ratingStars: 5,
    improvementText: 'อยากให้แจกสรุปสูตรฟิสิกส์แผ่นพับหรือไฟล์ PDF สรุปตอนท้ายบทเรียนค่ะ',
    recommendationText: 'ชอบสไตล์การสอนของคุณครูมากๆ ค่ะ เป็นกันเองและใจดี อธิบายจนทุกคนในกลุ่มเข้าใจ',
    submittedAt: '2026-09-02 11:15',
    isAnonymous: false
  }
];

export const sampleStudentExamScores = [
  {
    id: 'exam-01',
    studentId: 'std-01',
    studentName: 'เด็กชายสมชาย สายวิทย์',
    studentClass: 'ม.3/1',
    studentNo: '12',
    studentAvatar: 'student-boy-glasses',
    lessonId: 'ev-technology',
    lessonTitle: 'วิทยาศาสตร์และเทคโนโลยีรถยนต์ไฟฟ้า (EV)',
    score: 10,
    maxScore: 10,
    submittedAt: '2026-09-01 15:45'
  },
  {
    id: 'exam-02',
    studentId: 'std-01',
    studentName: 'เด็กชายสมชาย สายวิทย์',
    studentClass: 'ม.3/1',
    studentNo: '12',
    studentAvatar: 'student-boy-glasses',
    lessonId: 'mechanics-physics',
    lessonTitle: 'ฟิสิกส์พื้นฐานและกลศาสตร์รอบตัว',
    score: 9,
    maxScore: 10,
    submittedAt: '2026-09-02 09:30'
  },
  {
    id: 'exam-03',
    studentId: 'std-02',
    studentName: 'เด็กหญิงฟ้าใส ใฝ่เรียนรู้',
    studentClass: 'ม.3/1',
    studentNo: '05',
    studentAvatar: 'student-girl-ponytail',
    lessonId: 'ev-technology',
    lessonTitle: 'วิทยาศาสตร์และเทคโนโลยีรถยนต์ไฟฟ้า (EV)',
    score: 10,
    maxScore: 10,
    submittedAt: '2026-09-01 16:10'
  },
  {
    id: 'exam-04',
    studentId: 'std-02',
    studentName: 'เด็กหญิงฟ้าใส ใฝ่เรียนรู้',
    studentClass: 'ม.3/1',
    studentNo: '05',
    studentAvatar: 'student-girl-ponytail',
    lessonId: 'mechanics-physics',
    lessonTitle: 'ฟิสิกส์พื้นฐานและกลศาสตร์รอบตัว',
    score: 8,
    maxScore: 10,
    submittedAt: '2026-09-02 10:00'
  },
  {
    id: 'exam-05',
    studentId: 'std-03',
    studentName: 'เด็กชายธนภัทร กล้าหาญ',
    studentClass: 'ม.3/1',
    studentNo: '08',
    studentAvatar: 'student-boy-cap',
    lessonId: 'ev-technology',
    lessonTitle: 'วิทยาศาสตร์และเทคโนโลยีรถยนต์ไฟฟ้า (EV)',
    score: 8,
    maxScore: 10,
    submittedAt: '2026-09-01 17:20'
  },
  {
    id: 'exam-06',
    studentId: 'std-04',
    studentName: 'เด็กหญิงพิมพ์ชนก ดวงแก้ว',
    studentClass: 'ม.3/2',
    studentNo: '15',
    studentAvatar: 'student-kid-artist',
    lessonId: 'ev-technology',
    lessonTitle: 'วิทยาศาสตร์และเทคโนโลยีรถยนต์ไฟฟ้า (EV)',
    score: 9,
    maxScore: 10,
    submittedAt: '2026-09-02 11:00'
  },
  {
    id: 'exam-07',
    studentId: 'std-05',
    studentName: 'เด็กชายภูริช พัฒนศิลป์',
    studentClass: 'ม.3/1',
    studentNo: '18',
    studentAvatar: 'student-dino-doodle',
    lessonId: 'mechanics-physics',
    lessonTitle: 'ฟิสิกส์พื้นฐานและกลศาสตร์รอบตัว',
    score: 7,
    maxScore: 10,
    submittedAt: '2026-09-02 11:45'
  }
];

export const sampleStudentRecords = [
  {
    id: 'std-01',
    name: 'เด็กชายสมชาย สายวิทย์',
    studentIdCode: 'STD-30112',
    classRoom: 'ม.3/1',
    studentNo: '12',
    avatar: 'student-boy-glasses',
    totalStars: 190,
    unlockedStickers: ['first-step', 'ev-master', 'mechanics-guru'],
    awardedBadges: [
      {
        id: 'ab-1',
        stickerId: 'first-step',
        stickerName: 'First Step',
        thaiTitle: 'ผู้เริ่มต้นไฟแรง',
        icon: '🌟',
        awardedBy: 'คุณครูนิภาภรณ์',
        awardedAt: '2026-09-01',
        starsAdded: 50,
        note: 'ส่งการบ้านคนแรกของห้องและทำสรุปได้ละเอียดมาก!'
      }
    ],
    homeworkCount: 2,
    quizScores: {
      'ev-technology': 10,
      'mechanics-physics': 9
    }
  },
  {
    id: 'std-02',
    name: 'เด็กหญิงฟ้าใส ใฝ่เรียนรู้',
    studentIdCode: 'STD-30105',
    classRoom: 'ม.3/1',
    studentNo: '05',
    avatar: 'student-girl-ponytail',
    totalStars: 170,
    unlockedStickers: ['first-step', 'ev-master', 'super-critic'],
    awardedBadges: [
      {
        id: 'ab-2',
        stickerId: 'super-critic',
        stickerName: 'Super Critic',
        thaiTitle: 'นักประเมินยอดเยี่ยม',
        icon: '💖',
        awardedBy: 'คุณครูนิภาภรณ์',
        awardedAt: '2026-09-01',
        starsAdded: 30,
        note: 'ให้ข้อเสนอแนะการสอนที่เป็นประโยชน์และสร้างสรรค์มาก'
      }
    ],
    homeworkCount: 1,
    quizScores: {
      'ev-technology': 10,
      'mechanics-physics': 8
    }
  },
  {
    id: 'std-03',
    name: 'เด็กชายธนภัทร กล้าหาญ',
    studentIdCode: 'STD-30108',
    classRoom: 'ม.3/1',
    studentNo: '08',
    avatar: 'student-boy-cap',
    totalStars: 120,
    unlockedStickers: ['first-step', 'ev-master'],
    awardedBadges: [],
    homeworkCount: 1,
    quizScores: {
      'ev-technology': 8
    }
  },
  {
    id: 'std-04',
    name: 'เด็กหญิงพิมพ์ชนก ดวงแก้ว',
    studentIdCode: 'STD-30215',
    classRoom: 'ม.3/2',
    studentNo: '15',
    avatar: 'student-kid-artist',
    totalStars: 140,
    unlockedStickers: ['first-step', 'ev-master'],
    awardedBadges: [],
    homeworkCount: 1,
    quizScores: {
      'ev-technology': 9
    }
  },
  {
    id: 'std-05',
    name: 'เด็กชายภูริช พัฒนศิลป์',
    studentIdCode: 'STD-30118',
    classRoom: 'ม.3/1',
    studentNo: '18',
    avatar: 'student-dino-doodle',
    totalStars: 90,
    unlockedStickers: ['first-step'],
    awardedBadges: [],
    homeworkCount: 0,
    quizScores: {
      'mechanics-physics': 7
    }
  }
];

