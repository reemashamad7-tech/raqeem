import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, { ar: string; en: string }> = {
  // App General
  appName: { ar: 'رقيم', en: 'Raqeem' },
  appTagline: { ar: 'المنصة الأكاديمية الذكية لطلبة كلية علوم الحاسب والمعلومات - جامعة المجمعة', en: 'Smart Academic Platform for CCIS Students - Majmaah University' },
  universityName: { ar: 'جامعة المجمعة', en: 'Majmaah University' },
  collegeName: { ar: 'كلية علوم الحاسب والمعلومات', en: 'College of Computer and Information Sciences' },
  allRightsReserved: { ar: 'جميع الحقوق محفوظة لمنصة رقيم © جامعة المجمعة 1448هـ / 2026م', en: 'All rights reserved to Raqeem Platform © Majmaah University 2026' },

  // Navigation
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navFiles: { ar: 'المستودع الأكاديمي', en: 'Academic Files' },
  navReader: { ar: 'قارئ المستندات', en: 'Doc Reader' },
  navAI: { ar: 'مساعد رقيم الذكي', en: 'AI Assistant' },
  navServices: { ar: 'الخدمات الأكاديمية', en: 'Academic Services' },
  navProfile: { ar: 'ملفي الأكاديمي', en: 'My Profile' },
  navLogin: { ar: 'تسجيل الدخول', en: 'Sign In' },
  navLogout: { ar: 'تسجيل الخروج', en: 'Log Out' },

  // Dashboard / Home
  welcomeBack: { ar: 'مرحباً بك يا', en: 'Welcome back,' },
  studentIdBadge: { ar: 'الرقم الجامعي:', en: 'Student ID:' },
  quickStats: { ar: 'المؤشرات الأكاديمية السريعة', en: 'Quick Academic Indicators' },
  cumulativeGPA: { ar: 'المعدل التراكمي', en: 'Cumulative GPA' },
  standing: { ar: 'التقدير الأكاديمي', en: 'Academic Standing' },
  registeredHours: { ar: 'الساعات المنجزة', en: 'Completed Hours' },
  attendanceRisk: { ar: 'حالة الحضور والإنذارات', en: 'Attendance & Alerts' },
  activeAlerts: { ar: 'إنذار اقتراب حرمان واحد', en: '1 Absence Alert' },
  quickAccess: { ar: 'الوصول السريع', en: 'Quick Access' },
  gpaCalcDesc: { ar: 'احسب معدلك الفصلي والتراكمي بدقة وفق لائحة جامعة المجمعة', en: 'Calculate semester & cumulative GPA on MU 5.0 scale' },
  attendanceDesc: { ar: 'تتبع نسب غيابك وتفادَ نسبة الحرمان 25% (DN)', en: 'Track absence rates and avoid the 25% DN threshold' },
  aiBotDesc: { ar: 'إجابات فورية وتوليد كويزات ذكية من مراجع مقررات الكلية', en: 'Instant answers & practice quiz generation from CCIS materials' },
  converterDesc: { ar: 'تحويل المذكرات والملاحظات إلى PDF رسمي مع التخزين', en: 'Convert notes into official PDF with local storage' },
  upcomingDeadlines: { ar: 'المواعيد والمهام القادمة', en: 'Upcoming Deadlines & Tasks' },
  viewAll: { ar: 'عرض الكل', en: 'View All' },
  priorityHigh: { ar: 'هام وعاجل', en: 'High Priority' },
  priorityMedium: { ar: 'متوسط', en: 'Medium' },
  priorityLow: { ar: 'عادي', en: 'Low' },

  // Files Module
  academicRepository: { ar: 'المستودع والمكتبة الأكاديمية', en: 'Academic Repository & Library' },
  repositorySubtitle: { ar: 'تصنيف شامل بحسب التخصص والمقررات والساعات المعتمدة', en: 'Categorized by major, courses, and credit hours' },
  filterByMajor: { ar: 'تصفية حسب التخصص', en: 'Filter by Major' },
  allMajors: { ar: 'جميع التخصصات', en: 'All Majors' },
  allCategories: { ar: 'جميع التصنيفات', en: 'All Folders' },
  categoryLectures: { ar: 'المحاضرات والسلايدات', en: 'Lectures & Slides' },
  categoryLabs: { ar: 'المعامل والتمارين', en: 'Labs & Practical' },
  categoryExams: { ar: 'الاختبارات السابقة والحلول', en: 'Past Exams & Solutions' },
  categorySummaries: { ar: 'الملخصات والكبسولات', en: 'Summaries & Cheatsheets' },
  categoryAssignments: { ar: 'الواجبات والمشاريع', en: 'Assignments & Projects' },
  uploadNewFile: { ar: 'رفع ملف جديد', en: 'Upload New File' },
  convertToPdf: { ar: 'تحويل إلى PDF', en: 'Convert to PDF' },
  searchFilesPlaceholder: { ar: 'ابحث عن اسم ملف، رمز مقرر (CS 211)، أو موضوع...', en: 'Search file name, course code (CS 211), or topic...' },
  offlineOnly: { ar: 'الملفات المحفوظة أوفلاين فقط', en: 'Offline Cached Only' },
  download: { ar: 'تحميل', en: 'Download' },
  openInReader: { ar: 'فتح في القارئ التفاعلي', en: 'Open in Interactive Reader' },
  share: { ar: 'مشاركة', en: 'Share' },
  delete: { ar: 'حذف', en: 'Delete' },
  offlineCached: { ar: 'محفوظ للمطالعة بدون إنترنت', en: 'Cached for Offline' },
  saveOffline: { ar: 'حفظ أوفلاين', en: 'Save Offline' },
  removeOffline: { ar: 'إلغاء الحفظ أوفلاين', en: 'Remove Offline' },
  uploadedBy: { ar: 'بواسطة:', en: 'By:' },
  downloadsCount: { ar: 'مرات التحميل:', en: 'Downloads:' },
  creditHoursLabel: { ar: 'ساعات معتمدة', en: 'Credit Hours' },

  // Upload Modal
  modalUploadTitle: { ar: 'رفع مستند أكاديمي للمستودع', en: 'Upload Academic Document' },
  fileTitleLabel: { ar: 'عنوان الملف أو المحاضرة', en: 'Document / Lecture Title' },
  selectCourse: { ar: 'المقرر الدراسي', en: 'Course' },
  selectCategory: { ar: 'تصنيف المجلد', en: 'Folder Category' },
  selectSharing: { ar: 'مستوى المشاركة والصلاحيات', en: 'Sharing Level & Permissions' },
  sharePublic: { ar: 'عام - متاح لجميع طلبة الكلية', en: 'Public - All CCIS Students' },
  shareClassmates: { ar: 'خاص بدفعة المقرر فقط', en: 'Course Classmates Only' },
  sharePrivate: { ar: 'خاص بي (أرشيفي الشخصي)', en: 'Private to Me' },
  allowDownloadCheck: { ar: 'السماح للزملاء بتحميل النسخة', en: 'Allow other students to download' },
  allowCommentsCheck: { ar: 'السماح بالتعليقات والملاحظات التفاعلية', en: 'Allow comments & notes' },
  submitUpload: { ar: 'رفع وحفظ المستند', en: 'Upload & Save' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },

  // Convert to PDF Tool
  converterTitle: { ar: 'أداة تحويل وتوليد مستندات PDF الأكاديمية', en: 'Academic PDF Converter & Generator' },
  converterSubtitle: { ar: 'تحويل الملاحظات والملخصات إلى مستند PDF مع ترويسة جامعة المجمعة الرسمية', en: 'Convert notes to PDF formatted with official Majmaah University headers' },
  docTitlePrompt: { ar: 'عنوان المستند أو الملخص', en: 'Document / Summary Title' },
  docAuthorPrompt: { ar: 'اسم الطالب أو المعد', en: 'Author / Student Name' },
  docContentPrompt: { ar: 'نص الملاحظات أو الكود أو المحتوى الأكاديمي', en: 'Notes, Code, or Academic Content' },
  generateAndSavePdf: { ar: 'توليد وحفظ ملف PDF', en: 'Generate & Save PDF' },

  // Document Reader & Annotation
  readerTitle: { ar: 'قارئ المستندات والشروحات التفاعلية', en: 'Interactive Reader & Annotations' },
  instantTranslation: { ar: 'الترجمة الفورية للسلايد', en: 'Instant Slide Translation' },
  translateToAr: { ar: 'ترجمة إلى العربية', en: 'Translate to Arabic' },
  translateToEn: { ar: 'ترجمة إلى الإنجليزية', en: 'Translate to English' },
  highlightTool: { ar: 'تظليل النصوص', en: 'Highlight Text' },
  notesTool: { ar: 'ملاحظة كتابية', en: 'Typed Note' },
  drawTool: { ar: 'رسم حر باليد', en: 'Handwritten Canvas' },
  bookmarkTool: { ar: 'إشارة مرجعية', en: 'Bookmark' },
  clearCanvas: { ar: 'مسح الرسم', en: 'Clear Canvas' },
  exportAnnotated: { ar: 'تصدير المستند بملاحظاتي', en: 'Export with Annotations' },
  page: { ar: 'صفحة', en: 'Page' },
  of: { ar: 'من', en: 'of' },
  nextPage: { ar: 'الصفحة التالية', en: 'Next Page' },
  prevPage: { ar: 'الصفحة السابقة', en: 'Previous Page' },
  addNotePlaceholder: { ar: 'أضف ملاحظتك الدراسية حول هذه الشريحة...', en: 'Add your study note for this slide...' },
  saveNote: { ar: 'حفظ الملاحظة', en: 'Save Note' },
  myNotesForPage: { ar: 'ملاحظاتي على هذه الصفحة:', en: 'My notes on this page:' },

  // AI Assistant
  aiAssistantTitle: { ar: 'مساعد رقيم الأكاديمي الذكي', en: 'Raqeem Smart AI Assistant' },
  aiAssistantSubtitle: { ar: 'مُدرَّب خصيصاً على لوائح جامعة المجمعة والمقررات الدراسية لكلية الحاسب', en: 'Grounded on Majmaah University regulations & CCIS course curricula' },
  aiDisclaimer: { ar: 'معتمد على اللائحة التنظيمية المحدثة للجامعة وسياسات الحذف والإضافة والإنذارات ونظام الساعات.', en: 'Verified against MU bylaws, add/drop policies, academic warnings, and degree plans.' },
  askQuestionPlaceholder: { ar: 'اسأل عن لائحة الغياب DN، شروط مرتبة الشرف، تفاصيل مقرر، أو اطلب كويزاً...', en: 'Ask about DN absence rule, honors criteria, course concepts, or request a quiz...' },
  sendQuestion: { ar: 'إرسال', en: 'Send' },
  quickPromptsTitle: { ar: 'أسئلة شائعة استرشادية:', en: 'Quick Common Questions:' },
  promptHonors: { ar: 'ما شروط الحصول على مرتبة الشرف الأولى في جامعة المجمعة؟', en: 'What are First Class Honors requirements at Majmaah University?' },
  promptDN: { ar: 'متى يحرم الطالب من دخول الاختبار النهائي بنسبة الغياب (DN)؟', en: 'When does a student get denied (DN) for absences?' },
  promptDrop: { ar: 'ما هي مواعيد وطريقة الاعتذار عن مقرر دراسي دون التأثير على المعدل؟', en: 'What are the deadlines and rules for course withdrawal?' },
  promptQuizGen: { ar: 'أنشئ لي كويزاً تدريبياً سريعاً في تراكيب البيانات (CS 211)!', en: 'Generate a quick practice quiz for Data Structures (CS 211)!' },
  sourcesReferenced: { ar: 'المصادر واللوائح المعتمدة المستند إليها:', en: 'Referenced University Regulations & Sources:' },

  // AI Quiz Module
  quizGeneratorTitle: { ar: 'مولد الاختبارات التجريبية الذكية', en: 'AI Practice Quiz Generator' },
  selectCourseQuiz: { ar: 'اختر المقرر لتوليد أسئلة منه:', en: 'Select course to generate quiz for:' },
  startQuiz: { ar: 'بدء الاختبار التجريبي', en: 'Start Practice Quiz' },
  questionCounter: { ar: 'السؤال', en: 'Question' },
  submitAnswer: { ar: 'تأكيد الإجابة', en: 'Confirm Answer' },
  nextQuestion: { ar: 'السؤال التالي', en: 'Next Question' },
  quizScore: { ar: 'النتيجة النهائية', en: 'Final Score' },
  congratulations: { ar: 'أحسنت! إنجاز أكاديمي رائع', en: 'Well done! Outstanding performance' },
  reviewAnswers: { ar: 'مراجعة الإجابات والشرح النموذجي', en: 'Review Explanations' },
  retakeQuiz: { ar: 'إعادة الاختبار', en: 'Retake Quiz' },
  correctAnswer: { ar: 'إجابة صحيحة!', en: 'Correct!' },
  incorrectAnswer: { ar: 'إجابة غير صحيحة', en: 'Incorrect' },

  // Academic Services (GPA & Attendance & Calendar & Tasks)
  servicesTitle: { ar: 'الخدمات الأكاديمية والإنتاجية', en: 'Academic & Productivity Services' },
  tabGPA: { ar: 'حاسبة المعدل التراكمي (5.00)', en: 'GPA Calculator (5.0)' },
  tabAttendance: { ar: 'تتبع الحضور والغياب (DN)', en: 'Attendance & DN Tracker' },
  tabCalendar: { ar: 'التقويم والجدول الدراسي', en: 'Academic Calendar' },
  tabTasks: { ar: 'إدارة المهام والجدولة', en: 'Task & Study Planner' },

  // GPA Calculator
  currentCumulativeGpa: { ar: 'المعدل التراكمي الحالي (من 5.00)', en: 'Current Cumulative GPA (out of 5.00)' },
  currentCompletedHours: { ar: 'الساعات السابقة المجتازة', en: 'Previously Completed Credit Hours' },
  semesterCoursesList: { ar: 'مقررات الفصل الحالي والدرجات المتوقعة', en: 'Current Semester Courses & Expected Grades' },
  addCourseRow: { ar: '+ إضافة مقرر جديد', en: '+ Add Course' },
  courseNameLabel: { ar: 'اسم المقرر', en: 'Course Name' },
  creditsLabel: { ar: 'الساعات', en: 'Hours' },
  gradeLabel: { ar: 'التقدير', en: 'Grade' },
  calcResults: { ar: 'النتائج التقديرية لمعدلك', en: 'Calculated GPA Projections' },
  semesterGPA: { ar: 'المعدل الفصلي المتوقع:', en: 'Projected Semester GPA:' },
  newCumulativeGPA: { ar: 'المعدل التراكمي الجديد:', en: 'New Cumulative GPA:' },
  honorsEligible: { ar: 'مؤهل لمرتبة الشرف الأولى (≥ 4.75)', en: 'Eligible for First Class Honors (≥ 4.75)' },
  honorsEligible2: { ar: 'مؤهل لمرتبة الشرف الثانية (≥ 4.25)', en: 'Eligible for Second Class Honors (≥ 4.25)' },
  targetWhatIf: { ar: 'أداة ماذا لو؟ (What-If Analysis)', en: 'Target What-If Analysis' },

  // Attendance Tracker
  courseAttendance: { ar: 'متابعة سجل الغياب لكل مقرر', en: 'Course Absence Records' },
  warningThresholdText: { ar: 'لائحة جامعة المجمعة: الحرمان (DN) يبدأ فور تجاوز 25% من مجموع ساعات المقرر (عادة 8 ساعات لمقرر الـ 30 محاضرة).', en: 'Majmaah University Rule: Denial (DN) triggers when absences exceed 25% of course hours (usually 8 absences for 30 sessions).' },
  lecturesAttended: { ar: 'محاضرات الحضور:', en: 'Attended:' },
  lecturesMissed: { ar: 'محاضرات الغياب:', en: 'Missed:' },
  remainingBeforeDN: { ar: 'المتبقي حتى الحرمان:', en: 'Remaining before DN:' },
  statusSafe: { ar: 'حالة آمنة وممتازة', en: 'Safe Standing' },
  statusWarning: { ar: 'تنبيه: اقتراب من نسبة الخطر', en: 'Warning: Approaching Risk' },
  statusCritical: { ar: 'خطر شديد: غياب واحد يفصلك عن الحرمان!', en: 'Critical: 1 Absence Away from DN!' },

  // Calendar & Schedule
  weeklySchedule: { ar: 'الجدول الأسبوعي للمحاضرات', en: 'Weekly Class Schedule' },
  calendarEventsTitle: { ar: 'التقويم الأكاديمي والامتحانات', en: 'Academic & Exam Calendar' },
  hallLocation: { ar: 'الموقع:', en: 'Location:' },

  // Tasks & Planner
  studyPlannerTitle: { ar: 'منظم المذاكرة وقائمة المهام', en: 'Study Planner & Kanban Tasks' },
  statusTodo: { ar: 'قيد الانتظار', en: 'To Do' },
  statusInProgress: { ar: 'جاري الإنجاز', en: 'In Progress' },
  statusCompleted: { ar: 'مكتملة', en: 'Completed' },
  addNewTask: { ar: 'إضافة مهمة جديدة', en: 'Add New Task' },

  // Profile View
  profileTitle: { ar: 'البطاقة الأكاديمية للطالب', en: 'Student Academic ID Card' },
  academicYear: { ar: 'العام الدراسي 1448هـ / 2026-2027م', en: 'Academic Year 2026-2027' },
  advisorLabel: { ar: 'المرشد الأكاديمي:', en: 'Academic Advisor:' },
  barcodeAccess: { ar: 'رمز الدخول للبوابات الذكية والمكتبة المركزية', en: 'Smart Gate & Central Library Access Code' },
  accountSettings: { ar: 'إعدادات الحساب والإشعارات', en: 'Account & Notification Settings' },
  offlineSyncEnabled: { ar: 'المزامنة والتخزين الأوفلاين مفعل', en: 'Offline Sync & Cache Enabled' },

  // Auth Modal
  studentLoginTitle: { ar: 'تسجيل دخول طلبة جامعة المجمعة', en: 'Majmaah University Student Sign In' },
  studentLoginSubtitle: { ar: 'الدخول مقتصر على طلبة كلية علوم الحاسب والمعلومات المسجلين', en: 'Access restricted to enrolled CCIS students' },
  emailPlaceholder: { ar: 'البريد الجامعي (مثال: 421105824@s.mu.edu.sa)', en: 'University Email (e.g. 421105824@s.mu.edu.sa)' },
  passwordPlaceholder: { ar: 'كلمة المرور الأكاديمية', en: 'Academic Password' },
  demoStudentBtn: { ar: 'الدخول بحساب تجريبي (طالبة متفوقة - ريماس أبوحيمد)', en: 'Fast Demo Sign In (Top Student - Remas Abuhimed)' },
  signInBtn: { ar: 'تسجيل الدخول', en: 'Sign In' },
  authErrorDomain: { ar: 'عذراً، يجب تسجيل الدخول بالبريد الجامعي الرسمي (@s.mu.edu.sa أو @mu.edu.sa)', en: 'Must sign in with official student email (@s.mu.edu.sa or @mu.edu.sa)' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('raqeem_lang') as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('raqeem_lang', lang);
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

