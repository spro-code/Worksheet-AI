import type { Worksheet, WorksheetTheme } from '../types';

export const THEMES: Record<WorksheetTheme, {
  label: string; colors: string; emoji: string; description: string;
  // Canvas background
  canvasBg: string;
  // Question card
  cardBorder: string;
  cardSelectedBorder: string;
  cardSelectedRing: string;
  cardSelectedBg: string;
  // Number badge on card
  badgeBg: string;
  badgeText: string;
  // Section divider text
  sectionText: string;
  // Add question button
  addBtn: string;
  addBtnHover: string;
  // Hint text
  hintText: string;
  // Correct answer dot
  correctBg: string;
  correctBorder: string;
  // Header accent dot
  accentDot: string;
}> = {
  playful: {
    label: 'Playful', colors: 'bg-gray-900', emoji: '🎉',
    description: 'Bright & fun for younger learners',
    canvasBg: 'bg-gray-50',
    cardBorder: 'border-gray-100', cardSelectedBorder: 'border-gray-900',
    cardSelectedRing: 'ring-gray-100', cardSelectedBg: 'bg-gray-50',
    badgeBg: 'bg-gray-100', badgeText: 'text-gray-900',
    sectionText: 'text-gray-900',
    addBtn: 'border-gray-200 text-gray-700 bg-white/80',
    addBtnHover: 'hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50',
    hintText: 'text-gray-900', correctBg: 'bg-gray-900', correctBorder: 'border-gray-900',
    accentDot: 'bg-gray-700',
  },
  fun_friendly: {
    label: 'Fun & Friendly', colors: 'bg-orange-400', emoji: '😊',
    description: 'Warm tones, approachable feel',
    canvasBg: 'bg-orange-50/60',
    cardBorder: 'border-orange-100', cardSelectedBorder: 'border-orange-400',
    cardSelectedRing: 'ring-orange-100', cardSelectedBg: 'bg-orange-50/30',
    badgeBg: 'bg-orange-100', badgeText: 'text-orange-600',
    sectionText: 'text-orange-600',
    addBtn: 'border-orange-200 text-orange-500 bg-white/80',
    addBtnHover: 'hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50',
    hintText: 'text-orange-600', correctBg: 'bg-orange-400', correctBorder: 'border-orange-400',
    accentDot: 'bg-orange-400',
  },
  serious_academic: {
    label: 'Serious Academic', colors: 'bg-blue-500', emoji: '📚',
    description: 'Clean, formal, focused',
    canvasBg: 'bg-blue-50/40',
    cardBorder: 'border-blue-100', cardSelectedBorder: 'border-blue-500',
    cardSelectedRing: 'ring-blue-100', cardSelectedBg: 'bg-blue-50/30',
    badgeBg: 'bg-blue-100', badgeText: 'text-blue-700',
    sectionText: 'text-blue-700',
    addBtn: 'border-blue-200 text-blue-500 bg-white/80',
    addBtnHover: 'hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50',
    hintText: 'text-blue-600', correctBg: 'bg-blue-600', correctBorder: 'border-blue-600',
    accentDot: 'bg-blue-500',
  },
  minimal: {
    label: 'Minimal', colors: 'bg-gray-500', emoji: '⬜',
    description: 'Low distraction, clean layout',
    canvasBg: 'bg-gray-50',
    cardBorder: 'border-gray-200', cardSelectedBorder: 'border-gray-500',
    cardSelectedRing: 'ring-gray-100', cardSelectedBg: 'bg-gray-50/50',
    badgeBg: 'bg-gray-100', badgeText: 'text-gray-600',
    sectionText: 'text-gray-500',
    addBtn: 'border-gray-300 text-gray-500 bg-white',
    addBtnHover: 'hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50',
    hintText: 'text-gray-500', correctBg: 'bg-gray-600', correctBorder: 'border-gray-600',
    accentDot: 'bg-gray-500',
  },
  colorful: {
    label: 'Colorful', colors: 'bg-pink-500', emoji: '🌈',
    description: 'High energy, vibrant palette',
    canvasBg: 'bg-pink-50/50',
    cardBorder: 'border-pink-100', cardSelectedBorder: 'border-pink-400',
    cardSelectedRing: 'ring-pink-100', cardSelectedBg: 'bg-pink-50/30',
    badgeBg: 'bg-pink-100', badgeText: 'text-pink-600',
    sectionText: 'text-pink-600',
    addBtn: 'border-pink-200 text-pink-500 bg-white/80',
    addBtnHover: 'hover:border-pink-400 hover:text-pink-700 hover:bg-pink-50',
    hintText: 'text-pink-600', correctBg: 'bg-pink-500', correctBorder: 'border-pink-500',
    accentDot: 'bg-pink-400',
  },
  illustrated: {
    label: 'Illustrated', colors: 'bg-emerald-500', emoji: '🎨',
    description: 'With illustrations & visuals',
    canvasBg: 'bg-emerald-50/50',
    cardBorder: 'border-emerald-100', cardSelectedBorder: 'border-emerald-500',
    cardSelectedRing: 'ring-emerald-100', cardSelectedBg: 'bg-emerald-50/30',
    badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700',
    sectionText: 'text-emerald-700',
    addBtn: 'border-emerald-200 text-emerald-600 bg-white/80',
    addBtnHover: 'hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50',
    hintText: 'text-emerald-600', correctBg: 'bg-emerald-500', correctBorder: 'border-emerald-500',
    accentDot: 'bg-emerald-400',
  },
  calm_focus: {
    label: 'Calm Focus', colors: 'bg-sky-400', emoji: '🧘',
    description: 'Soft, calming for sensory needs',
    canvasBg: 'bg-sky-50/50',
    cardBorder: 'border-sky-100', cardSelectedBorder: 'border-sky-400',
    cardSelectedRing: 'ring-sky-100', cardSelectedBg: 'bg-sky-50/30',
    badgeBg: 'bg-sky-100', badgeText: 'text-sky-700',
    sectionText: 'text-sky-700',
    addBtn: 'border-sky-200 text-sky-500 bg-white/80',
    addBtnHover: 'hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50',
    hintText: 'text-sky-600', correctBg: 'bg-sky-500', correctBorder: 'border-sky-500',
    accentDot: 'bg-sky-400',
  },
};

