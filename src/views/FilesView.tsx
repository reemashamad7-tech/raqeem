import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AcademicFile, MajorType, FileCategory } from '../types';
import { initialAcademicFiles, majorsList, registeredCourses } from '../data/majmaahData';
import { jsPDF } from 'jspdf';
import { 
  FolderGit2, 
  Search, 
  Upload, 
  FileCode, 
  FileText, 
  Download, 
  Trash2, 
  Share2, 
  Check, 
  WifiOff, 
  BookOpen, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Users,
  Eye,
  FileCheck2
} from 'lucide-react';

interface FilesViewProps {
  onOpenFileInReader: (fileId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({ onOpenFileInReader, setActiveTab }) => {
  const { language, t, isRTL } = useLanguage();
  const { student } = useAuth();

  const [files, setFiles] = useState<AcademicFile[]>(() => {
    const saved = localStorage.getItem('raqeem_files');
    if (saved) {
      try {
        const parsed: AcademicFile[] = JSON.parse(saved);
        return parsed.filter((f) => (f.category as string) !== 'exams');
      } catch {
        return initialAcademicFiles;
      }
    }
    return initialAcademicFiles;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOfflineOnly, setShowOfflineOnly] = useState<boolean>(false);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showConverterModal, setShowConverterModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<AcademicFile | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Upload Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('CS 211');
  const [newMajor, setNewMajor] = useState<MajorType>('cs');
  const [newCategory, setNewCategory] = useState<FileCategory>('lectures');
  const [newSharingLevel, setNewSharingLevel] = useState<'public' | 'classmates' | 'private'>('public');
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  // Converter Form state
  const [convertTitle, setConvertTitle] = useState('');
  const [convertCourse, setConvertCourse] = useState('CS 211');
  const [convertContent, setConvertContent] = useState('');
  const [convertSuccess, setConvertSuccess] = useState(false);

  // Save changes to localStorage
  const saveFilesState = (updatedFiles: AcademicFile[]) => {
    setFiles(updatedFiles);
    localStorage.setItem('raqeem_files', JSON.stringify(updatedFiles));
  };

  // Toggle offline caching
  const toggleOffline = (fileId: string) => {
    const updated = files.map((f) => {
      if (f.id === fileId) {
        return { ...f, isOffline: !f.isOffline };
      }
      return f;
    });
    saveFilesState(updated);
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الملف؟' : 'Are you sure you want to delete this file?')) {
      const updated = files.filter((f) => f.id !== fileId);
      saveFilesState(updated);
    }
  };

  // Download simulation
  const handleDownload = (file: AcademicFile) => {
    const updated = files.map((f) => (f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f));
    saveFilesState(updated);

    // Generate quick text file download
    const content = (file.contentPages || ['Majmaah University - Raqeem Platform Document']).join('\n\n--- Page Break ---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.titleEn.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetCourse = registeredCourses.find((c) => c.code === newCourseCode);

    const newFile: AcademicFile = {
      id: `file_${Date.now()}`,
      titleAr: newTitle,
      titleEn: newTitle,
      courseCode: newCourseCode,
      courseName: targetCourse?.nameEn || 'Computer Science Course',
      major: newMajor,
      category: newCategory,
      fileType: 'pdf',
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedByAr: student ? student.nameAr : 'طالب مسجل',
      uploadedByEn: student ? student.nameEn : 'Enrolled Student',
      downloadCount: 1,
      isOffline: true,
      sharingLevel: newSharingLevel,
      allowDownload: allowDownload,
      allowComments: allowComments,
      contentPages: [
        `${newTitle}\nCourse: ${newCourseCode}\nAuthor: ${student?.nameEn || 'CCIS Student'}\nMajmaah University - College of Computer & Information Sciences\n\nContent uploaded into Raqeem platform repository.`
      ]
    };

    saveFilesState([newFile, ...files]);
    setShowUploadModal(false);
    setNewTitle('');
  };

  // Built-in File Conversion to PDF Tool
  const handleGeneratePdf = () => {
    if (!convertTitle.trim() || !convertContent.trim()) return;

    const doc = new jsPDF();

    // University Header
    doc.setFontSize(16);
    doc.setTextColor(10, 59, 44); // MU Forest Green
    doc.text('MAJMAAH UNIVERSITY - CCIS', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(197, 154, 63); // MU Gold
    doc.text('RAQEEM ACADEMIC INNOVATION PLATFORM', 20, 26);

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Title: ${convertTitle}`, 20, 36);
    doc.text(`Course: ${convertCourse}`, 20, 43);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Prepared By: ${student?.nameEn || 'CCIS Student'}`, 20, 57);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 62, 190, 62);

    // Content body
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const splitText = doc.splitTextToSize(convertContent, 170);
    doc.text(splitText, 20, 72);

    // Save as local file in app repository
    const newConvertedFile: AcademicFile = {
      id: `converted_${Date.now()}`,
      titleAr: convertTitle,
      titleEn: convertTitle,
      courseCode: convertCourse,
      courseName: 'Converted Document',
      major: student?.major || 'cs',
      category: 'summaries',
      fileType: 'pdf',
      fileSize: '650 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedByAr: student ? student.nameAr : 'ريماس أبوحيمد',
      uploadedByEn: student ? student.nameEn : 'Remas Abuhimed',
      downloadCount: 0,
      isOffline: true,
      sharingLevel: 'public',
      allowDownload: true,
      allowComments: true,
      contentPages: [convertContent]
    };

    saveFilesState([newConvertedFile, ...files]);

    // Download locally
    doc.save(`${convertTitle.replace(/\s+/g, '_')}.pdf`);

    setConvertSuccess(true);
    setTimeout(() => {
      setConvertSuccess(false);
      setShowConverterModal(false);
      setConvertTitle('');
      setConvertContent('');
    }, 1500);
  };

  // Filter logic
  const filteredFiles = files.filter((f) => {
    if (showOfflineOnly && !f.isOffline) return false;
    if (selectedMajor !== 'all' && f.major !== selectedMajor) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAr = f.titleAr.toLowerCase().includes(q);
      const matchEn = f.titleEn.toLowerCase().includes(q);
      const matchCode = f.courseCode.toLowerCase().includes(q);
      if (!matchAr && !matchEn && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-academic">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-mu-forest/10 text-mu-forest">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('academicRepository')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('repositorySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowConverterModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-mu-gold/50 bg-mu-gold/10 hover:bg-mu-gold/20 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            <FileCode className="w-4 h-4 text-mu-gold-dark" />
            <span>{t('convertToPdf')}</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-mu-gold" />
            <span>{t('uploadNewFile')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchFilesPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-mu-forest/30 focus:border-mu-forest transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Offline Only Switcher */}
          <button
            onClick={() => setShowOfflineOnly(!showOfflineOnly)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition shrink-0 ${
              showOfflineOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <WifiOff className={`w-3.5 h-3.5 ${showOfflineOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{t('offlineOnly')}</span>
          </button>

        </div>

        {/* Majors Badges Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التخصص:' : 'Major:'}</span>
          </span>

          <button
            onClick={() => setSelectedMajor('all')}
            className={`px-3 py-1 rounded-lg font-bold transition shrink-0 ${
              selectedMajor === 'all'
                ? 'bg-mu-forest text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('allMajors')}
          </button>

          {majorsList.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMajor(m.id)}
              className={`px-3 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedMajor === m.id
                  ? 'bg-mu-forest text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{m.icon}</span>
              <span>{language === 'ar' ? m.nameAr : m.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Folder Categories Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none border-t border-slate-100 pt-2">
          {[
            { id: 'all', label: t('allCategories') },
            { id: 'lectures', label: t('categoryLectures') },
            { id: 'summaries', label: t('categorySummaries') },
            { id: 'labs', label: t('categoryLabs') },
            { id: 'assignments', label: t('categoryAssignments') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-mu-gold text-slate-950 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-academic hover:border-mu-forest/40 transition flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-mu-forest text-white">
                    {file.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                    {file.fileType}
                  </span>
                </div>

                {/* Offline badge & Sharing status */}
                <div className="flex items-center gap-1.5">
                  {file.isOffline && (
                    <span 
                      className="p-1 rounded bg-emerald-50 text-emerald-600 text-xs" 
                      title={t('offlineCached')}
                    >
                      <WifiOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {file.sharingLevel === 'public' ? (
                    <span title="Public"><Globe className="w-3.5 h-3.5 text-slate-400" /></span>
                  ) : file.sharingLevel === 'classmates' ? (
                    <span title="Classmates"><Users className="w-3.5 h-3.5 text-mu-gold-dark" /></span>
                  ) : (
                    <span title="Private"><Lock className="w-3.5 h-3.5 text-amber-500" /></span>
                  )}
                </div>
              </div>

              {/* Title & Author */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">
                {language === 'ar' ? file.titleAr : file.titleEn}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {t('uploadedBy')} {language === 'ar' ? file.uploadedByAr : file.uploadedByEn}
              </p>
              
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-2">
                <span>{file.fileSize}</span>
                <span>•</span>
                <span>{file.uploadDate}</span>
                <span>•</span>
                <span>{file.downloadCount} {language === 'ar' ? 'تنزيل' : 'DL'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onOpenFileInReader(file.id);
                  setActiveTab('reader');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-mu-gold" />
                <span>{language === 'ar' ? 'المطالعة والترجمة' : 'Reader'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 rounded-xl text-slate-600 hover:text-mu-forest hover:bg-slate-100 transition"
                  title={t('download')}
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleOffline(file.id)}
                  className={`p-2 rounded-xl transition ${
                    file.isOffline 
                      ? 'text-emerald-600 hover:bg-emerald-50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={file.isOffline ? t('removeOffline') : t('saveOffline')}
                >
                  <WifiOff className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowShareModal(file)}
                  className="p-2 rounded-xl text-slate-600 hover:text-mu-gold-dark hover:bg-slate-100 transition"
                  title={t('share')}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 p-6 bg-white rounded-3xl border border-slate-200">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">
            {language === 'ar' ? 'لم يتم العثور على ملفات تطابق الفلتر' : 'No documents match the selected filters'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar' ? 'جرب تغيير معايير البحث أو رفع ملف جديد' : 'Try adjusting search terms or upload a new file'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-mu-forest p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-mu-gold" />
                <h3 className="text-base font-bold">{t('modalUploadTitle')}</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('fileTitleLabel')}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: ملخص خوارزميات الترتيب والبحث O(n log n)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('selectCourse')}</label>
                  <select
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                  >
                    {registeredCourses.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} - {language === 'ar' ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('selectCategory')}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FileCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                  >
                    <option value="lectures">{t('categoryLectures')}</option>
                    <option value="summaries">{t('categorySummaries')}</option>
                    <option value="labs">{t('categoryLabs')}</option>
                    <option value="assignments">{t('categoryAssignments')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('selectSharing')}</label>
                <select
                  value={newSharingLevel}
                  onChange={(e) => setNewSharingLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                >
                  <option value="public">{t('sharePublic')}</option>
                  <option value="classmates">{t('shareClassmates')}</option>
                  <option value="private">{t('sharePrivate')}</option>
                </select>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="rounded text-mu-forest focus:ring-mu-forest"
                  />
                  <span>{t('allowDownloadCheck')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="rounded text-mu-forest focus:ring-mu-forest"
                  />
                  <span>{t('allowCommentsCheck')}</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold shadow-md"
                >
                  {t('submitUpload')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Built-in File Converter Modal */}
      {showConverterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-mu-forest to-mu-deep p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-mu-gold" />
                  <span>{t('converterTitle')}</span>
                </h3>
                <p className="text-xs text-mu-gold-light mt-0.5">{t('converterSubtitle')}</p>
              </div>
              <button onClick={() => setShowConverterModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {convertSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold">
                    {language === 'ar' ? 'تم تحويل وحفظ المستند كملف PDF بنجاح!' : 'Document converted and saved as PDF!'}
                  </h4>
                  <p className="text-xs text-emerald-600">
                    {language === 'ar' ? 'تمت إضافته لمستودعك ومتاح الآن للمطالعة أوفلاين' : 'Added to your repository and ready for offline reading.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('docTitlePrompt')}</label>
                      <input
                        type="text"
                        value={convertTitle}
                        onChange={(e) => setConvertTitle(e.target.value)}
                        placeholder="e.g. Chapter 4 Summary Notes"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('selectCourse')}</label>
                      <select
                        value={convertCourse}
                        onChange={(e) => setConvertCourse(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
                      >
                        {registeredCourses.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('docContentPrompt')}</label>
                    <textarea
                      rows={6}
                      value={convertContent}
                      onChange={(e) => setConvertContent(e.target.value)}
                      placeholder="Type or paste your academic notes, summaries, or formulas here..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-mu-forest/30 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'يدمج ترويسة جامعة المجمعة الرسمية وشعار رقيم' : 'Includes official Majmaah header and Raqeem badge'}
                    </span>
                    <button
                      onClick={handleGeneratePdf}
                      disabled={!convertTitle.trim() || !convertContent.trim()}
                      className="px-5 py-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4 text-mu-gold" />
                      <span>{t('generateAndSavePdf')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-mu-forest" />
                <span>{language === 'ar' ? 'مشاركة الملف والصلاحيات' : 'File Sharing & Permissions'}</span>
              </h3>
              <button onClick={() => setShowShareModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                {language === 'ar' ? showShareModal.titleAr : showShareModal.titleEn}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {showShareModal.courseCode} • {showShareModal.fileSize}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {language === 'ar' ? 'رابط المشاركة المباشر لطلبة الجامعة:' : 'Direct CCIS Student Access Link:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://raqeem.mu.edu.sa/files/${showShareModal.id}`}
                  className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://raqeem.mu.edu.sa/files/${showShareModal.id}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-mu-forest text-white text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-mu-gold" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">{language === 'ar' ? 'صلاحيات هذا الملف:' : 'Configured Permissions:'}</p>
              <p>• {language === 'ar' ? 'التحميل متاح لجميع الطلبة' : 'Download enabled for all students'}</p>
              <p>• {language === 'ar' ? 'إضافة الملاحظات التفاعلية متاحة' : 'Interactive note annotations permitted'}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
