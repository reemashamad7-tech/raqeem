import { Course, AcademicFile, StudentProfile, CalendarEvent, TaskItem, Quiz } from '../types';

export const initialStudentProfile: StudentProfile = {
  id: 'std_421105824',
  studentId: '421105824',
  nameAr: 'ريماس أبوحيمد',
  nameEn: 'Remas Abuhimed',
  email: 'r.abuhimed@s.mu.edu.sa',
  collegeAr: 'كلية علوم الحاسب والمعلومات (CCIS)',
  collegeEn: 'College of Computer and Information Sciences (CCIS)',
  major: 'cs',
  level: 7,
  gpa: 4.82,
  creditHoursCompleted: 112,
  totalCreditHours: 134,
  academicStandingAr: 'ممتاز مع مرتبة الشرف الأولى',
  academicStandingEn: 'Excellent with First Class Honors',
  joinedYear: '1443 هـ / 2022 م',
  advisorNameAr: 'د. عبد الله بن محمد المنصور',
  advisorNameEn: 'Dr. Abdullah Al-Mansoor',
};

export const majorsList = [
  { id: 'cs', nameAr: 'علوم الحاسب', nameEn: 'Computer Science', code: 'CS', icon: '💻' },
  { id: 'it', nameAr: 'تقنية المعلومات', nameEn: 'Information Technology', code: 'IT', icon: '🌐' },
  { id: 'is', nameAr: 'نظم المعلومات', nameEn: 'Information Systems', code: 'IS', icon: '📊' },
  { id: 'swe', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', code: 'SWE', icon: '⚙️' },
];

export const registeredCourses: Course[] = [
  {
    id: 'cs211',
    code: 'CS 211',
    nameAr: 'تراكيب البيانات والخوارزميات',
    nameEn: 'Data Structures & Algorithms',
    creditHours: 4,
    major: 'cs',
    level: 5,
    instructorAr: 'د. خالد بن فهد الشمري',
    instructorEn: 'Dr. Khalid Al-Shammari',
    lectureRoom: 'CCIS - قاعة 204',
    color: '#0A3B2C',
    totalLectures: 30,
    attendedLectures: 28,
    missedLectures: 2, // 6.6% (< 25%)
  },
  {
    id: 'is311',
    code: 'IS 311',
    nameAr: 'تصميم وإدارة قواعد البيانات المتقدمة',
    nameEn: 'Advanced Database Systems',
    creditHours: 3,
    major: 'is',
    level: 6,
    instructorAr: 'د. عمر بن سليمان الراجحي',
    instructorEn: 'Dr. Omar Al-Rajhi',
    lectureRoom: 'CCIS - معمل 108',
    color: '#4D6C37',
    totalLectures: 30,
    attendedLectures: 25,
    missedLectures: 5, // 16.6% (Warning approaching)
  },
  {
    id: 'swe312',
    code: 'SWE 312',
    nameAr: 'هندسة البرمجيات وبناء النظم',
    nameEn: 'Software Engineering & System Modeling',
    creditHours: 3,
    major: 'swe',
    level: 7,
    instructorAr: 'د. فيصل بن ناصر الدوسري',
    instructorEn: 'Dr. Faisal Al-Dossari',
    lectureRoom: 'CCIS - قاعة 302',
    color: '#C59A3F',
    totalLectures: 30,
    attendedLectures: 29,
    missedLectures: 1, // 3.3%
  },
  {
    id: 'cs380',
    code: 'CS 380',
    nameAr: 'أسس الذكاء الاصطناعي',
    nameEn: 'Artificial Intelligence Fundamentals',
    creditHours: 3,
    major: 'cs',
    level: 7,
    instructorAr: 'د. هدى بنت صالح العتيبي',
    instructorEn: 'Dr. Huda Al-Otaibi',
    lectureRoom: 'CCIS - معمل الذكاء 212',
    color: '#1A365D',
    totalLectures: 30,
    attendedLectures: 24,
    missedLectures: 6, // 20.0% (Urgent warning! 1 missed away from 25% DN)
  },
  {
    id: 'it241',
    code: 'IT 241',
    nameAr: 'تطوير تطبيقات الويب السحابية',
    nameEn: 'Cloud & Web App Development',
    creditHours: 3,
    major: 'it',
    level: 6,
    instructorAr: 'أ. طارق بن عبد الرحمن السعدون',
    instructorEn: 'Eng. Tariq Al-Saadoun',
    lectureRoom: 'CCIS - معمل البرمجة 115',
    color: '#0F4D3A',
    totalLectures: 30,
    attendedLectures: 30,
    missedLectures: 0, // 0%
  }
];

export const initialAcademicFiles: AcademicFile[] = [
  {
    id: 'file-1',
    titleAr: 'سلايدات المحاضرة 4: أشجار البحث الثنائية وتوازن AVL',
    titleEn: 'Lecture 4: Binary Search Trees & AVL Balance',
    courseCode: 'CS 211',
    courseName: 'Data Structures & Algorithms',
    major: 'cs',
    category: 'lectures',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    uploadDate: '2026-11-04',
    uploadedByAr: 'د. خالد بن فهد الشمري (أستاذ المقرر)',
    uploadedByEn: 'Dr. Khalid Al-Shammari (Instructor)',
    downloadCount: 142,
    isOffline: true,
    sharingLevel: 'public',
    allowDownload: true,
    allowComments: true,
    contentPages: [
      `CS 211: Data Structures - Lecture 4
Title: Binary Search Trees (BST) & Balanced AVL Trees
University: Majmaah University | College of Computer and Information Sciences (CCIS)

1. Introduction to Binary Search Trees (BST):
A Binary Search Tree is a node-based binary tree data structure with the following invariant:
- The left subtree of a node contains only nodes with keys lesser than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both left and right subtrees must also be binary search trees.

Time Complexity Analysis:
- Search / Lookup: Average O(log n), Worst Case O(n) when skewed.
- Insertion: Average O(log n), Worst Case O(n).
- Deletion: Average O(log n), Worst Case O(n).

Key Challenge: Skewed trees degrade into linked lists with O(n) operations!`,

      `2. AVL Tree Invariants & Self-Balancing Mechanism:
Named after Soviet inventors Adelson-Velsky and Landis (1962).
An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees (the Balance Factor) cannot be more than 1 for all nodes.

Balance Factor Formula:
BalanceFactor(Node) = Height(LeftSubtree) - Height(RightSubtree)
Permissible Balance Factors: {-1, 0, +1}

Rotations used to restore balance:
1. LL Rotation (Single Right Rotation): When node is inserted into left subtree of left child.
2. RR Rotation (Single Left Rotation): When node is inserted into right subtree of right child.
3. LR Rotation (Left-Right Double Rotation): Left rotate child, then right rotate node.
4. RL Rotation (Right-Left Double Rotation): Right rotate child, then left rotate node.`,

      `3. Majmaah CCIS Practical Lab Exercise:
Implementation guidelines in C++ / Java:
- Always compute height dynamically or store height in the Node structure:
struct Node {
    int key;
    Node* left;
    Node* right;
    int height;
};

Exam Alert:
Prepare for mid-term question on tracing LL and RL rotations step-by-step with tree diagrams!`
    ]
  },
  {
    id: 'file-2',
    titleAr: 'ملخص شامل: معايير تسوية قواعد البيانات العلائقية (1NF إلى BCNF)',
    titleEn: 'Comprehensive Summary: Relational Normalization (1NF to BCNF)',
    courseCode: 'IS 311',
    courseName: 'Advanced Database Systems',
    major: 'is',
    category: 'summaries',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    uploadDate: '2026-11-08',
    uploadedByAr: 'ريماس أبوحيمد (طالبة متميزة)',
    uploadedByEn: 'Remas Abuhimed (Top Student)',
    downloadCount: 98,
    isOffline: false,
    sharingLevel: 'public',
    allowDownload: true,
    allowComments: true,
    contentPages: [
      `IS 311: Advanced Database Systems - Normalization Guide
College of Computer and Information Sciences | Majmaah University

Why Normalization Matters:
Normalization minimizes data redundancy, prevents insertion, update, and deletion anomalies, and enforces relational integrity.

Step-by-Step Normal Forms:
1. First Normal Form (1NF):
- Each column must contain atomic (indivisible) values.
- No repeating groups or arrays within a row.
- Unique primary key identifies each tuple.

2. Second Normal Form (2NF):
- Must be in 1NF.
- No partial functional dependency: all non-key attributes must be fully functionally dependent on the entire primary key.`,

      `3. Third Normal Form (3NF):
- Must be in 2NF.
- No transitive dependency: non-prime attributes must not depend on other non-prime attributes (X -> Y where neither is candidate key).

4. Boyce-Codd Normal Form (BCNF):
- A stricter version of 3NF.
- For every functional dependency X -> Y, X must be a superkey of the relation.

Tip for Majmaah Exam:
Always find Candidate Keys first using attribute closure before classifying normal form level!`
    ]
  },
  {
    id: 'file-3',
    titleAr: 'سلايدات المنهج: دورات حياة تطوير البرمجيات السريعة (Agile & Scrum)',
    titleEn: 'Course Slides: Agile & Scrum Framework in Software Engineering',
    courseCode: 'SWE 312',
    courseName: 'Software Engineering & System Modeling',
    major: 'swe',
    category: 'lectures',
    fileType: 'ppt',
    fileSize: '5.1 MB',
    uploadDate: '2026-10-25',
    uploadedByAr: 'د. فيصل بن ناصر الدوسري',
    uploadedByEn: 'Dr. Faisal Al-Dossari',
    downloadCount: 84,
    isOffline: true,
    sharingLevel: 'classmates',
    allowDownload: true,
    allowComments: true,
    contentPages: [
      `SWE 312: Software Engineering - Sprint Planning & Agile Mindset
Department of Software Engineering, Majmaah University

Core Agile Values (The Agile Manifesto):
1. Individuals and interactions over processes and tools.
2. Working software over comprehensive documentation.
3. Customer collaboration over contract negotiation.
4. Responding to change over following a plan.

Scrum Framework Roles:
- Product Owner: Defines vision, manages and prioritizes the Product Backlog.
- Scrum Master: Facilitator, removes impediments, ensures team follows agile practices.
- Development Team: Cross-functional, self-organizing creators of the increment.`,

      `Scrum Artifacts & Ceremonies:
Artifacts:
1. Product Backlog (List of all desired features).
2. Sprint Backlog (Subset of items chosen for the 2-4 week sprint).
3. Increment (Potentially shippable product increment).

Ceremonies:
- Sprint Planning Meeting
- Daily Standup (15-minute sync)
- Sprint Review (Demonstration to stakeholders)
- Sprint Retrospective (Continuous team improvement)`
    ]
  },
  {
    id: 'file-5',
    titleAr: 'دليل ومواصفات تسليم مشروع التخرج للفصل الأول 1448هـ',
    titleEn: 'Graduation Project 1 Guidelines & Deliverable Template',
    courseCode: 'CS 491',
    courseName: 'Graduation Project 1',
    major: 'cs',
    category: 'assignments',
    fileType: 'doc',
    fileSize: '1.5 MB',
    uploadDate: '2026-10-18',
    uploadedByAr: 'لجنة مشاريع التخرج - كلية علوم الحاسب',
    uploadedByEn: 'Graduation Project Committee - CCIS',
    downloadCount: 310,
    isOffline: true,
    sharingLevel: 'public',
    allowDownload: true,
    allowComments: false,
    contentPages: [
      `Majmaah University - College of Computer and Information Sciences
Official Guidelines for Capstone Project 1 (GP1)

Submission Deadlines:
- Phase 1: Proposal & Scope Definition (Week 4)
- Phase 2: Software Requirements Specification SRS (Week 8)
- Phase 3: Architectural Design & Wireframes (Week 12)
- Final Presentation & Defense before Department Panel (Week 15)

Evaluation Criteria:
1. Technical Novelty & Relevance to Saudi Vision 2030 (20%)
2. Rigorous Requirement Engineering & System Architecture (30%)
3. Working Prototype / Feasibility Demo (30%)
4. Documentation Quality & Oral Defense Presentation (20%)`
    ]
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-cs211',
    titleAr: 'اختبار تجريبي ذكي: تراكيب البيانات وخوارزميات الأشجار المتوازنة (AVL)',
    titleEn: 'Smart Practice Quiz: Data Structures & AVL Balanced Trees',
    courseCode: 'CS 211',
    questions: [
      {
        id: 'q1',
        questionAr: 'ما هو أقصى فارق ارتفاع مسموح به بين الشجرة الفرعية اليمنى واليسرى في شجرة AVL؟',
        questionEn: 'What is the maximum allowed height difference (Balance Factor) between left and right subtrees in an AVL tree?',
        optionsAr: ['0 فقط', '1 أو -1 أو 0', '2 أو -2', 'أي قيمة إذا كانت الشجرة ثنائية'],
        optionsEn: ['0 only', '1, -1, or 0', '2 or -2', 'Any value if binary'],
        correctAnswer: 1,
        explanationAr: 'في شجرة AVL، يجب أن يكون معامل التوازن (Balance Factor) لأي عقدة مساوياً لـ 0 أو 1 أو -1. إذا وصل إلى 2 أو -2 يلزم إجراء دوران لإعادة التوازن.',
        explanationEn: 'In an AVL tree, the Balance Factor of any node must strictly be 0, +1, or -1. A balance factor of ±2 triggers rebalancing rotations.'
      },
      {
        id: 'q2',
        questionAr: 'ما هو التعقيد الزمني لعملية البحث في أسوأ الحالات (Worst-case) لشجرة البحث الثنائية العادية غير المتوازنة؟',
        questionEn: 'What is the worst-case time complexity of searching in an unbalanced standard Binary Search Tree?',
        optionsAr: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        optionsEn: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 2,
        explanationAr: 'إذا كانت الشجرة الثنائية العادية منحرفة (Skewed) في خط واحد، فإنها تتحول إلى قائمة خطية Linked List ويكون زمن البحث O(n).',
        explanationEn: 'When a standard BST is skewed into a straight line, it behaves like a linked list with worst-case search complexity O(n).'
      },
      {
        id: 'q3',
        questionAr: 'عند إدراج عنصر جديد في الشجرة الفرعية اليمنى للابن الأيسر، ما نوع الدوران المطلوب لإعادة التوازن؟',
        questionEn: 'When inserting a node into the right subtree of the left child, which rotation restores AVL balance?',
        optionsAr: ['دوران مفرد لليمين (LL)', 'دوران مزدوج يسار ثم يمين (LR)', 'دوران مفرد لليسار (RR)', 'دوران مزدوج يمين ثم يسار (RL)'],
        optionsEn: ['Single Right (LL)', 'Double Left-Right (LR)', 'Single Left (RR)', 'Double Right-Left (RL)'],
        correctAnswer: 1,
        explanationAr: 'حالة Left-Right (LR) تتطلب إجراء دوران مزدوج: دوران لليسار على الابن أولاً ثم دوران لليمين على العقدة الأم.',
        explanationEn: 'A Left-Right (LR) imbalance requires a double rotation: left rotate the child, then right rotate the parent.'
      }
    ]
  },
  {
    id: 'quiz-is311',
    titleAr: 'اختبار تجريبي ذكي: معايير تسوية قواعد البيانات (Normalization)',
    titleEn: 'Smart Practice Quiz: Database Normalization (1NF to BCNF)',
    courseCode: 'IS 311',
    questions: [
      {
        id: 'q1',
        questionAr: 'ما هو الشرط الأساسي الذي يجب تحقيقه لتكون العلاقة في الصيغة المعيارية الثانية (2NF)؟',
        questionEn: 'What is the primary condition required for a relation to be in Second Normal Form (2NF)?',
        optionsAr: [
          'أن تكون في 1NF وألا تحتوي على اعتماديات جزئية على المفتاح الأساسي',
          'أن تحتوي على مفتاح خارجي واحد على الأقل',
          'أن تكون جميع السمات أرقاماً صحيحة',
          'ألا تحتوي على قيم مفقودة NULL'
        ],
        optionsEn: [
          'Be in 1NF and have no partial dependencies on the candidate key',
          'Have at least one foreign key',
          'All attributes must be integers',
          'Contain no NULL values'
        ],
        correctAnswer: 0,
        explanationAr: 'الصيغة المعيارية الثانية (2NF) تشترط أن تكون في 1NF، وأن تعتمد جميع الصفات غير المفتاحية اعتماداً كلياً على كامل المفتاح الأساسي وليس على جزء منه.',
        explanationEn: '2NF requires 1NF and no partial dependencies: every non-prime attribute must depend on the whole candidate key.'
      },
      {
        id: 'q2',
        questionAr: 'الاعتماد الانتقالي (Transitive Dependency) يظهر عندما تكون العلاقة: X -> Y و Y -> Z، في أي صيغة يتم التخلص منه؟',
        questionEn: 'Transitive dependency occurs when X -> Y and Y -> Z. Which normal form eliminates it?',
        optionsAr: ['1NF', '2NF', '3NF', '0NF'],
        optionsEn: ['1NF', '2NF', '3NF', '0NF'],
        correctAnswer: 2,
        explanationAr: 'الصيغة المعيارية الثالثة (3NF) تزيل الاعتماد الانتقالي بين الصفات غير الرئيسية.',
        explanationEn: 'Third Normal Form (3NF) strictly eliminates transitive functional dependencies.'
      }
    ]
  }
];

export const officialMajmaahRules = [
  {
    id: 'rule-gpa',
    titleAr: 'نظام تقدير الدرجات والمعدل التراكمي (مقياس 5.00)',
    titleEn: 'Grading Scale & GPA Calculation (5.00 Scale)',
    contentAr: 'تعتمد جامعة المجمعة سلم درجات من 5.00: أ+ (95-100% = 5.00)، أ (90-94% = 4.75)، ب+ (85-89% = 4.50)، ب (80-84% = 4.00)، ج+ (75-79% = 3.50)، ج (70-74% = 3.00)، د+ (65-69% = 2.50)، د (60-64% = 2.00)، هـ (أقل من 60% = 1.00). تمنح مرتبة الشرف الأولى لمن يحقق معدلاً من 4.75 إلى 5.00، والثانية من 4.25 إلى 4.74.',
    contentEn: 'Majmaah University calculates GPA on a 5.00 scale: A+ (95-100%=5.00), A (90-94%=4.75), B+ (85-89%=4.50), B (80-84%=4.00), C+ (75-79%=3.50), C (70-74%=3.00), D+ (65-69%=2.50), D (60-64%=2.00), F (<60%=1.00). First honors are awarded for 4.75-5.00, second honors for 4.25-4.74.'
  },
  {
    id: 'rule-dn',
    titleAr: 'لائحة الغياب والحرمان من دخول الاختبار النهائي (DN)',
    titleEn: 'Absence & Denial Policy (DN Status at 25%)',
    contentAr: 'يحرم الطالب من الاستمرار في المقرر ودخول الاختبار النهائي إذا زادت نسبة غيابه عن 25% من مجموع الساعات التدريسية المحددة للمقرر دون عذر مقبول لدى مجلس الكلية، ويرصد له تقدير (محروم - DN).',
    contentEn: 'A student is denied from sitting for the final exam and receives a (DN - Denied) grade if unexcused absences exceed 25% of total scheduled lecture hours.'
  },
  {
    id: 'rule-drop',
    titleAr: 'ضوابط وإجراءات الحذف والإضافة والاعتذار عن الفصل',
    titleEn: 'Add/Drop, Course Withdrawal, & Semester Apology',
    contentAr: 'تحدد عمادة القبول والتسجيل بجامعة المجمعة فترة الحذف والإضافة خلال الأسبوع الأول من الفصل عبر البوابة الأكاديمية (إكاديميا). يجوز للطالب الاعتذار عن مقرر بحد أقصى قبل نهاية الأسبوع العاشر ويرصد له تقدير (ع - W) دون التأثير على معدله التراكمي.',
    contentEn: 'Add/Drop takes place in Week 1 via the EDUGATE portal. Course withdrawal is permitted until the end of Week 10, receiving a (W) grade with no impact on cumulative GPA.'
  },
  {
    id: 'rule-internship',
    titleAr: 'متطلبات التدريب التعاوني (Cooperative Training) لطلاب الحاسب',
    titleEn: 'CCIS Cooperative Training Requirements',
    contentAr: 'يشترط لتسجيل مقرر التدريب التعاوني في كلية علوم الحاسب والمعلومات إتمام 90 ساعة معتمدة بنجاح وموافقة المرشد الأكاديمي، ويمتد التدريب لمدة فصل دراسي كامل لدى جهة تدريبية معتمدة.',
    contentEn: 'Registration for Cooperative Training requires completion of at least 90 credit hours with academic advisor approval, lasting one full semester at an accredited host organization.'
  }
];

export const upcomingTasks: TaskItem[] = [
  {
    id: 't1',
    titleAr: 'تسليم التقرير العملي الثاني: موازنة أشجار AVL بلغة C++',
    titleEn: 'Lab Report 2: AVL Tree Balancing in C++',
    courseCode: 'CS 211',
    dueDate: '2026-11-16',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 't2',
    titleAr: 'حل واجب تصميم مخطط الكيانات والعلاقات ERD لمشروع المشفى',
    titleEn: 'ERD Modeling Homework: Hospital Management System',
    courseCode: 'IS 311',
    dueDate: '2026-11-19',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 't3',
    titleAr: 'مراجعة خوارزميات البحث التجريبي A* للاختبار الفصلي الثاني',
    titleEn: 'Review A* Search Heuristics for Midterm 2',
    courseCode: 'CS 380',
    dueDate: '2026-11-22',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 't4',
    titleAr: 'تسليم مخطط واجهات المستخدم UI/UX لمشروع تخرج 1',
    titleEn: 'Submit UI/UX Wireframes for Capstone Project 1',
    courseCode: 'CS 491',
    dueDate: '2026-11-28',
    priority: 'high',
    status: 'todo',
  }
];

export const academicCalendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    titleAr: 'بدء الاختبارات الفصلية الثانية (Midterm 2)',
    titleEn: 'Midterm Exam Period 2 Starts',
    type: 'exam',
    date: '2026-11-22',
    time: '09:00 ص',
    location: 'قاعات مبنى كلية الحاسب (المجمعة)',
    courseCode: 'CCIS'
  },
  {
    id: 'e2',
    titleAr: 'آخر موعد للاعتذار عن الفصل الدراسي الأول 1448هـ',
    titleEn: 'Deadline for Semester Withdrawal (Apology)',
    type: 'academic',
    date: '2026-11-26',
    time: '11:59 م',
    location: 'البوابة الأكاديمية - جامعة المجمعة',
  },
  {
    id: 'e3',
    titleAr: 'محاضرة مراجعة تفاعلية: خوارزميات الذكاء الاصطناعي',
    titleEn: 'Interactive Review Session: AI Search Strategies',
    type: 'lecture',
    date: '2026-11-17',
    time: '10:00 ص',
    location: 'قاعة السمينار 201 - كلية الحاسب',
    courseCode: 'CS 380'
  },
  {
    id: 'e4',
    titleAr: 'معرض مشاريع التخرج والابتكار الطلابي السنوي (رقيم)',
    titleEn: 'Annual Raqeem Student Capstone & Innovation Expo',
    type: 'academic',
    date: '2026-12-10',
    time: '09:00 ص',
    location: 'البهو الرئيسي - جامعة المجمعة',
    courseCode: 'CCIS'
  },
  {
    id: 'e5',
    titleAr: 'بدء الاختبارات النهائية للفصل الدراسي الأول 1448هـ',
    titleEn: 'Final Examinations Period Starts',
    type: 'exam',
    date: '2026-12-20',
    time: '08:30 ص',
    location: 'مجمع القاعات المركزية بجامعة المجمعة'
  }
];

