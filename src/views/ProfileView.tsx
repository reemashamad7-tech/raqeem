import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { majorsList } from '../data/majmaahData';
import { 
  User, 
  GraduationCap, 
  QrCode, 
  Award, 
  Mail, 
  Building2, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X,
  CreditCard
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const { student, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editNameAr, setEditNameAr] = useState(student?.nameAr || '');
  const [editNameEn, setEditNameEn] = useState(student?.nameEn || '');
  const [editMajor, setEditMajor] = useState(student?.major || 'cs');

  if (!student) return null;

  const handleSaveProfile = () => {
    updateProfile({
      nameAr: editNameAr,
      nameEn: editNameEn,
      major: editMajor as any
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Official Digital University Student ID Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-mu-forest via-mu-deep to-surface-900 text-white shadow-academic-lg border border-mu-gold/30 p-6 sm:p-8">
        
        {/* Background watermark / decorative patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59A3F_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-mu-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          
          {/* Card Top Brand Row */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-2xl bg-white/95 shadow-md flex items-center justify-center">
                <img src="/raqeem-logo.png" alt="Raqeem Logo" className="h-14 sm:h-16 w-auto object-contain" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-white">
                  {language === 'ar' ? 'المملكة العربية السعودية • جامعة المجمعة' : 'Kingdom of Saudi Arabia • Majmaah University'}
                </h3>
                <p className="text-[11px] text-mu-gold-light font-medium">
                  {language === 'ar' ? 'كلية علوم الحاسب والمعلومات (CCIS)' : 'College of Computer & Information Sciences'}
                </p>
              </div>
            </div>

            <div className="text-end hidden sm:block">
              <span className="text-[10px] uppercase tracking-widest text-slate-300 font-mono block">Student Academic ID</span>
              <span className="text-xs font-bold text-mu-gold font-mono">{student.joinedYear}</span>
            </div>
          </div>

          {/* Student Main Details Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Student Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-mu-gold to-mu-gold-light p-1 shadow-lg ring-4 ring-white/20">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white text-3xl font-black">
                  {student.nameAr.charAt(0)}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900" title="Active Enrolled" />
            </div>

            {/* Student Info */}
            <div className="flex-1 text-center sm:text-start space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {language === 'ar' ? student.nameAr : student.nameEn}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-mu-gold/25 text-mu-gold-light text-xs font-bold border border-mu-gold/40 self-center sm:self-auto">
                  {language === 'ar' ? student.academicStandingAr : student.academicStandingEn}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {language === 'ar' ? 'التخصص: علوم الحاسب (CS)' : 'Major: Computer Science (CS)'} • {language === 'ar' ? 'المستوى السابع' : 'Level 7'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-mono">
                <span className="text-slate-300">
                  {t('studentIdBadge')} <strong className="text-white">{student.studentId}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">
                  GPA: <strong className="text-mu-gold-light">{student.gpa.toFixed(2)} / 5.00</strong>
                </span>
              </div>
            </div>

            {/* Simulated Smart Campus Access Barcode / QR */}
            <div className="p-3 bg-white rounded-2xl shadow-md text-slate-900 flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-16 h-16 text-slate-900" />
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                MU-GATE-421105
              </span>
            </div>

          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-mu-gold" />
              <span>{language === 'ar' ? 'بطاقة جامعية رقمية رسمية ومعتمدة' : 'Official Verified Digital Student Credential'}</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              VALID THRU 1448H / 2027
            </span>
          </div>

        </div>
      </div>

      {/* Profile Details & Academic Standing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Academic Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-academic space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-mu-forest" />
              <span>{language === 'ar' ? 'السجل الأكاديمي والكلية' : 'Academic Standing & College'}</span>
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-mu-forest hover:text-mu-emerald flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? t('cancel') : (language === 'ar' ? 'تعديل' : 'Edit')}</span>
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالعربية</label>
                <input
                  type="text"
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name in English</label>
                <input
                  type="text"
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full py-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-mu-gold" />
                <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'الكلية:' : 'College:'}</span>
                <span className="font-bold text-slate-800">{language === 'ar' ? student.collegeAr : student.collegeEn}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{t('advisorLabel')}</span>
                <span className="font-bold text-slate-800">{language === 'ar' ? student.advisorNameAr : student.advisorNameEn}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'الساعات المنجزة:' : 'Completed Hours:'}</span>
                <span className="font-mono font-bold text-slate-800">{student.creditHoursCompleted} من أصل {student.totalCreditHours} ساعة</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'البريد الجامعي:' : 'University Email:'}</span>
                <span className="font-mono font-bold text-mu-forest">{student.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Account Controls & Log Out */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-academic space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-mu-forest" />
              <span>{t('accountSettings')}</span>
            </h3>

            <div className="space-y-3 mt-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t('offlineSyncEnabled')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'تخزين المذكرات والسلايدات تلقائياً للعمل بدون إنترنت' : 'Auto cache slides for offline reading'}
                  </span>
                </div>
                <div className="w-9 h-5 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end">
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {language === 'ar' ? 'تنبيهات الغياب وحرمان DN' : 'DN Absence Warnings'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'إشعار فوري عند وصول الغياب لـ 15% و 20%' : 'Instant push notifications at 15% & 20%'}
                  </span>
                </div>
                <div className="w-9 h-5 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end">
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('navLogout')}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

