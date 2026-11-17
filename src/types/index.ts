export type MajorType = 'cs' | 'it' | 'is' | 'swe';

export type AcademicLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StudentProfile {
  id: string;
  studentId: string; // e.g. 421105824
  nameAr: string;
  nameEn: string;
  email: string;
  collegeAr: string;
  collegeEn: string;
  major: MajorType;
  level: AcademicLevel;
  gpa: number;
  creditHoursCompleted: number;
  totalCreditHours: number;
  academicStandingAr: string;
  academicStandingEn: string;
  avatarUrl?: string;
  joinedYear: string;
  advisorNameAr: string;
  advisorNameEn: string;
}

export interface Course {
  id: string;
  code: string; // e.g. CS 211
  nameAr: string;
  nameEn: string;
  creditHours: number;
  major: MajorType;
  level: AcademicLevel;
  instructorAr: string;
  instructorEn: string;
  lectureRoom: string;
  color: string;
  totalLectures: number;
  attendedLectures: number;
  missedLectures: number;
}

export type FileCategory = 'lectures' | 'labs' | 'summaries' | 'assignments';

export interface AcademicFile {
  id: string;
  titleAr: string;
  titleEn: string;
  courseCode: string;
  courseName: string;
  major: MajorType;
  category: FileCategory;
  fileType: 'pdf' | 'doc' | 'ppt' | 'notes';
  fileSize: string;
  uploadDate: string;
  uploadedByAr: string;
  uploadedByEn: string;
  downloadCount: number;
  isOffline: boolean;
  sharingLevel: 'public' | 'classmates' | 'private';
  allowDownload: boolean;
  allowComments: boolean;
  contentSnippet?: string;
  contentPages?: string[]; // simulated pages for reading & annotation
}

export interface DocumentAnnotation {
  id: string;
  fileId: string;
  pageNumber: number;
  type: 'highlight' | 'note' | 'drawing';
  color: string;
  text?: string;
  comment?: string;
  canvasDataUrl?: string; // for drawing
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctAnswer: number;
  explanationAr: string;
  explanationEn: string;
}

export interface Quiz {
  id: string;
  titleAr: string;
  titleEn: string;
  courseCode: string;
  questions: QuizQuestion[];
}

export interface TaskItem {
  id: string;
  titleAr: string;
  titleEn: string;
  courseCode: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
}

export interface CalendarEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'exam' | 'assignment' | 'lecture' | 'holiday' | 'academic';
  date: string;
  time?: string;
  location?: string;
  courseCode?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  contentAr: string;
  contentEn: string;
  timestamp: string;
  sources?: string[];
  quizPrompt?: boolean;
}

