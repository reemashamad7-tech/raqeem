import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Lock, AlertCircle, X, CheckCircle, GraduationCap } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage(
        language === 'ar' 
          ? 'يرجى إدخال البريد الإلكتروني الجامعي' 
          : 'Please enter university email'
      );
      return;
    }

    const res = login(email, studentId);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleDemoLogin = () => {
    login('421105824@s.mu.edu.sa', '421105824');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header with decorative brand banner */}
        <div className="bg-gradient-to-r from-mu-forest to-mu-deep p-6 text-white text-center relative">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white/95 p-2 shadow-md flex items-center justify-center">
            <img src="/raqeem-logo.png" alt="Raqeem" className="w-full h-full object-contain" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {t('studentLoginTitle')}
          </h3>
          <p className="text-xs text-mu-gold-light mt-1 font-medium">
            {t('studentLoginSubtitle')}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'البريد الجامعي للطالب (@s.mu.edu.sa)' : 'Student University Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 421105824@s.mu.edu.sa"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 focus:border-mu-forest transition outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'الرقم الجامعي (اختياري)' : 'Student ID (Optional)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="421105824"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 focus:border-mu-forest transition outline-none"
                />
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('passwordPlaceholder')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 focus:border-mu-forest transition outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-mu-gold" />
              <span>{t('signInBtn')}</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl border border-mu-gold/50 bg-mu-gold/10 hover:bg-mu-gold/20 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-mu-gold" />
              <span>{t('demoStudentBtn')}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              {language === 'ar'
                ? 'النظام مخصص حصرياً لطلبة كلية علوم الحاسب والمعلومات بجامعة المجمعة'
                : 'Restricted to CCIS enrolled students at Majmaah University'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

