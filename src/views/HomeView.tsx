import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { registeredCourses, upcomingTasks, initialAcademicFiles } from '../data/majmaahData';
import { 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  FolderPlus, 
  Calculator, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenFileInReader?: (fileId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenFileInReader }) => {
  const { language, t } = useLanguage();
  const { student, isAuthenticated } = useAuth();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hero Welcome Banner with Academic Standing */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-mu-forest via-mu-deep to-surface-900 text-white p-6 sm:p-8 shadow-academic-lg border border-mu-gold/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59A3F_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-mu-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-mu-gold-light font-bold">
              <Sparkles className="w-3.5 h-3.5 text-mu-gold" />
              <span>{t('collegeName')} • {t('universityName')}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('welcomeBack')}{' '}
              <span className="text-mu-gold-light">
                {isAuthenticated && student 
                  ? (language === 'ar' ? student.nameAr : student.nameEn)
                  : (language === 'ar' ? 'طالبنا العزيز' : 'Dear Student')}
              </span>
            </h2>
            
            <p className="text-xs sm:text-sm text-surface-200 max-w-xl font-light">
              {language === 'ar'
                ? 'مرحباً بك في بوابتك الأكاديمية الذكية. لديك 5 مقررات مسجلة هذا الفصل، وموعد الاختبارات الفصلية يبدأ في 22 نوفمبر.'
                : 'Welcome to your smart academic portal. You have 5 enrolled courses this term, and midterms start on Nov 22.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3 py-1 rounded-xl bg-mu-gold/20 border border-mu-gold/40 text-mu-gold-light text-xs font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-mu-gold" />
                <span>{language === 'ar' ? student?.academicStandingAr : student?.academicStandingEn}</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 font-mono">
                {t('studentIdBadge')} {student?.studentId || '421105824'}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mu-gold hover:bg-mu-gold-light text-slate-950 text-xs font-bold shadow-md transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{language === 'ar' ? 'اسأل مساعد رقيم الذكي' : 'Ask AI Assistant'}</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
            >
              <FolderPlus className="w-4 h-4 text-mu-gold" />
              <span>{t('uploadNewFile')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Academic Indicators / KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GPA Tile */}
        <div 
          onClick={() => setActiveTab('services')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic hover:shadow-academic-lg hover:border-mu-forest/30 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('cumulativeGPA')}</span>
            <div className="w-8 h-8 rounded-xl bg-mu-forest/10 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-mu-forest" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student?.gpa.toFixed(2) || '4.82'}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.00</span>
          </div>
          <p className="text-[11px] text-mu-emerald font-bold mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مرتبة الشرف الأولى' : '1st Honors Track'}</span>
          </p>
        </div>

        {/* Credit Hours Completed */}
        <div 
          onClick={() => setActiveTab('services')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic hover:shadow-academic-lg hover:border-mu-forest/30 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{t('registeredHours')}</span>
            <div className="w-8 h-8 rounded-xl bg-mu-gold/15 flex items-center justify-center group-hover:scale-110 transition">
              <GraduationCap className="w-4 h-4 text-mu-gold-dark" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student?.creditHoursCompleted || 112}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 134 {language === 'ar' ? 'ساعة' : 'Hrs'}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-mu-forest h-1.5 rounded-full" style={{ width: '83.5%' }} />
          </div>
        </div>

        {/* Attendance Risk Alert */}
        <div 
          onClick={() => setActiveTab('services')}
          className="p-4 rounded-2xl bg-white border border-amber-200 bg-amber-50/30 shadow-academic hover:shadow-academic-lg transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900">{t('attendanceRisk')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
            {language === 'ar' ? 'تحذير 20%' : '20% Risk'}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1 leading-tight">
            {language === 'ar' ? 'مقرر CS 380 (غياب واحد عن الحرمان DN)' : 'CS 380 (1 missed from 25% DN)'}
          </p>
        </div>

        {/* Current Academic Standing & Level */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic hover:shadow-academic-lg hover:border-mu-forest/30 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">
              {language === 'ar' ? 'المستوى الأكاديمي' : 'Academic Level'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition">
              <UserCheck className="w-4 h-4 text-mu-navy" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ar' ? 'المستوى السابع' : 'Level 7 (Senior)'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {language === 'ar' ? 'علوم الحاسب (CCIS)' : 'Computer Science (CCIS)'}
          </p>
        </div>

      </div>

      {/* Registered Courses Grid with Attendance Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mu-forest" />
            <span>{language === 'ar' ? 'المقررات المسجلة لهذا الفصل (1448هـ)' : 'Current Enrolled Courses'}</span>
          </h3>
          <button 
            onClick={() => setActiveTab('services')}
            className="text-xs font-bold text-mu-forest hover:text-mu-emerald flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredCourses.map((course) => {
            const absenceRate = (course.missedLectures / course.totalLectures) * 100;
            const isDanger = absenceRate >= 20;
            const isWarning = absenceRate >= 15 && absenceRate < 20;

            return (
              <div 
                key={course.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic hover:border-mu-forest/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-white shadow-xs"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {course.creditHours} {language === 'ar' ? 'ساعات' : 'Cr Hrs'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug line-clamp-1">
                    {language === 'ar' ? course.nameAr : course.nameEn}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ar' ? course.instructorAr : course.instructorEn}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {course.lectureRoom}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">
                      {language === 'ar' ? 'نسبة الغياب:' : 'Absence Rate:'}
                    </span>
                    <span className={`font-mono font-bold ${
                      isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {absenceRate.toFixed(1)}% ({course.missedLectures} / {Math.floor(course.totalLectures * 0.25)} {language === 'ar' ? 'غياب' : 'missed'})
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (absenceRate / 25) * 100)}%` }}
                    />
                  </div>

                  {isDanger && (
                    <div className="mt-2 text-[10px] text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{language === 'ar' ? 'تحذير: تبقت محاضرة واحدة للحرمان (DN)' : 'Alert: 1 lecture remaining before DN'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Tasks & Recent Academic Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Tasks & Deadlines */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-academic">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-mu-gold" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t('upcomingDeadlines')}
              </h3>
            </div>
            <button 
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-mu-forest hover:text-mu-emerald"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.slice(0, 3).map((task) => (
              <div 
                key={task.id}
                className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 transition"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-0.5 shrink-0 flex items-center justify-center text-transparent hover:text-mu-forest cursor-pointer">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug">
                      {language === 'ar' ? task.titleAr : task.titleEn}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                        {task.courseCode}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {task.priority === 'high' ? t('priorityHigh') : t('priorityMedium')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Academic Documents ready for interactive reading */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-academic">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-mu-forest" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {language === 'ar' ? 'أحدث الملفات والشروحات' : 'Recent Course Materials'}
              </h3>
            </div>
            <button 
              onClick={() => setActiveTab('files')}
              className="text-xs font-bold text-mu-forest hover:text-mu-emerald"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-3">
            {initialAcademicFiles.slice(0, 3).map((file) => (
              <div 
                key={file.id}
                className="p-3 rounded-2xl border border-slate-100 hover:border-mu-forest/30 bg-slate-50/60 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mu-forest/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-mu-forest" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {language === 'ar' ? file.titleAr : file.titleEn}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-mu-gold-dark">
                        {file.courseCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {file.fileSize}
                      </span>
                      {file.isOffline && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          • {language === 'ar' ? 'أوفلاين' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenFileInReader) {
                      onOpenFileInReader(file.id);
                    }
                    setActiveTab('reader');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs shrink-0"
                >
                  {language === 'ar' ? 'مطالعة' : 'Read'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

