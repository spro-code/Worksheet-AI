export type QuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'paragraph'
  | 'checkbox'
  | 'image_question'
  | 'fill_blank'
  | 'matching'
  | 'ordering'
  | 'true_false';

export type WorksheetTheme =
  | 'playful'
  | 'fun_friendly'
  | 'serious_academic'
  | 'minimal'
  | 'colorful'
  | 'illustrated'
  | 'calm_focus';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  imageUrl?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;  // natural language image description for future real image generation
  hint?: string;
  explanation?: string;
  difficulty?: DifficultyLevel;
  goal?: string;
  required?: boolean;
  points?: number;
  // For multiple choice / checkbox / true_false
  options?: AnswerOption[];
  // For fill in the blank
  blanks?: string[];
  // For matching
  pairs?: MatchingPair[];
  // For ordering
  items?: string[];
  // For short answer / paragraph
  answerKey?: string;
}

export interface WorksheetSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Worksheet {
  id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevel: string;
  abilityLevel?: string;
  theme: WorksheetTheme;
  sections: WorksheetSection[];
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  isLiked?: boolean;
  authorName?: string;
  tags?: string[];
  assignedCount?: number;
  stateStandard?: string;
  timeLimit?: number; // minutes, undefined = untimed
  timerEnabled?: boolean;
  shuffleQuestions?: boolean;
  retryAttempts?: number;
  attachedGoalId?: string;
  status: 'draft' | 'published' | 'assigned';
  imageUrl?: string;
}

export interface AIGenerationStep {
  step: number;
  totalSteps: number;
  type: 'topic' | 'question_types' | 'visuals' | 'settings' | 'preview';
}

export interface AIGenerationSettings {
  source: 'manual' | 'iep_goals' | 'video_url' | 'website_url' | 'document' | 'text_prompt';
  topic?: string;
  subject?: string;
  gradeLevel?: string;
  abilityLevel?: string;
  questionTypes?: QuestionType[];
  includeImages?: boolean | 'mixed';
  questionCount?: number;
  difficulty?: DifficultyLevel;
  theme?: WorksheetTheme;
  stateStandard?: string;
  prompt?: string;
  url?: string;
  iepGoalId?: string;
}

export interface AssignSettings {
  assignTo: 'individual' | 'group' | 'caseload';
  studentIds?: string[];
  groupId?: string;
  dueDate?: Date;
  timeLimit?: number;
  retryAttempts?: number;
  shuffleQuestions?: boolean;
}

export type AppView =
  | 'library'
  | 'marketplace'
  | 'caseload'
  | 'create_method'
  | 'ai_generate'
  | 'build_scratch'
  | 'import_doc'
  | 'editor'
  | 'assign';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