export const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade',
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade',
  '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'Adult Education',
];

export const ABILITY_LEVELS = [
  'Pre-academic', 'Foundational', 'Emerging', 'Developing', 'Grade-level', 'Advanced',
];

export const SUBJECTS = [
  'Math', 'Reading', 'Writing', 'Science', 'Social Studies',
  'Life Skills', 'Social-Emotional', 'Communication', 'Fine Motor', 'Gross Motor',
  'Vocational', 'Behavior', 'Other',
];

export const MOCK_WORKSHEETS: Worksheet[] = [
  {
    id: 'w1',
    title: 'Multiplication Basics – Grade 3',
    description: 'Practice multiplication facts from 1–10 with visual supports',
    subject: 'Math',
    gradeLevel: '3rd Grade',
    abilityLevel: 'Developing',
    theme: 'playful',
    sections: [],
    questionCount: 10,
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-28'),
    isPublic: false,
    tags: ['multiplication', 'math', 'grade-3'],
    status: 'published',
    imageUrl: '',
    authorName: 'Ms. Rodriguez',
  },
  {
    id: 'w2',
    title: 'Sight Words – Dolch List A',
    description: 'Early reading sight word recognition worksheet',
    subject: 'Reading',
    gradeLevel: '1st Grade',
    abilityLevel: 'Emerging',
    theme: 'fun_friendly',
    sections: [],
    questionCount: 15,
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-25'),
    isPublic: true,
    isLiked: true,
    tags: ['reading', 'sight-words', 'grade-1'],
    status: 'assigned',
    assignedCount: 5,
    authorName: 'Ms. Rodriguez',
  },
  {
    id: 'w3',
    title: 'Community Helpers – Life Skills',
    description: 'Identifying community helpers and their roles',
    subject: 'Life Skills',
    gradeLevel: '2nd Grade',
    abilityLevel: 'Foundational',
    theme: 'illustrated',
    sections: [],
    questionCount: 8,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-22'),
    isPublic: false,
    tags: ['life-skills', 'community'],
    status: 'draft',
    authorName: 'Ms. Rodriguez',
  },
  {
    id: 'w4',
    title: 'Emotions & Feelings',
    description: 'Social-emotional learning: identifying and naming emotions',
    subject: 'Social-Emotional',
    gradeLevel: 'Kindergarten',
    abilityLevel: 'Emerging',
    theme: 'calm_focus',
    sections: [],
    questionCount: 12,
    createdAt: new Date('2026-02-28'),
    updatedAt: new Date('2026-03-18'),
    isPublic: true,
    tags: ['SEL', 'emotions', 'feelings'],
    status: 'published',
    assignedCount: 12,
    authorName: 'Ms. Rodriguez',
  },
  {
    id: 'w5',
    title: 'Addition with Regrouping',
    description: '2-digit addition with carrying, scaffolded support',
    subject: 'Math',
    gradeLevel: '2nd Grade',
    abilityLevel: 'Developing',
    theme: 'colorful',
    sections: [],
    questionCount: 10,
    createdAt: new Date('2026-03-25'),
    updatedAt: new Date('2026-03-30'),
    isPublic: false,
    tags: ['math', 'addition', 'grade-2'],
    status: 'draft',
    authorName: 'Ms. Rodriguez',
  },
  {
    id: 'w6',
    title: 'Animal Classification',
    description: 'Mammals, reptiles, birds – matching and sorting',
    subject: 'Science',
    gradeLevel: '4th Grade',
    abilityLevel: 'Grade-level',
    theme: 'serious_academic',
    sections: [],
    questionCount: 14,
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-03-20'),
    isPublic: false,
    tags: ['science', 'animals', 'grade-4'],
    status: 'published',
    authorName: 'Ms. Rodriguez',
  },
];

