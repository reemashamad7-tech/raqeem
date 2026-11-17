import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Course, TaskItem, CalendarEvent } from '../types';
import { registeredCourses, upcomingTasks, academicCalendarEvents, officialMajmaahRules } from '../data/majmaahData';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  TrendingUp, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Award, 
  CheckCircle2, 
  CalendarDays, 
  MapPin, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface SemesterCourseInput {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const muGradePoints: Record<string, number> = {
  'A+': 5.00,
  'A': 4.75,
  'B+': 4.50,
  'B': 4.00,
  'C+': 3.50,
  'C': 3.00,
  'D+': 2.50,
  'D': 2.00,
  'F': 1.00,
};

export const ServicesView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const { student, updateProfile } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'gpa' | 'attendance' | 'calendar' | 'tasks'>('gpa');

  // ----------------------------------------------------
  // MODULE 1: GPA Calculator State
  // ----------------------------------------------------
  const [prevGpa, setPrevGpa] = useState<number>(student?.gpa || 4.82);
  const [prevHours, setPrevHours] = useState<number>(student?.creditHoursCompleted || 112);
  const [calcCourses, setCalcCourses] = useState<SemesterCourseInput[]>([
    { id: '1', name: 'CS 211 - Data Structures', credits: 4, grade: 'A+' },
    { id: '2', name: 'IS 311 - Advanced Databases', credits: 3, grade: 'A' },
    { id: '3', name: 'SWE 312 - Software Engineering', credits: 3, grade: 'A+' },
    { id: '4', name: 'CS 380 - Artificial Intelligence', credits: 3, grade: 'B+' },
    { id: '5', name: 'IT 241 - Web Development', credits: 3, grade: 'A+' },
  ]);

  const addCalcCourse = () => {
    setCalcCourses([
      ...calcCourses,
      { id: `c_${Date.now()}`, name: `Course ${calcCourses.length + 1}`, credits: 3, grade: 'A' }
    ]);
  };

  const removeCalcCourse = (id: string) => {
    setCalcCourses(calcCourses.filter((c) => c.id !== id));
  };

  // GPA calculation logic
  const currentSemesterHours = calcCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const currentSemesterPoints = calcCourses.reduce(
    (sum, c) => sum + (c.credits || 0) * (muGradePoints[c.grade] || 0),
    0
  );
  const semesterGpa = currentSemesterHours > 0 ? currentSemesterPoints / currentSemesterHours : 0;

  const totalAllHours = prevHours + currentSemesterHours;
  const totalAllPoints = prevHours * prevGpa + currentSemesterPoints;
  const newCumulativeGpa = totalAllHours > 0 ? totalAllPoints / totalAllHours : 0;

  // ----------------------------------------------------
  // MODULE 2: Attendance Tracking State
  // ----------------------------------------------------
  const [coursesAttendance, setCoursesAttendance] = useState<Course[]>(() => {
    const saved = localStorage.getItem('raqeem_attendance');
    return saved ? JSON.parse(saved) : registeredCourses;
  });

  const updateCourseAbsence = (courseId: string, delta: number) => {
    const updated = coursesAttendance.map((c) => {
      if (c.id === courseId) {
        const newMissed = Math.max(0, Math.min(c.totalLectures, c.missedLectures + delta));
        const newAttended = Math.max(0, c.totalLectures - newMissed);
        return { ...c, missedLectures: newMissed, attendedLectures: newAttended };
      }
      return c;
    });
    setCoursesAttendance(updated);
    localStorage.setItem('raqeem_attendance', JSON.stringify(updated));
  };

  // ----------------------------------------------------
  // MODULE 3: Study Tasks & Kanban State
  // ----------------------------------------------------
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('raqeem_tasks');
    return saved ? JSON.parse(saved) : upcomingTasks;
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('CS 211');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-25');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('high');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      titleAr: newTaskTitle,
      titleEn: newTaskTitle,
      courseCode: newTaskCourse,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      status: 'todo',
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('raqeem_tasks', JSON.stringify(updated));
    setNewTaskTitle('');
  };

  const updateTaskStatus = (taskId: string, status: 'todo' | 'in_progress' | 'completed') => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    setTasks(updated);
    localStorage.setItem('raqeem_tasks', JSON.stringify(updated));
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    localStorage.setItem('raqeem_tasks', JSON.stringify(updated));
  };

  // ----------------------------------------------------
  // MODULE 4: Focus Pomodoro Study Timer
  // ----------------------------------------------------
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-academic">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-mu-forest/10 text-mu-forest">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('servicesTitle')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {language === 'ar'
              ? 'مجموعة الأدوات الذكية لطلاب كلية علوم الحاسب بجامعة المجمعة'
              : 'Smart academic productivity tools for Majmaah University CCIS students'}
          </p>
        </div>

        {/* Focus Study Pill */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-end">
            <span className="text-[10px] text-slate-400 font-bold block">{language === 'ar' ? 'مؤقت المذاكرة المركز' : 'Focus Timer'}</span>
            <span className="text-sm font-mono font-black text-mu-forest">{formatTimer(timerSeconds)}</span>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white transition shadow-xs"
            title={isTimerRunning ? 'Pause' : 'Start Focus Session'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-mu-gold" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(25 * 60);
            }}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200">
        {[
          { id: 'gpa', label: t('tabGPA'), icon: Calculator },
          { id: 'attendance', label: t('tabAttendance'), icon: AlertTriangle },
          { id: 'calendar', label: t('tabCalendar'), icon: CalendarDays },
          { id: 'tasks', label: t('tabTasks'), icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-white text-mu-forest shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-mu-gold' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* SUB-TAB 1: GPA CALCULATOR (Official MU 5.0 Scale)    */}
      {/* ==================================================== */}
      {activeSubTab === 'gpa' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Quick Explanation Banner */}
          <div className="p-4 rounded-2xl bg-mu-forest/5 border border-mu-forest/20 text-xs text-mu-forest flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-mu-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">
                {language === 'ar' ? 'نظام احتساب المعدل المعتمد بجامعة المجمعة:' : 'Official Majmaah University 5.0 GPA Rules:'}
              </span>
              <span>
                {language === 'ar'
                  ? 'أ+ (5.00)، أ (4.75)، ب+ (4.50)، ب (4.00)، ج+ (3.50)، ج (3.00)، د+ (2.50)، د (2.00)، هـ (1.00). تمنح مرتبة الشرف الأولى للمعدل 4.75 فأعلى.'
                  : 'A+ (5.0), A (4.75), B+ (4.5), B (4.0), C+ (3.5), C (3.0), D+ (2.5), D (2.0), F (1.0). First class honors awarded for 4.75+.'}
              </span>
            </div>
          </div>

          {/* Results Display Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-academic">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {t('semesterGPA')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-mu-forest font-mono">
                  {semesterGpa.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 5.00</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {currentSemesterHours} {language === 'ar' ? 'ساعات مسجلة' : 'Registered Hours'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-mu-gold/40 shadow-academic relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-mu-gold/15 rounded-full blur-xl pointer-events-none" />
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {t('newCumulativeGPA')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-mu-gold-dark font-mono">
                  {newCumulativeGpa.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 5.00</span>
              </div>
              <p className="text-[11px] text-mu-emerald font-bold mt-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-mu-gold" />
                <span>
                  {newCumulativeGpa >= 4.75
                    ? t('honorsEligible')
                    : newCumulativeGpa >= 4.25
                    ? t('honorsEligible2')
                    : language === 'ar' ? 'أداء أكاديمي جيد جداً' : 'Very Good Standing'}
                </span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-academic flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  {language === 'ar' ? 'إجمالي الساعات التراكمية' : 'Total Cumulative Hours'}
                </span>
                <div className="text-2xl font-black text-slate-800 font-mono">
                  {totalAllHours} / 134
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
                <div 
                  className="bg-mu-forest h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (totalAllHours / 134) * 100)}%` }} 
                />
              </div>
            </div>

          </div>

          {/* Current Inputs & Table */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-academic space-y-4">
            
            {/* Previous Baseline Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('currentCumulativeGpa')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="5"
                  value={prevGpa}
                  onChange={(e) => setPrevGpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-mu-forest/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('currentCompletedHours')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="140"
                  value={prevHours}
                  onChange={(e) => setPrevHours(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-mu-forest/30 outline-none"
                />
              </div>
            </div>

            {/* Courses Rows Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                {t('semesterCoursesList')}
              </h4>
              <button
                onClick={addCalcCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-mu-gold" />
                <span>{t('addCourseRow')}</span>
              </button>
            </div>

            {/* Courses Rows Table */}
            <div className="space-y-2.5">
              {calcCourses.map((c, index) => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-surface-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3 transition hover:border-slate-300"
                >
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const updated = [...calcCourses];
                        updated[index].name = e.target.value;
                        setCalcCourses(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-mu-forest"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Credits */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 font-medium">{t('creditsLabel')}:</span>
                      <select
                        value={c.credits}
                        onChange={(e) => {
                          const updated = [...calcCourses];
                          updated[index].credits = parseInt(e.target.value) || 0;
                          setCalcCourses(updated);
                        }}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((cr) => (
                          <option key={cr} value={cr}>{cr}</option>
                        ))}
                      </select>
                    </div>

                    {/* Grade Select */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 font-medium">{t('gradeLabel')}:</span>
                      <select
                        value={c.grade}
                        onChange={(e) => {
                          const updated = [...calcCourses];
                          updated[index].grade = e.target.value;
                          setCalcCourses(updated);
                        }}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold outline-none text-mu-forest"
                      >
                        {Object.entries(muGradePoints).map(([g, pts]) => (
                          <option key={g} value={g}>{g} ({pts.toFixed(2)})</option>
                        ))}
                      </select>
                    </div>

                    {/* Delete row */}
                    {calcCourses.length > 1 && (
                      <button
                        onClick={() => removeCalcCourse(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 2: ATTENDANCE & ABSENCE TRACKING (DN RISK)   */}
      {/* ==================================================== */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Important Regulatory Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-amber-900">
                {language === 'ar' ? 'تنبيه لائحة الحرمان الأكاديمي (DN) - المادة 15:' : 'Deprivation (DN) Regulatory Warning - Article 15:'}
              </span>
              <span>
                {t('warningThresholdText')}
              </span>
            </div>
          </div>

          {/* Courses Attendance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesAttendance.map((course) => {
              const maxAllowedAbsences = Math.floor(course.totalLectures * 0.25);
              const absencePercent = (course.missedLectures / course.totalLectures) * 100;
              const remaining = Math.max(0, maxAllowedAbsences - course.missedLectures);
              const isCritical = remaining <= 1;
              const isWarning = remaining === 2 || remaining === 3;

              return (
                <div
                  key={course.id}
                  className={`p-5 rounded-3xl bg-white border shadow-academic transition flex flex-col justify-between ${
                    isCritical 
                      ? 'border-red-300 bg-red-50/20 ring-1 ring-red-400' 
                      : isWarning 
                      ? 'border-amber-300 bg-amber-50/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-white" style={{ backgroundColor: course.color }}>
                        {course.code}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCritical ? 'bg-red-100 text-red-800' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCritical ? t('statusCritical') : isWarning ? t('statusWarning') : t('statusSafe')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {language === 'ar' ? course.nameAr : course.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {language === 'ar' ? course.instructorAr : course.instructorEn} • {course.lectureRoom}
                    </p>

                    {/* Gauge and Percentage */}
                    <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-600">
                          {language === 'ar' ? 'نسبة الغياب من حد الحرمان:' : 'Absence of 25% Limit:'}
                        </span>
                        <span className="font-mono font-black text-sm">
                          {absencePercent.toFixed(1)}% <span className="text-xs text-slate-400">/ 25.0%</span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            isCritical ? 'bg-red-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (absencePercent / 25) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2">
                        <span>{t('lecturesAttended')} {course.attendedLectures}</span>
                        <span>{t('lecturesMissed')} {course.missedLectures}</span>
                        <span className="font-bold text-slate-800">{t('remainingBeforeDN')} {remaining}</span>
                      </div>
                    </div>
                  </div>

                  {/* Increment / Decrement Absence Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      {language === 'ar' ? 'تسجيل حالة غياب:' : 'Log Absence:'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCourseAbsence(course.id, -1)}
                        className="px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs"
                      >
                        - 1
                      </button>
                      <button
                        onClick={() => updateCourseAbsence(course.id, 1)}
                        className="px-3 py-1 rounded-xl bg-mu-forest hover:bg-mu-emerald text-xs font-bold text-white shadow-xs"
                      >
                        + 1 غياب
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 3: CALENDAR & EXAM SCHEDULE                 */}
      {/* ==================================================== */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-academic space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mu-forest" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {t('calendarEventsTitle')}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-mu-gold/20 text-mu-gold-dark">
                1448H / 2026-2027
              </span>
            </div>

            <div className="space-y-3">
              {academicCalendarEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-surface-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-mu-forest/30 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl text-white font-bold shrink-0 ${
                      evt.type === 'exam' ? 'bg-red-600' : 'bg-mu-forest'
                    }`}>
                      <CalendarDays className="w-5 h-5 text-mu-gold-light" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {language === 'ar' ? evt.titleAr : evt.titleEn}
                      </h4>
                      {evt.location && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-start sm:text-end font-mono shrink-0">
                    <span className="text-xs font-bold text-mu-forest block">{evt.date}</span>
                    {evt.time && <span className="text-[11px] text-slate-400">{evt.time}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 4: STUDY PLANNER & KANBAN TASKS              */}
      {/* ==================================================== */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Add Task Box */}
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-academic flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="مثال: مذاكرة خوارزميات البحث التجريبي A* وحل أسئلة السلايدات"
              className="flex-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
            />
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={newTaskCourse}
                onChange={(e) => setNewTaskCourse(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none"
              >
                {registeredCourses.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-mu-gold" />
                <span>{t('addNewTask')}</span>
              </button>
            </div>
          </form>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* To Do Column */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">{t('statusTodo')}</span>
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">
                  {tasks.filter((t) => t.status === 'todo').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.filter((t) => t.status === 'todo').map((task) => (
                  <div key={task.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {task.courseCode}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {language === 'ar' ? task.titleAr : task.titleEn}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">{task.dueDate}</span>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="text-[10px] font-bold text-mu-forest hover:underline"
                      >
                        {language === 'ar' ? 'بدء التنفيذ ←' : 'Start →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <span className="text-xs font-bold text-amber-900">{t('statusInProgress')}</span>
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold flex items-center justify-center">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.filter((t) => t.status === 'in_progress').map((task) => (
                  <div key={task.id} className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {task.courseCode}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {language === 'ar' ? task.titleAr : task.titleEn}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">{task.dueDate}</span>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="text-[10px] font-bold text-emerald-700 hover:underline"
                      >
                        {language === 'ar' ? 'اكتملت ✓' : 'Done ✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-900">{t('statusCompleted')}</span>
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold flex items-center justify-center">
                  {tasks.filter((t) => t.status === 'completed').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.filter((t) => t.status === 'completed').map((task) => (
                  <div key={task.id} className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {task.courseCode}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-600 line-through leading-snug">
                      {language === 'ar' ? task.titleAr : task.titleEn}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{language === 'ar' ? 'تم الإنجاز' : 'Completed'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

