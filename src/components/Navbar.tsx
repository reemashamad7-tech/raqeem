import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, 
  Bell, 
  User, 
  Wifi, 
  WifiOff, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Layers, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { student, isAuthenticated, setShowAuthModal } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const notifications = [
    {
      id: 'n1',
      titleAr: 'تنبيه غياب هام: مقرر CS 380',
      titleEn: 'Absence Alert: CS 380',
      descAr: 'نسبة غيابك وصلت 20%. غياب واحد إضافي يعرضك للحرمان الأكاديمي (DN).',
      descEn: 'Your absence reached 20%. One more absence triggers academic denial (DN).',
      type: 'warning',
      timeAr: 'قبل ساعتين',
      timeEn: '2 hrs ago',
    },
    {
      id: 'n2',
      titleAr: 'إيداع سلايدات المحاضرة 4',
      titleEn: 'Lecture 4 Slides Uploaded',
      descAr: 'تم إضافة سلايدات أشجار AVL في تراكيب البيانات CS 211.',
      descEn: 'AVL Tree slides added to Data Structures CS 211 repository.',
      type: 'info',
      timeAr: 'أمس',
      timeEn: 'Yesterday',
    },
    {
      id: 'n3',
      titleAr: 'تذكير: اقتراب موعد الاختبار الفصلي',
      titleEn: 'Reminder: Midterm Exam Approaching',
      descAr: 'بدء الاختبارات الفصلية في 22 نوفمبر 2026.',
      descEn: 'Midterm exam period starts on Nov 22, 2026.',
      type: 'info',
      timeAr: 'قبل يومين',
      timeEn: '2 days ago',
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Logo & University Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3.5 group focus:outline-none"
            >
              <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/raqeem-logo.png"
                  alt="Raqeem Logo"
                  className="h-14 sm:h-16 md:h-18 w-auto object-contain"
                />
              </div>
              <div className="text-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-mu-forest tracking-tight font-sans">
                    {language === 'ar' ? 'رَقِيم' : 'RAQEEM'}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-mu-forest/10 text-mu-forest border border-mu-forest/20">
                    CCIS • MU
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden md:block">
                  {language === 'ar' ? 'المنصة الأكاديمية • جامعة المجمعة' : 'Academic Platform • Majmaah University'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'home', label: t('navHome'), icon: Layers },
              { id: 'files', label: t('navFiles'), icon: FileText },
              { id: 'reader', label: t('navReader'), icon: BookOpen },
              { id: 'ai', label: t('navAI'), icon: Sparkles },
              { id: 'services', label: t('navServices'), icon: Calendar },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-mu-forest text-white shadow-sm'
                      : 'text-slate-600 hover:text-mu-forest hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-mu-gold' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls: Language, Notifications, Student Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
              title="Change Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-mu-gold" />
              <span className="font-mono">{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Offline/Online Indicator Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
              title={isOnline ? 'Connected to MU Cloud' : 'Offline Mode Active'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline text-[11px] font-semibold">
                    {language === 'ar' ? 'سحابي' : 'Online'}
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden lg:inline text-[11px] font-semibold">
                    {language === 'ar' ? 'أوفلاين' : 'Offline'}
                  </span>
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div 
                  className={`absolute mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-academic-lg p-4 z-50 animate-in fade-in-50 zoom-in-95 ${
                    isRTL ? 'left-0 sm:left-auto right-auto sm:right-0' : 'right-0 sm:right-auto left-auto sm:left-0'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-mu-forest" />
                      <h4 className="text-xs font-bold text-slate-800">
                        {language === 'ar' ? 'الإشعارات الأكاديمية' : 'Academic Notifications'}
                      </h4>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 first:pt-1 last:pb-1">
                        <div className="flex items-start gap-2.5">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-mu-emerald shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800">
                              {language === 'ar' ? n.titleAr : n.titleEn}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {language === 'ar' ? n.descAr : n.descEn}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 inline-block font-mono">
                              {language === 'ar' ? n.timeAr : n.timeEn}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Trigger */}
            {isAuthenticated && student ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition ${
                  activeTab === 'profile'
                    ? 'border-mu-forest bg-mu-forest/5'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-mu-forest to-mu-emerald flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {student.nameAr.charAt(0)}
                </div>
                <div className="hidden sm:block text-start">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {language === 'ar' ? student.nameAr.split(' ')[0] : student.nameEn.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-mu-gold font-bold font-mono">
                    GPA {student.gpa.toFixed(2)}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mu-forest text-white text-xs font-bold hover:bg-mu-emerald transition shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-mu-gold" />
                <span>{t('navLogin')}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