export const PUBLIC_WORKSHEETS: Worksheet[] = [
  {
    id: 'p1',
    title: 'Number Bonds to 10',
    description: 'Visual number bonds with pictures for early math learners',
    subject: 'Math',
    gradeLevel: 'Kindergarten',
    abilityLevel: 'Emerging',
    theme: 'playful',
    sections: [],
    questionCount: 8,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-20'),
    isPublic: true,
    tags: ['math', 'number bonds', 'kindergarten'],
    status: 'published',
    assignedCount: 45,
    authorName: 'T. Johnson',
  },
  {
    id: 'p2',
    title: 'Social Skills: Taking Turns',
    description: 'Practice turn-taking scenarios with visual supports',
    subject: 'Social-Emotional',
    gradeLevel: '1st Grade',
    abilityLevel: 'Foundational',
    theme: 'fun_friendly',
    sections: [],
    questionCount: 10,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-02-10'),
    isPublic: true,
    tags: ['SEL', 'social skills', 'turn-taking'],
    status: 'published',
    assignedCount: 89,
    authorName: 'A. Patel',
  },
  {
    id: 'p3',
    title: 'Telling Time – Hour & Half Hour',
    description: 'Analog clock reading with illustrated clock faces',
    subject: 'Math',
    gradeLevel: '2nd Grade',
    abilityLevel: 'Developing',
    theme: 'illustrated',
    sections: [],
    questionCount: 12,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-30'),
    isPublic: true,
    tags: ['math', 'telling time', 'grade-2'],
    status: 'published',
    assignedCount: 128,
    authorName: 'B. Chen',
  },
  {
    id: 'p4',
    title: 'AAC Core Words Practice',
    description: 'Core vocabulary words with picture symbols for AAC users',
    subject: 'Communication',
    gradeLevel: 'Pre-K',
    abilityLevel: 'Pre-academic',
    theme: 'calm_focus',
    sections: [],
    questionCount: 6,
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-01-15'),
    isPublic: true,
    tags: ['AAC', 'communication', 'core words'],
    status: 'published',
    assignedCount: 203,
    authorName: 'SLP Team',
  },
];

export type GoalStatus = 'not_started' | 'behind' | 'on_track' | 'mastered';

export interface ProgressEntry {
  id: string;
  date: string;           // ISO date string
  value: number;          // e.g. percentage, count, score
  unit: string;           // e.g. '% accuracy', '/ 5 trials', 'wpm'
  note?: string;
  trialData?: { label: string; correct: boolean }[];
}

export interface IEPGoal {
  id: string;
  type: string;
  title: string;
  description: string;
  status: GoalStatus;
  tags: string[];
  archived?: boolean;
  targetDate?: string;
  masteryTarget?: string; // e.g. "80% accuracy across 3 sessions"
  progressEntries?: ProgressEntry[];
}

