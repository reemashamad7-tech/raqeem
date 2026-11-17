import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage, Quiz, QuizQuestion } from '../types';
import { initialQuizzes, officialMajmaahRules, registeredCourses } from '../data/majmaahData';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  BookOpen, 
  FileQuestion, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      contentAr: 'أهلاً بكِ يا ريماس! أنا مساعد رقيم الأكاديمي الذكي المخصص لطلبة كلية علوم الحاسب والمعلومات بجامعة المجمعة. أنا مدرب حصرياً على اللوائح التنظيمية، سلم الدرجات 5.00، نسب الحرمان الأكاديمي DN، والخطط الدراسية لأقسام الكلية. كيف يمكنني مساعدتك اليوم؟',
      contentEn: 'Welcome, Remas! I am Raqeem AI, your dedicated academic assistant trained specifically on Majmaah University CCIS regulations, 5.00 GPA rules, 25% DN absence limits, and course syllabi. How can I assist you today?',
      timestamp: 'الآن',
      sources: ['لائحة الدراسة والاختبارات بجامعة المجمعة', 'دليل الطالب الأكاديمي - كلية الحاسب CCIS']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Practice Quiz Generator State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<string>('CS 211');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // AI Knowledge-Base Q&A Matching Logic
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      contentAr: query,
      contentEn: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let responseAr = '';
      let responseEn = '';
      let sources: string[] = ['دليل الطالب - جامعة المجمعة'];
      let triggerQuiz = false;

      if (q.includes('حرمان') || q.includes('غياب') || q.includes('dn') || q.includes('absence')) {
        responseAr = `وفقاً للائحة الدراسة والاختبارات المعتمدة بجامعة المجمعة (المادة 15):
1. يحرم الطالب من الاستمرار في المقرر ودخول الاختبار النهائي إذا تجاوزت نسبة غيابه 25% من مجموع الساعات التدريسية دون عذر قهري مقبول.
2. يرصد للطالب في سجله الأكاديمي تقدير (محروم - DN) ويحسب كرسوب (1.00 نقطة) في المعدل الفصلي والتراكمي.
3. يمكنك متابعة رصيدك بدقة في قسم "تتبع الحضور" بمنصة رقيم؛ حيث ينبهك النظام عند تجاوز 15% باللون الأصفر، وعند 20% باللون الأحمر.`;
        responseEn = `According to Majmaah University Bylaws (Article 15):
1. A student is denied from taking the final exam (DN) if unexcused absences exceed 25% of total scheduled contact hours.
2. The denial grade (DN) calculates as an F (1.00 point) in your semester and cumulative GPA.
3. You can track your remaining absences in Raqeem's "Attendance Tracker", which alerts you at 15% and 20% thresholds.`;
        sources = ['لائحة الدراسة والاختبارات بجامعة المجمعة - المادة 15', 'بوابة النظام الأكاديمي (إكاديميا)'];
      } else if (q.includes('شرف') || q.includes('honors') || q.includes('معدل') || q.includes('gpa')) {
        responseAr = `شروط وضوابط مرتبة الشرف بجامعة المجمعة:
• مرتبة الشرف الأولى: تمنح للطالب الحاصل على معدل تراكمي من (4.75 إلى 5.00) عند التخرج.
• مرتبة الشرف الثانية: تمنح للطالب الحاصل على معدل تراكمي من (4.25 إلى أقل من 4.75).
الشروط الإلزامية:
1. ألا يكون الطالب قد رسب في أي مقرر درسه في الجامعة أو في جامعة أخرى.
2. أن يكمل الطالب متطلبات التخرج في مدة أقصاها متوسط المدة بين الحد الأدنى والأقصى للبقاء في كليته.
3. أن يكون قد درس في جامعة المجمعة ما لا يقل عن 60% من متطلبات التخرج.`;
        responseEn = `Majmaah University Honors Degree Criteria:
• First Class Honors: Cumulative GPA of 4.75 - 5.00 upon graduation.
• Second Class Honors: Cumulative GPA of 4.25 - 4.74.
Mandatory Rules:
1. Must not have failed any course during university study.
2. Complete graduation within regular study duration.
3. Complete at least 60% of required credit hours at Majmaah University.`;
        sources = ['لائحة مراتب الشرف وقواعد التخرج - جامعة المجمعة'];
      } else if (q.includes('حذف') || q.includes('إضافة') || q.includes('اعتذار') || q.includes('drop') || q.includes('withdraw')) {
        responseAr = `سياسة الحذف والإضافة والاعتذار بجامعة المجمعة:
1. فترة الحذف والإضافة: تتم إلكترونياً عبر البوابة الأكاديمية خلال الأسبوع الأول من بدء الفصل الدراسي.
2. الاعتذار عن مقرر واحد (Withdrawal): يجوز للطالب الاعتذار عن دراسة مقرر بحد أقصى بنهاية الأسبوع العاشر، ويرصد له تقدير (ع - W) دون أي تأثير سلبي على المعدل التراكمي.
3. الاعتذار عن الفصل الدراسي كاملاً: يقدم عبر البوابة قبل بدء الاختبارات النهائية بثلاثة أسابيع، ولا يحتسب الفصل المعتذر عنه ضمن فرص الإنذارات الأكاديمية.`;
        responseEn = `Majmaah University Add/Drop & Course Withdrawal Regulations:
1. Add/Drop Period: Open during Week 1 via the student portal.
2. Course Withdrawal (W): Allowed until the end of Week 10, receiving a (W) grade with no impact on cumulative GPA.
3. Semester Postponement / Apology: Permitted up to 3 weeks before final exams.`;
        sources = ['دليل عمادة القبول والتسجيل - جامعة المجمعة'];
      } else if (q.includes('كويز') || q.includes('quiz') || q.includes('اختبار تجريبي') || q.includes('تدريب')) {
        responseAr = `بالتأكيد! قمت بتوليد اختبار تجريبي تفاعلي ذكي لك في مقرر ${selectedCourseForQuiz}. يمكنك البدء بحله مباشرة عبر النافذة التفاعلية بجانب المحادثة لقياس فهمك لمفاهيم الأشجار وتراكيب البيانات.`;
        responseEn = `Sure! I have generated an interactive smart practice quiz for you in ${selectedCourseForQuiz}. You can start solving it in the interactive quiz card below to test your mastery.`;
        sources = ['بنك أسئلة كلية علوم الحاسب والمعلومات CCIS', 'مقرر CS 211'];
        triggerQuiz = true;
      } else if (q.includes('مشروع') || q.includes('تخرج') || q.includes('تدريب تعاوني') || q.includes('capstone')) {
        responseAr = `ضوابط مشروع التخرج والتدريب التعاوني بكلية علوم الحاسب والمعلومات (CCIS):
1. التدريب التعاوني (Co-op): يشترط إنجاز 90 ساعة معتمدة بنجاح، ويتطلب العمل لمدة 16 أسبوعاً لدى جهة تقنية معتمدة.
2. مشروع التخرج 1 (CS 491): يشترط إنجاز 100 ساعة معتمدة، ويشمل إعداد المقترح الفني ووثيقة المتطلبات (SRS) والنموذج الأولي.
3. مشروع التخرج 2 (CS 492): مخصص للتطوير البرمجي الكامل، الاختبار، والمناقشة الشفهية أمام لجنة المحكمين.`;
        responseEn = `CCIS Capstone & Cooperative Training Guidelines:
1. Cooperative Training: Requires passing 90+ credit hours, spanning 16 weeks in industry.
2. Graduation Project 1 (CS 491): Requires 100+ credit hours, focusing on SRS, research, and prototyping.
3. Graduation Project 2 (CS 492): Focuses on implementation, deployment, and departmental oral defense.`;
        sources = ['دليل مشاريع التخرج - كلية علوم الحاسب والمعلومات'];
      } else {
        responseAr = `شكراً لسؤالك. استناداً إلى مصادر كلية علوم الحاسب والمعلومات ولوائح جامعة المجمعة:
بخصوص استفسارك، ننصح دائماً بمراجعة الخطة الدراسية الاسترشادية لقسمك أو التواصل مع مرشدك الأكاديمي (د. عبد الله المنصور).
كما يمكنك دائماً طلب توليد اختبار تجريبي أو السؤال عن سياسات الغياب والدرجات.`;
        responseEn = `Thank you for your inquiry. Based on Majmaah University CCIS documents:
We recommend checking your degree audit or consulting your academic advisor (Dr. Abdullah Al-Mansoor). You can also request a smart practice quiz on any course topic!`;
        sources = ['دليل كلية علوم الحاسب والمعلومات', 'جامعة المجمعة'];
      }

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        contentAr: responseAr,
        contentEn: responseEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: sources,
        quizPrompt: triggerQuiz
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (triggerQuiz) {
        startCourseQuiz(selectedCourseForQuiz);
      }
    }, 700);
  };

  // Launch practice quiz
  const startCourseQuiz = (courseCode: string) => {
    const foundQuiz = initialQuizzes.find((q) => q.courseCode === courseCode) || initialQuizzes[0];
    setActiveQuiz(foundQuiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuestionAnswer = () => {
    if (selectedOption === null || !activeQuiz) return;

    const currentQ = activeQuiz.questions[currentQuestionIndex];
    if (selectedOption === currentQ.correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-mu-forest via-mu-deep to-surface-900 text-white shadow-academic border border-mu-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-mu-gold/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-mu-gold-light font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-mu-gold" />
              <span>{language === 'ar' ? 'نموذج مدرب حصرياً لجامعة المجمعة' : 'Dedicated Majmaah University Grounded Model'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {t('aiAssistantTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-surface-200 mt-1 max-w-xl font-light">
              {t('aiAssistantSubtitle')}
            </p>
          </div>

          <button
            onClick={() => startCourseQuiz(selectedCourseForQuiz)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mu-gold hover:bg-mu-gold-light text-slate-950 text-xs font-bold shadow-md transition transform active:scale-95 shrink-0"
          >
            <FileQuestion className="w-4 h-4 text-slate-950" />
            <span>{language === 'ar' ? 'توليد كويز تجريبي فوري' : 'Generate Practice Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Chat Interface & Interactive Quiz Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Chat Box (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] rounded-3xl bg-white border border-slate-200 shadow-academic overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-mu-forest flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5 text-mu-gold" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{language === 'ar' ? 'مساعد رقيم - اللوائح والمناهج' : 'Raqeem Assistant - Regulations & Syllabus'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-500">
                  {language === 'ar' ? 'محدث للائحة 1448هـ المعتمدة' : 'Verified against 2026/1448H Bylaws'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-mu-forest font-bold">
              <ShieldCheck className="w-4 h-4 text-mu-gold" />
              <span>{language === 'ar' ? 'إجابات موثوقة' : 'Verified Sources'}</span>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 bg-slate-100/60 border-b border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none text-xs">
            <span className="text-slate-500 font-bold shrink-0">{language === 'ar' ? 'أسئلة سريعة:' : 'Quick:'}</span>
            {[
              { label: language === 'ar' ? 'نسبة حرمان DN' : 'DN Absence 25%', text: t('promptDN') },
              { label: language === 'ar' ? 'شروط مرتبة الشرف' : 'Honors Requirements', text: t('promptHonors') },
              { label: language === 'ar' ? 'الاعتذار عن مقرر' : 'Course Withdrawal (W)', text: t('promptDrop') },
              { label: language === 'ar' ? 'توليد كويز CS 211' : 'Quiz for CS 211', text: t('promptQuizGen') },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-mu-forest/40 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] shrink-0 transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isBot = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    isBot ? 'bg-mu-forest text-mu-gold shadow-xs' : 'bg-slate-800 text-white'
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-slate-50 border border-slate-200 text-slate-800' 
                      : 'bg-mu-forest text-white'
                  }`}>
                    <div className="whitespace-pre-line">
                      {language === 'ar' ? msg.contentAr : msg.contentEn}
                    </div>

                    {/* Grounded Sources Badges */}
                    {isBot && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          {t('sourcesReferenced')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((s, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-mu-forest font-bold flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3 text-mu-gold" />
                              <span>{s}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className={`text-[10px] mt-1.5 block ${isBot ? 'text-slate-400' : 'text-slate-200/70'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Bot className="w-4 h-4 text-mu-gold animate-bounce" />
                <span>{language === 'ar' ? 'مساعد رقيم يبحث في لوائح ومصادر جامعة المجمعة...' : 'Raqeem AI referencing verified CCIS bylaws...'}</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('askQuestionPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-mu-forest/30 focus:border-mu-forest transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald disabled:opacity-40 text-white transition shadow-sm"
              title={t('sendQuestion')}
            >
              <Send className="w-4 h-4 text-mu-gold" />
            </button>
          </div>

        </div>

        {/* Right Column: AI Practice Quiz Hub (5 cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl bg-white border border-slate-200 shadow-academic p-5 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-mu-gold" />
              <h3 className="text-sm font-bold text-slate-900">
                {t('quizGeneratorTitle')}
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-mu-forest/10 text-mu-forest font-bold">
              AI Powered
            </span>
          </div>

          {/* Select Course for Quiz */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('selectCourseQuiz')}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedCourseForQuiz}
                onChange={(e) => setSelectedCourseForQuiz(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-mu-forest/30 outline-none"
              >
                <option value="CS 211">CS 211 - Data Structures (AVL Trees)</option>
                <option value="IS 311">IS 311 - Advanced Databases (Normalization)</option>
              </select>
              <button
                onClick={() => startCourseQuiz(selectedCourseForQuiz)}
                className="px-3.5 py-2 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold transition shrink-0"
              >
                {t('startQuiz')}
              </button>
            </div>
          </div>

          {/* Active Quiz Card */}
          {activeQuiz ? (
            <div className="flex-1 flex flex-col justify-between p-4 rounded-2xl bg-surface-50 border border-slate-200 space-y-4">
              
              {!isQuizCompleted ? (
                <>
                  {/* Progress & Indicator */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>
                        {t('questionCounter')} {currentQuestionIndex + 1} {t('of')} {activeQuiz.questions.length}
                      </span>
                      <span className="font-mono text-mu-forest">
                        {activeQuiz.courseCode}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-mu-gold h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {language === 'ar' 
                        ? activeQuiz.questions[currentQuestionIndex].questionAr 
                        : activeQuiz.questions[currentQuestionIndex].questionEn}
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {(language === 'ar'
                      ? activeQuiz.questions[currentQuestionIndex].optionsAr
                      : activeQuiz.questions[currentQuestionIndex].optionsEn
                    ).map((option, idx) => {
                      const isCorrect = idx === activeQuiz.questions[currentQuestionIndex].correctAnswer;
                      const isChosen = selectedOption === idx;

                      let btnStyle = 'border-slate-200 bg-white hover:border-mu-forest/40 text-slate-800';

                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-red-500 bg-red-50 text-red-900 line-through';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-mu-forest bg-mu-forest/10 text-mu-forest font-bold ring-1 ring-mu-forest';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-start p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback after submitting */}
                  {isAnswerSubmitted && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 animate-fade-in">
                      <span className="font-bold block mb-0.5 text-amber-900">
                        {language === 'ar' ? 'الشرح الأكاديمي النموذجي:' : 'Academic Explanation:'}
                      </span>
                      {language === 'ar'
                        ? activeQuiz.questions[currentQuestionIndex].explanationAr
                        : activeQuiz.questions[currentQuestionIndex].explanationEn}
                    </div>
                  )}

                  {/* Question Bottom Action Button */}
                  <div className="pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitQuestionAnswer}
                        disabled={selectedOption === null}
                        className="w-full py-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald disabled:opacity-40 text-white text-xs font-bold transition shadow-xs"
                      >
                        {t('submitAnswer')}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="w-full py-2.5 rounded-xl bg-mu-gold hover:bg-mu-gold-light text-slate-950 text-xs font-bold transition shadow-xs"
                      >
                        {currentQuestionIndex < activeQuiz.questions.length - 1 ? t('nextQuestion') : t('reviewAnswers')}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Completed Quiz Scoreboard */
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-mu-forest to-mu-gold flex items-center justify-center text-white shadow-lg">
                    <Award className="w-8 h-8 text-mu-gold-light" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {t('congratulations')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'ar' ? 'أتممت الاختبار التجريبي لمقرر' : 'Completed practice quiz for'} {activeQuiz.courseCode}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 inline-block px-8">
                    <span className="text-xs text-slate-400 font-bold block">{t('quizScore')}</span>
                    <span className="text-3xl font-black text-mu-forest font-mono">
                      {quizScore} / {activeQuiz.questions.length}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => startCourseQuiz(selectedCourseForQuiz)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mu-forest hover:bg-mu-emerald text-white text-xs font-bold shadow-md transition"
                    >
                      <RotateCcw className="w-4 h-4 text-mu-gold" />
                      <span>{t('retakeQuiz')}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 p-6 bg-surface-50 rounded-2xl border border-dashed border-slate-200">
              <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'اختر مقرراً واضغط بدء الاختبار التجريبي لتوليد أسئلة تفاعلية ذكية' : 'Select a course and click Start Quiz to generate smart questions'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

