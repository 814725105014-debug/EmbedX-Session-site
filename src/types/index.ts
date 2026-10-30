// ====================================================================
// EMBEDX INTERACTIVE - TYPE DEFINITIONS
// Embedded Systems & Automation Club, SRM TRP Engineering College
// ====================================================================

export type UserRole = 'super_admin' | 'club_admin' | 'presenter' | 'participant';

export type QuestionType =
  | 'multiple_choice'
  | 'word_cloud'
  | 'quiz'
  | 'open_ended'
  | 'qa'
  | 'rating_scale'
  | 'ranking'
  | 'true_false'
  | 'survey';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  color?: string;
}

export interface SlideSettings {
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  allowMultiple?: boolean;
  maxEntriesPerUser?: number;
  theme?: string;
}

export interface Slide {
  id: string;
  orderIndex: number;
  type: QuestionType;
  title: string;
  description?: string;
  options?: AnswerOption[];
  timerSeconds?: number;
  points?: number;
  speedBonus?: boolean;
  settings?: SlideSettings;
  backgroundUrl?: string;
}

export interface Presentation {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  theme: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  code: string;
  presentationId: string;
  presentationTitle: string;
  hostName: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  currentSlideIndex: number;
  currentSlideId: string;
  votingLocked: boolean;
  showResults: boolean;
  quizTimerSeconds: number | null;
  startedAt: string;
  endedAt: string | null;
  presentationData: Presentation;
}

export interface Participant {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  joinedAt: string;
}

export interface ResponseRecord {
  participantId: string;
  nickname: string;
  timestamp: string;
  optionId?: string;
  text?: string;
  rating?: number;
  ranks?: string[];
  pointsAwarded?: number;
  isCorrect?: boolean;
  responseTimeMs?: number;
}

export interface QAQuestion {
  id: string;
  participantId: string;
  nickname: string;
  text: string;
  upvotes: number;
  voters: string[];
  isAnswered: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  coverColor: string;
  slides: Slide[];
}

export interface SessionReportSummary {
  id: string;
  code: string;
  title: string;
  hostName: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  totalParticipants: number;
  totalResponses: number;
  totalSlides: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department: string;
  college: string;
}

