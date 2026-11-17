import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  FolderGit2, 
  BookOpenText, 
  Sparkles, 
  GraduationCap, 
  UserCheck 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'files', label: t('navFiles'), icon: FolderGit2 },
    { id: 'reader', label: t('navReader'), icon: BookOpenText },
    { id: 'ai', label: t('navAI'), icon: Sparkles, highlight: true },
    { id: 'services', label: t('navServices'), icon: GraduationCap },
    { id: 'profile', label: t('navProfile'), icon: UserCheck },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl safe-area-pb">
      <div className="grid grid-cols-6 items-center px-1 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-mu-forest font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-tr from-mu-forest to-mu-emerald text-mu-gold shadow-md scale-105'
                      : 'bg-mu-forest/10 text-mu-forest'
                    : item.highlight
                    ? 'bg-mu-gold/15 text-mu-gold-dark'
                    : 'text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive && !item.highlight ? 'text-mu-forest' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-4 h-0.5 bg-mu-forest rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

