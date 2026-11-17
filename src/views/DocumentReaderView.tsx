import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AcademicFile } from '../types';
import { initialAcademicFiles } from '../data/majmaahData';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Languages, 
  Highlighter, 
  StickyNote, 
  PenTool, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  RotateCcw, 
  Eraser, 
  Check, 
  Share2, 
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles
} from 'lucide-react';

interface DocumentReaderViewProps {
  initialFileId?: string;
  setActiveTab: (tab: string) => void;
}

export const DocumentReaderView: React.FC<DocumentReaderViewProps> = ({ initialFileId, setActiveTab }) => {
  const { language, t, isRTL } = useLanguage();

  const [files] = useState<AcademicFile[]>(() => {
    const saved = localStorage.getItem('raqeem_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialAcademicFiles;
      }
    }
    return initialAcademicFiles;
  });

  const [selectedFileId, setSelectedFileId] = useState<string>(initialFileId || files[0]?.id || 'file-1');
  const currentFile = files.find((f) => f.id === selectedFileId) || files[0];

  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = currentFile?.contentPages?.length || 1;

  // Translation mode
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string>('');

  // Bookmarking
  const [bookmarks, setBookmarks] = useState<Record<string, number[]>>(() => {
    const saved = localStorage.getItem('raqeem_bookmarks');
    return saved ? JSON.parse(saved) : {};
  });

  // Typed Notes
  const [notes, setNotes] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('raqeem_notes');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentNoteInput, setCurrentNoteInput] = useState<string>('');

  // Highlighting
  const [highlightColor, setHighlightColor] = useState<string>('yellow');
  const [isHighlightingActive, setIsHighlightingActive] = useState<boolean>(false);

  // Drawing Canvas State
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<string>('#0A3B2C'); // Default MU forest green
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  // Sync initialFileId when changed
  useEffect(() => {
    if (initialFileId) {
      setSelectedFileId(initialFileId);
      setCurrentPage(0);
      setShowTranslation(false);
    }
  }, [initialFileId]);

  // Handle translation simulation based on academic CCIS vocabulary
  useEffect(() => {
    const currentSlideText = currentFile?.contentPages?.[currentPage] || '';
    
    // Domain-specific translations for CCIS curriculum
    let translation = currentSlideText
      .replace(/Binary Search Trees \(BST\) & Balanced AVL Trees/g, 'أشجار البحث الثنائية (BST) وأشجار AVL المتوازنة ذاتياً')
      .replace(/Introduction to Binary Search Trees \(BST\):/g, 'مقدمة إلى أشجار البحث الثنائية (BST):')
      .replace(/A Binary Search Tree is a node-based binary tree data structure with the following invariant:/g, 'شجرة البحث الثنائية هي بنية بيانات شجرية ثنائية مبنية على العقد وتتبع الخاصية الثابتة التالية:')
      .replace(/The left subtree of a node contains only nodes with keys lesser than the node's key\./g, 'تحتوي الشجرة الفرعية اليسرى لأي عقدة على مفاتيح أصغر فقط من مفتاح العقدة.')
      .replace(/The right subtree of a node contains only nodes with keys greater than the node's key\./g, 'تحتوي الشجرة الفرعية اليمنى لأي عقدة على مفاتيح أكبر فقط من مفتاح العقدة.')
      .replace(/Time Complexity Analysis:/g, 'تحليل التعقيد الزمني والخوارزمي:')
      .replace(/Search \/ Lookup: Average O\(log n\), Worst Case O\(n\) when skewed\./g, 'البحث: بالمتوسط O(log n)، وفي أسوأ الحالات O(n) عندما تكون منحرفة.')
      .replace(/Insertion: Average O\(log n\), Worst Case O\(n\)\./g, 'الإدراج: بالمتوسط O(log n)، وفي أسوأ الحالات O(n).')
      .replace(/Deletion: Average O\(log n\), Worst Case O\(n\)\./g, 'الحذف: بالمتوسط O(log n)، وفي أسوأ الحالات O(n).')
      .replace(/AVL Tree Invariants & Self-Balancing Mechanism:/g, 'خصائص شجرة AVL وآلية إعادة التوازن التلقائي:')
      .replace(/Balance Factor Formula:/g, 'معادلة معامل التوازن:')
      .replace(/Rotations used to restore balance:/g, 'أنواع الدوران المستخدمة لاستعادة التوازن:')
      .replace(/LL Rotation \(Single Right Rotation\)/g, 'دوران LL (دوران مفرد لليمين)')
      .replace(/RR Rotation \(Single Left Rotation\)/g, 'دوران RR (دوران مفرد لليسار)')
      .replace(/LR Rotation \(Left-Right Double Rotation\)/g, 'دوران LR (دوران مزدوج: يسار ثم يمين)')
      .replace(/RL Rotation \(Right-Left Double Rotation\)/g, 'دوران RL (دوران مزدوج: يمين ثم يسار)')
      .replace(/Relational Normalization/g, 'تسوية وتنظيم قواعد البيانات العلائقية')
      .replace(/First Normal Form \(1NF\):/g, 'الصيغة المعيارية الأولى (1NF):')
      .replace(/Second Normal Form \(2NF\):/g, 'الصيغة المعيارية الثانية (2NF):')
      .replace(/Third Normal Form \(3NF\):/g, 'الصيغة المعيارية الثالثة (3NF):')
      .replace(/Boyce-Codd Normal Form \(BCNF\):/g, 'صيغة بويس-كود المعيارية (BCNF):')
      .replace(/Agile & Scrum Framework in Software Engineering/g, 'إطار العمل أجايل وسكروم في هندسة البرمجيات')
      .replace(/Core Agile Values \(The Agile Manifesto\):/g, 'القيم الأساسية لمنهجية أجايل:')
      .replace(/Working software over comprehensive documentation\./g, 'برمجيات قابلة للعمل ومُختبرة أولى من التوثيق الشامل المتراكم.')
      .replace(/AI Question Bank - Midterm & Final Archive/g, 'بنك أسئلة الذكاء الاصطناعي - أرشيف الاختبارات الفصلية والنهائية')
      .replace(/Breadth-First Search \(BFS\)/g, 'خوارزمية البحث بالعرض أولاً (BFS)')
      .replace(/Depth-First Search \(DFS\)/g, 'خوارزمية البحث بالعمق أولاً (DFS)')
      .replace(/A\* Search/g, 'خوارزمية البحث الذكية A*')
      .replace(/Heuristic Admissibility/g, 'مقبولية الدالة التجريبية (Admissibility)');

    setTranslatedText(translation);
  }, [currentFile, currentPage]);

  // Bookmark Toggle
  const isBookmarked = (bookmarks[selectedFileId] || []).includes(currentPage);
  const toggleBookmark = () => {
    const fileBookmarks = bookmarks[selectedFileId] || [];
    let updated: number[];
    if (fileBookmarks.includes(currentPage)) {
      updated = fileBookmarks.filter((p) => p !== currentPage);
    } else {
      updated = [...fileBookmarks, currentPage];
    }
    const newAll = { ...bookmarks, [selectedFileId]: updated };
    setBookmarks(newAll);
    localStorage.setItem('raqeem_bookmarks', JSON.stringify(newAll));
  };

  // Add typed note
  const handleAddNote = () => {
    if (!currentNoteInput.trim()) return;
    const key = `${selectedFileId}_p${currentPage}`;
    const pageNotes = notes[key] || [];
    const newPageNotes = [...pageNotes, currentNoteInput.trim()];
    const newNotes = { ...notes, [key]: newPageNotes };
    setNotes(newNotes);
    localStorage.setItem('raqeem_notes', JSON.stringify(newNotes));
    setCurrentNoteInput('');
  };

  const handleDeleteNote = (index: number) => {
    const key = `${selectedFileId}_p${currentPage}`;
    const pageNotes = notes[key] || [];
    const filtered = pageNotes.filter((_, i) => i !== index);
    const newNotes = { ...notes, [key]: filtered };
    setNotes(newNotes);
    localStorage.setItem('raqeem_notes', JSON.stringify(newNotes));
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = isEraser ? 16 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Export Annotated Document
  const handleExportAnnotated = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(10, 59, 44);
    doc.text(`Annotated Document: ${currentFile.titleEn}`, 15, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Course: ${currentFile.courseCode} | Page ${currentPage + 1} of ${totalPages}`, 15, 27);
    doc.text(`University: Majmaah University (CCIS) | Platform: Raqeem`, 15, 33);
    doc.line(15, 37, 195, 37);

    // Document text
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const split = doc.splitTextToSize(currentFile.contentPages?.[currentPage] || '', 180);
    doc.text(split, 15, 45);

    // Notes attached
    const key = `${selectedFileId}_p${currentPage}`;
    const pageNotes = notes[key] || [];
    if (pageNotes.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(197, 154, 63); // MU Gold
      doc.text('Student Study Notes & Reflections:', 15, 180);
      pageNotes.forEach((n, idx) => {
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(`• ${n}`, 15, 190 + idx * 8);
      });
    }

    doc.save(`${currentFile.courseCode}_Page_${currentPage + 1}_Annotated.pdf`);
  };

  const currentPageNotes = notes[`${selectedFileId}_p${currentPage}`] || [];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Document Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-academic">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-mu-forest/10 text-mu-forest">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-mu-forest text-white">
                {currentFile.courseCode}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {language === 'ar' ? currentFile.titleAr : currentFile.titleEn}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {currentFile.courseName} • {currentFile.fileSize}
            </p>
          </div>
        </div>

        {/* Document Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedFileId}
            onChange={(e) => {
              setSelectedFileId(e.target.value);
              setCurrentPage(0);
              setShowTranslation(false);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-mu-forest/30 outline-none max-w-xs"
          >
            {files.map((f) => (
              <option key={f.id} value={f.id}>
                {f.courseCode} - {f.titleEn}
              </option>
            ))}
          </select>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition ${
              isBookmarked
                ? 'border-mu-gold bg-mu-gold/15 text-mu-gold-dark'
                : 'border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={t('bookmarkTool')}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportAnnotated}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shadow-xs"
            title={t('exportAnnotated')}
          >
            <Download className="w-3.5 h-3.5 text-mu-gold" />
            <span className="hidden sm:inline">{t('exportAnnotated')}</span>
          </button>
        </div>

      </div>

      {/* Floating Toolbar for Reading, Instant Translation & Canvas Annotations */}
      <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 flex-wrap">
        
        {/* Instant Translation Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              showTranslation
                ? 'bg-mu-gold text-slate-950 font-bold shadow-gold-glow'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>{t('instantTranslation')}</span>
          </button>

          {showTranslation && (
            <span className="text-[11px] text-mu-gold-light hidden sm:inline-block">
              {language === 'ar' ? 'عرض متزامن (إنجليزي ⟷ عربي)' : 'Synced View (EN ⟷ AR)'}
            </span>
          )}
        </div>

        {/* Freehand Annotation Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={() => {
              setIsDrawingMode(!isDrawingMode);
              setIsEraser(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isDrawingMode && !isEraser
                ? 'bg-mu-forest border border-mu-gold text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-mu-gold" />
            <span>{t('drawTool')}</span>
          </button>

          {isDrawingMode && (
            <>
              {/* Color Palette */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                {[
                  { color: '#0A3B2C', label: 'Forest Green' },
                  { color: '#C59A3F', label: 'Gold' },
                  { color: '#DC2626', label: 'Red' },
                  { color: '#1A365D', label: 'Navy' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => {
                      setBrushColor(c.color);
                      setIsEraser(false);
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                      brushColor === c.color && !isEraser ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Eraser */}
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`p-1.5 rounded-xl transition ${
                  isEraser ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Eraser"
              >
                <Eraser className="w-4 h-4" />
              </button>

              {/* Clear Canvas */}
              <button
                onClick={handleClearCanvas}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title={t('clearCanvas')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Highlighting Mode Switcher */}
          <button
            onClick={() => setIsHighlightingActive(!isHighlightingActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isHighlightingActive
                ? 'bg-amber-400 text-slate-900 font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('highlightTool')}</span>
          </button>

        </div>

        {/* Page Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition text-white"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <span className="text-xs font-mono font-bold text-slate-200">
            {t('page')} {currentPage + 1} {t('of')} {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition text-white"
          >
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Main Document & Translation Side-by-Side Reading Area */}
      <div className={`grid gap-4 ${showTranslation ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Original Academic Slide / Document Page with Canvas Overlay */}
        <div className="relative rounded-3xl bg-white border border-slate-200 shadow-academic overflow-hidden min-h-[480px] p-6 sm:p-8 flex flex-col justify-between">
          
          {/* Decorative Slide Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1 text-mu-forest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-mu-gold" />
              <span>CCIS • Majmaah University Official Lecture Deck</span>
            </span>
            <span className="font-mono">{currentFile.courseCode} — Slide {currentPage + 1}</span>
          </div>

          {/* Slide Text Content */}
          <div className={`relative z-10 py-6 text-slate-800 font-sans leading-relaxed whitespace-pre-line text-sm sm:text-base ${
            isHighlightingActive ? 'bg-amber-100/50 p-4 rounded-2xl border border-amber-200' : ''
          }`}>
            {currentFile.contentPages?.[currentPage] || 'No content available for this slide.'}
          </div>

          {/* Freehand Drawing Canvas Overlay */}
          {isDrawingMode && (
            <canvas
              ref={canvasRef}
              width={750}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 z-20 w-full h-full cursor-crosshair touch-none"
            />
          )}

          {/* Slide Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Raqeem Interactive Engine</span>
            <span>{t('page')} {currentPage + 1}</span>
          </div>

        </div>

        {/* Instant Translation Panel (Appears side-by-side or below) */}
        {showTranslation && (
          <div className="rounded-3xl bg-surface-50 border border-mu-gold/40 shadow-academic p-6 sm:p-8 flex flex-col justify-between animate-fade-in relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mu-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs font-bold text-mu-forest">
                <span className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-mu-gold" />
                  <span>{language === 'ar' ? 'الترجمة الأكاديمية المباشرة (عربي)' : 'Instant Academic Translation (Arabic)'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-mu-gold/20 text-mu-gold-dark text-[10px] font-mono font-bold">
                  Majmaah AI
                </span>
              </div>

              <div className="py-6 text-slate-800 font-sans leading-relaxed whitespace-pre-line text-sm sm:text-base dir-rtl">
                {translatedText}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-mu-olive font-bold">
                {language === 'ar' ? 'ترجمة مصطلحات علوم الحاسب المعتمدة في الكلية' : 'CCIS Verified Terminology'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                <span>{language === 'ar' ? 'نسخ الترجمة' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Typed Notes & Study Reflections Section */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-academic space-y-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-mu-gold-dark" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            {t('myNotesForPage')} ({t('page')} {currentPage + 1})
          </h4>
        </div>

        {/* Existing Notes on this page */}
        {currentPageNotes.length > 0 ? (
          <div className="space-y-2">
            {currentPageNotes.map((note, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3 text-xs text-amber-950 font-medium"
              >
                <span>• {note}</span>
                <button
                  onClick={() => handleDeleteNote(idx)}
                  className="text-amber-700 hover:text-red-600 p-0.5"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            {language === 'ar' ? 'لا توجد ملاحظات مدونة لهذه الصفحة بعد. يمكنك كتابة تعليقاتك أدناه.' : 'No notes written for this slide yet. You can add your insights below.'}
          </p>
        )}

        {/* Input for new note */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={currentNoteInput}
            onChange={(e) => setCurrentNoteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder={t('addNotePlaceholder')}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-mu-forest/30 outline-none"
          />
          <button
            onClick={handleAddNote}
            disabled={!currentNoteInput.trim()}
            className="px-4 py-2 rounded-xl bg-mu-forest hover:bg-mu-emerald disabled:opacity-40 text-white text-xs font-bold transition shadow-xs"
          >
            {t('saveNote')}
          </button>
        </div>
      </div>

    </div>
  );
};