export const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: string; icon: string; color: string; bg: string; border: string }> = {
  not_started: { label: 'Not Started', icon: '⏳', color: 'text-gray-500',   bg: 'bg-gray-100',  border: 'border-gray-200'  },
  behind:      { label: 'Behind',      icon: '⚠️', color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'   },
  on_track:    { label: 'On Track',    icon: '✓',  color: 'text-[#1A8917]',  bg: 'bg-green-50',  border: 'border-green-200' },
  mastered:    { label: 'Mastered',    icon: '🏆', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'  },
};

export const MOCK_GOALS: IEPGoal[] = [
  {
    id: 'g1', type: 'Task Analysis', title: 'Improve Reading Fluency',
    description: 'Improve reading fluency to 80 wpm with 90% accuracy by end of semester.',
    status: 'mastered', tags: ['Reading', 'Fluency'],
    targetDate: 'Jun 2026', masteryTarget: '80 wpm with 90% accuracy across 3 sessions',
    progressEntries: [
      { id: 'p1', date: '2026-03-01', value: 55, unit: 'wpm', note: 'Baseline session', trialData: [{ label: 'T1', correct: true }, { label: 'T2', correct: false }, { label: 'T3', correct: true }] },
      { id: 'p2', date: '2026-03-08', value: 62, unit: 'wpm', note: 'Improved pace, some errors' },
      { id: 'p3', date: '2026-03-15', value: 70, unit: 'wpm', note: 'Good session', trialData: [{ label: 'T1', correct: true }, { label: 'T2', correct: true }, { label: 'T3', correct: false }] },
      { id: 'p4', date: '2026-03-22', value: 75, unit: 'wpm', note: 'Consistent improvement' },
      { id: 'p5', date: '2026-03-29', value: 81, unit: 'wpm', note: 'Mastery reached! 3rd consecutive session above target' },
    ],
  },
  {
    id: 'g2', type: 'Prompting Levels', title: 'Identify Main Idea',
    description: 'Identify main idea and 2 supporting details from grade-level text.',
    status: 'not_started', tags: ['Comprehension', 'Reading'],
    targetDate: 'Aug 2026', masteryTarget: '80% accuracy across 3 consecutive sessions',
    progressEntries: [],
  },
  {
    id: 'g3', type: 'Prompting Levels', title: '2-Digit Addition',
    description: 'Solve 2-digit addition problems with regrouping independently with 90% accuracy.',
    status: 'on_track', tags: ['Math', 'Addition'],
    targetDate: 'Jun 2026', masteryTarget: '90% accuracy, independent level',
    progressEntries: [
      { id: 'p6', date: '2026-03-05', value: 60, unit: '% accuracy', note: 'Needed verbal prompting' },
      { id: 'p7', date: '2026-03-19', value: 72, unit: '% accuracy', note: 'Reduced to gestural prompt' },
      { id: 'p8', date: '2026-04-02', value: 80, unit: '% accuracy', note: 'Nearly independent' },
    ],
  },
  {
    id: 'g4', type: 'Task Analysis', title: 'Social Greetings',
    description: 'Use appropriate social greetings in 4/5 observed opportunities across 3 consecutive sessions.',
    status: 'not_started', tags: ['Social', 'Communication'],
    targetDate: 'Sep 2026', masteryTarget: '4/5 opportunities, 3 consecutive sessions',
    progressEntries: [],
  },
  {
    id: 'g5', type: 'Prompting Levels', title: 'Follow Multi-Step Directions',
    description: 'Follow 3-step directions without adult prompting in 4 out of 5 trials.',
    status: 'behind', tags: ['Executive Function', 'Behavior'],
    targetDate: 'Jun 2026', masteryTarget: '4/5 trials independently',
    progressEntries: [
      { id: 'p9',  date: '2026-02-20', value: 2, unit: '/ 5 trials', note: 'Required full physical prompt' },
      { id: 'p10', date: '2026-03-06', value: 2, unit: '/ 5 trials', note: 'No change, verbal prompt needed' },
      { id: 'p11', date: '2026-03-20', value: 1, unit: '/ 5 trials', note: 'Regression — environmental factors' },
    ],
  },
  {
    id: 'g6', type: 'Task Analysis', title: 'Sentence Writing',
    description: 'Write complete sentences with correct capitalization and punctuation in 80% of writing samples.',
    status: 'not_started', tags: ['Writing', 'Literacy'],
    targetDate: 'Aug 2026', masteryTarget: '80% of writing samples, 3 sessions',
    progressEntries: [],
  },
  // Archived goals
  {
    id: 'g7', type: 'Prompting Levels', title: 'Letter Recognition A–M',
    description: 'Identify uppercase and lowercase letters A through M with 90% accuracy.',
    status: 'mastered', tags: ['Reading', 'Literacy'], archived: true,
    targetDate: 'Dec 2025', masteryTarget: '90% accuracy, 3 consecutive sessions',
    progressEntries: [
      { id: 'a1', date: '2025-09-10', value: 50, unit: '% accuracy' },
      { id: 'a2', date: '2025-10-01', value: 68, unit: '% accuracy' },
      { id: 'a3', date: '2025-10-22', value: 80, unit: '% accuracy' },
      { id: 'a4', date: '2025-11-12', value: 90, unit: '% accuracy', note: 'Mastered!' },
      { id: 'a5', date: '2025-11-26', value: 93, unit: '% accuracy', note: '2nd consecutive' },
      { id: 'a6', date: '2025-12-10', value: 91, unit: '% accuracy', note: 'Mastery confirmed' },
    ],
  },
  {
    id: 'g8', type: 'Task Analysis', title: 'Pencil Grip & Letter Formation',
    description: 'Demonstrate correct pencil grip and form letters legibly in 80% of writing tasks.',
    status: 'mastered', tags: ['Fine Motor', 'Writing'], archived: true,
    targetDate: 'Jan 2026', masteryTarget: '80% legible letters, correct grip',
    progressEntries: [
      { id: 'a7', date: '2025-10-05', value: 40, unit: '% correct' },
      { id: 'a8', date: '2025-11-03', value: 65, unit: '% correct' },
      { id: 'a9', date: '2025-12-01', value: 82, unit: '% correct', note: 'Mastery reached' },
    ],
  },
  {
    id: 'g9', type: 'Prompting Levels', title: 'Counting to 20',
    description: 'Count objects from 1 to 20 with one-to-one correspondence independently.',
    status: 'behind', tags: ['Math', 'Counting'], archived: true,
    targetDate: 'Mar 2026', masteryTarget: '90% accuracy, independent',
    progressEntries: [
      { id: 'a10', date: '2025-12-15', value: 55, unit: '% accuracy', note: 'Needed verbal support' },
      { id: 'a11', date: '2026-01-12', value: 60, unit: '% accuracy' },
      { id: 'a12', date: '2026-02-09', value: 58, unit: '% accuracy', note: 'Inconsistent' },
    ],
  },
];

export interface IEPProgram {
  id: string;
  name: string;
  description: string;
  area: string;             // e.g. 'Academic', 'Communication', 'Behavioral', 'Motor'
  accentColor: string;      // Tailwind color prefix, e.g. 'blue', 'emerald'
  goalIds: string[];
}

export const MOCK_PROGRAMS: IEPProgram[] = [
  {
    id: 'prog1',
    name: 'Literacy & Reading',
    description: 'Reading fluency, comprehension, and foundational literacy skills',
    area: 'Academic',
    accentColor: 'blue',
    goalIds: ['g1', 'g2', 'g7'],
  },
  {
    id: 'prog2',
    name: 'Mathematics',
    description: 'Number sense, computation, and mathematical reasoning',
    area: 'Academic',
    accentColor: 'emerald',
    goalIds: ['g3', 'g9'],
  },
  {
    id: 'prog3',
    name: 'Communication & Social Skills',
    description: 'Expressive language, social pragmatics, and peer interaction',
    area: 'Communication',
    accentColor: 'violet',
    goalIds: ['g4'],
  },
  {
    id: 'prog4',
    name: 'Executive Function & Behavior',
    description: 'Self-regulation, direction-following, and behavioral goals',
    area: 'Behavioral',
    accentColor: 'orange',
    goalIds: ['g5'],
  },
  {
    id: 'prog5',
    name: 'Written Language & Fine Motor',
    description: 'Handwriting, sentence construction, and written expression',
    area: 'Motor / Academic',
    accentColor: 'pink',
    goalIds: ['g6', 'g8'],
  },
];

export const QUESTION_TYPE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  multiple_choice: { label: 'Multiple Choice', emoji: '🔘', color: 'text-gray-900 bg-gray-50' },
  short_answer: { label: 'Short Answer', emoji: '✏️', color: 'text-blue-600 bg-blue-50' },
  paragraph: { label: 'Paragraph', emoji: '📝', color: 'text-indigo-600 bg-indigo-50' },
  checkbox: { label: 'Checkbox', emoji: '☑️', color: 'text-emerald-600 bg-emerald-50' },
  image_question: { label: 'Image Question', emoji: '🖼️', color: 'text-pink-600 bg-pink-50' },
  fill_blank: { label: 'Fill in the Blank', emoji: '⬜', color: 'text-orange-600 bg-orange-50' },
  matching: { label: 'Matching', emoji: '🔗', color: 'text-teal-600 bg-teal-50' },
  ordering: { label: 'Ordering', emoji: '📊', color: 'text-sky-600 bg-sky-50' },
  true_false: { label: 'True / False', emoji: '✅', color: 'text-rose-600 bg-rose-50' },
};
