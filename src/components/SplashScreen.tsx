import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { isRTL, language } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-mu-forest via-mu-deep to-surface-900 text-white p-6 select-none overflow-hidden">
      {/* Decorative background grid and ambient glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59A3F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-mu-gold/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-mu-olive/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top University Endorsement */}
      <div className="relative z-10 pt-8 text-center flex flex-col items-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-mu-gold-light font-medium mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-mu-gold" />
          <span>
            {language === 'ar' ? 'المملكة العربية السعودية • جامعة المجمعة' : 'Kingdom of Saudi Arabia • Majmaah University'}
          </span>
        </div>
        <p className="text-xs text-white/80 font-medium tracking-wide">
          {language === 'ar' ? 'كلية علوم الحاسب والمعلومات (CCIS)' : 'College of Computer & Information Sciences'}
        </p>
      </div>

      {/* Center Official Raqeem Logo & Identity */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md px-4">
        <div className="relative p-5 mb-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl ring-4 ring-mu-gold/40 ring-offset-4 ring-offset-mu-forest transform transition duration-500 hover:scale-105 flex items-center justify-center">
          <img
            src="/raqeem-logo.png"
            alt="Raqeem Official Logo - رقيم"
            className="w-60 sm:w-80 h-auto object-contain"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          {language === 'ar' ? 'منصة رقيم الأكاديمية' : 'Raqeem Academic Platform'}
        </h1>
        <p className="text-xs sm:text-sm text-surface-200 leading-relaxed font-light mb-6">
          {language === 'ar' 
            ? 'البوابة الشاملة لإدارة المقررات، القراءة التفاعلية، مساعد الذكاء الاصطناعي، ومتابعة الحرمان الأكاديمي' 
            : 'The integrated hub for course management, smart annotations, AI assistant, and graduation tracking'}
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner mb-3">
          <div 
            className="h-full bg-gradient-to-r from-mu-gold to-mu-gold-light transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-mu-gold-light tracking-wider font-mono">
          {progress < 100 ? (language === 'ar' ? 'جاري تجهيز المصادر الأكاديمية...' : 'Loading verified CCIS materials...') : (language === 'ar' ? 'مرحباً بك...' : 'Welcome...')}
        </span>
      </div>

      {/* Skip / Continue Button */}
      <div className="relative z-10 pb-8 w-full max-w-xs flex justify-center">
        <button
          onClick={onFinish}
          className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-mu-gold hover:bg-mu-gold-light text-slate-900 font-bold text-sm shadow-lg shadow-mu-gold/30 transition-all duration-200 transform active:scale-95"
        >
          <span>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

