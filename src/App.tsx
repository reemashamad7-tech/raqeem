import React, { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { FilesView } from './views/FilesView';
import { DocumentReaderView } from './views/DocumentReaderView';
import { AIAssistantView } from './views/AIAssistantView';
import { ServicesView } from './views/ServicesView';
import { ProfileView } from './views/ProfileView';

import { Sparkles, GraduationCap } from 'lucide-react';

export const App: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedFileForReader, setSelectedFileForReader] = useState<string | undefined>('file-1');

  // Splash screen state (can be replayed from footer or on first load)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('raqeem_splash_seen');
  });

  const handleFinishSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('raqeem_splash_seen', 'true');
  };

  const handleOpenFileInReader = (fileId: string) => {
    setSelectedFileForReader(fileId);
    setActiveTab('reader');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-surface-50 text-slate-800 ${isRTL ? 'font-sans' : 'font-sans'}`}>
      
      {/* Animated Splash Screen with Raqeem official logo */}
      {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

      {/* Top University Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <HomeView 
            setActiveTab={setActiveTab} 
            onOpenFileInReader={handleOpenFileInReader} 
          />
        )}
        {activeTab === 'files' && (
          <FilesView 
            setActiveTab={setActiveTab} 
            onOpenFileInReader={handleOpenFileInReader} 
          />
        )}
        {activeTab === 'reader' && (
          <DocumentReaderView 
            initialFileId={selectedFileForReader} 
            setActiveTab={setActiveTab} 
          />
        )}
        {activeTab === 'ai' && (
          <AIAssistantView />
        )}
        {activeTab === 'services' && (
          <ServicesView />
        )}
        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Auth Modal for student login */}
      <AuthModal />

      {/* Academic Institutional Footer */}
      <footer className="hidden md:block bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/raqeem-logo.png" alt="Raqeem" className="h-12 w-auto object-contain" />
            <div>
              <p className="font-bold text-slate-700">
                {t('appName')} — {t('collegeName')}
              </p>
              <p className="text-[11px] text-slate-400">
                {t('universityName')} • {t('allRightsReserved')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setShowSplash(true)}
              className="text-mu-forest hover:text-mu-emerald font-bold"
            >
              {language === 'ar' ? 'عرض شاشة البداية' : 'Replay Splash'}
            </button>
            <span>•</span>
            <span className="text-slate-400">
              {language === 'ar' ? 'نظام الحرمان DN 25%' : 'DN 25% Rule Active'}
            </span>
            <span>•</span>
            <span className="text-mu-gold-dark font-bold font-mono">
              v1.0.0 Production
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default App;

