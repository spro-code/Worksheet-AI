import { create } from 'zustand';
import type { AppView, Worksheet, Question, ChatMessage, AIGenerationSettings } from '../types';
import { MOCK_WORKSHEETS, PUBLIC_WORKSHEETS } from '../data/mockData';
import { nanoid } from '../utils/nanoid';

interface WorksheetStore {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Library
  myWorksheets: Worksheet[];
  publicWorksheets: Worksheet[];
  likedWorksheetIds: Set<string>;

  // Active worksheet being edited
  activeWorksheet: Worksheet | null;
  setActiveWorksheet: (ws: Worksheet | null) => void;
  editorContext: 'default' | 'caseload';
  setEditorContext: (ctx: 'default' | 'caseload') => void;
  caseloadReturnTab: string;
  setCaseloadReturnTab: (tab: string) => void;

  // AI Generation
  aiSettings: AIGenerationSettings | null;
  setAISettings: (s: AIGenerationSettings) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  // AI Chat sidebar
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  seedChatFromGeneration: (topic: string, objectives: string[]) => void;
  clearChat: () => void;
  isChatLoading: boolean;
  setChatLoading: (v: boolean) => void;

  // Selected question in editor
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;

  // Actions
  createWorksheet: (ws: Partial<Worksheet>) => Worksheet;
  updateWorksheet: (id: string, updates: Partial<Worksheet>) => void;
  deleteWorksheet: (id: string) => void;
  duplicateWorksheet: (id: string) => void;
  toggleLike: (id: string) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  addQuestion: (sectionId?: string, type?: import('../types').QuestionType) => void;
  duplicateQuestion: (questionId: string) => void;
  deleteQuestion: (questionId: string) => void;
  reorderQuestions: (sectionId: string, fromIndex: number, toIndex: number) => void;
}

export const useWorksheetStore = create<WorksheetStore>((set, get) => ({
  currentView: 'library',
  setCurrentView: (view) => set({ currentView: view }),

  myWorksheets: MOCK_WORKSHEETS,
  publicWorksheets: PUBLIC_WORKSHEETS,
  likedWorksheetIds: new Set(['w2']),

  activeWorksheet: null,
  setActiveWorksheet: (ws) => set({ activeWorksheet: ws }),
  editorContext: 'default',
  setEditorContext: (ctx) => set({ editorContext: ctx }),
  caseloadReturnTab: 'Worksheets',
  setCaseloadReturnTab: (tab) => set({ caseloadReturnTab: tab }),

  aiSettings: null,
  setAISettings: (s) => set({ aiSettings: s }),
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),

  chatMessages: [],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...msg, id: nanoid(), timestamp: new Date() },
      ],
    })),
  seedChatFromGeneration: (topic, objectives) => set({
    chatMessages: [
      { id: nanoid(), role: 'user', content: `Generate a worksheet about: ${topic}`, timestamp: new Date() },
      { id: nanoid(), role: 'assistant', content: `I've generated the following learning objectives for **${topic}**:\n\n${objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nYour worksheet is ready! I've created questions aligned to these objectives. Feel free to ask me to adjust difficulty, add scaffolding, or modify any questions.`, timestamp: new Date() },
    ],
  }),
  clearChat: () => set({ chatMessages: [] }),
  isChatLoading: false,
  setChatLoading: (v) => set({ isChatLoading: v }),

  selectedQuestionId: null,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),

  createWorksheet: (partial) => {
    const ws: Worksheet = {
      id: nanoid(),
      title: partial.title || 'Untitled Worksheet',
      description: partial.description || '',
      subject: partial.subject || 'Math',
      gradeLevel: partial.gradeLevel || '3rd Grade',
      theme: partial.theme || 'playful',
      sections: partial.sections || [{
        id: nanoid(),
        title: 'Section 1',
        questions: [],
      }],
      questionCount: partial.questionCount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      status: 'draft',
      ...partial,
    };
    set((state) => ({ myWorksheets: [ws, ...state.myWorksheets] }));
    return ws;
  },

  updateWorksheet: (id, updates) =>
    set((state) => ({
      myWorksheets: state.myWorksheets.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
      ),
      activeWorksheet:
        state.activeWorksheet?.id === id
          ? { ...state.activeWorksheet, ...updates, updatedAt: new Date() }
          : state.activeWorksheet,
    })),

  deleteWorksheet: (id) =>
    set((state) => ({
      myWorksheets: state.myWorksheets.filter((w) => w.id !== id),
      activeWorksheet: state.activeWorksheet?.id === id ? null : state.activeWorksheet,
    })),

  duplicateWorksheet: (id) => {
    const ws = get().myWorksheets.find((w) => w.id === id);
    if (!ws) return;
    const copy: Worksheet = {
      ...ws,
      id: nanoid(),
      title: `${ws.title} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };
    set((state) => ({ myWorksheets: [copy, ...state.myWorksheets] }));
  },

  toggleLike: (id) =>
    set((state) => {
      const liked = new Set(state.likedWorksheetIds);
      if (liked.has(id)) liked.delete(id);
      else liked.add(id);
      return { likedWorksheetIds: liked };
    }),

  updateQuestion: (questionId, updates) =>
    set((state) => {
      if (!state.activeWorksheet) return {};
      const sections = state.activeWorksheet.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      }));
      const updated = { ...state.activeWorksheet, sections, updatedAt: new Date() };
      return {
        activeWorksheet: updated,
        myWorksheets: state.myWorksheets.map((w) =>
          w.id === updated.id ? updated : w
        ),
      };
    }),

  addQuestion: (sectionId, type = 'multiple_choice') =>
    set((state) => {
      if (!state.activeWorksheet) return {};
      const newQ: Question = {
        id: nanoid(),
        type,
        text: '',
        options: (type === 'multiple_choice' || type === 'checkbox') ? [
          { id: nanoid(), text: '', isCorrect: true },
          { id: nanoid(), text: '', isCorrect: false },
          { id: nanoid(), text: '', isCorrect: false },
          { id: nanoid(), text: '', isCorrect: false },
        ] : type === 'true_false' ? [
          { id: nanoid(), text: 'True', isCorrect: true },
          { id: nanoid(), text: 'False', isCorrect: false },
        ] : undefined,
        pairs: type === 'matching' ? [
          { id: nanoid(), left: '', right: '' },
          { id: nanoid(), left: '', right: '' },
          { id: nanoid(), left: '', right: '' },
        ] : undefined,
        items: type === 'ordering' ? ['', '', ''] : undefined,
        blanks: type === 'fill_blank' ? [''] : undefined,
        required: true,
        points: 1,
        difficulty: 'intermediate',
      };
      let currentSections = state.activeWorksheet.sections;
      // Auto-create a section if none exist
      if (currentSections.length === 0) {
        currentSections = [{ id: nanoid(), title: 'Section 1', questions: [] }];
      }
      const targetSectionId = sectionId || currentSections[0]?.id;
      const sections = currentSections.map((sec) =>
        sec.id === targetSectionId
          ? { ...sec, questions: [...sec.questions, newQ] }
          : sec
      );
      const total = sections.reduce((sum, s) => sum + s.questions.length, 0);
      const updated = { ...state.activeWorksheet, sections, questionCount: total, updatedAt: new Date() };
      return {
        activeWorksheet: updated,
        selectedQuestionId: newQ.id,
        myWorksheets: state.myWorksheets.map((w) =>
          w.id === updated.id ? updated : w
        ),
      };
    }),

  duplicateQuestion: (questionId) =>
    set((state) => {
      if (!state.activeWorksheet) return {};
      const sections = state.activeWorksheet.sections.map((sec) => {
        const idx = sec.questions.findIndex((q) => q.id === questionId);
        if (idx === -1) return sec;
        const original = sec.questions[idx];
        const copy: Question = {
          ...original,
          id: nanoid(),
          options: original.options?.map((o) => ({ ...o, id: nanoid() })),
          pairs: original.pairs?.map((p) => ({ ...p, id: nanoid() })),
          items: original.items ? [...original.items] : undefined,
          blanks: original.blanks ? [...original.blanks] : undefined,
        };
        const qs = [...sec.questions];
        qs.splice(idx + 1, 0, copy);
        return { ...sec, questions: qs };
      });
      const total = sections.reduce((sum, s) => sum + s.questions.length, 0);
      const updated = { ...state.activeWorksheet, sections, questionCount: total, updatedAt: new Date() };
      return {
        activeWorksheet: updated,
        myWorksheets: state.myWorksheets.map((w) => w.id === updated.id ? updated : w),
      };
    }),

  deleteQuestion: (questionId) =>
    set((state) => {
      if (!state.activeWorksheet) return {};
      const sections = state.activeWorksheet.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.filter((q) => q.id !== questionId),
      }));
      const total = sections.reduce((sum, s) => sum + s.questions.length, 0);
      const updated = { ...state.activeWorksheet, sections, questionCount: total, updatedAt: new Date() };
      return {
        activeWorksheet: updated,
        selectedQuestionId: null,
        myWorksheets: state.myWorksheets.map((w) =>
          w.id === updated.id ? updated : w
        ),
      };
    }),

  reorderQuestions: (sectionId, fromIndex, toIndex) =>
    set((state) => {
      if (!state.activeWorksheet) return {};
      const sections = state.activeWorksheet.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const qs = [...sec.questions];
        const [moved] = qs.splice(fromIndex, 1);
        qs.splice(toIndex, 0, moved);
        return { ...sec, questions: qs };
      });
      const updated = { ...state.activeWorksheet, sections, updatedAt: new Date() };
      return {
        activeWorksheet: updated,
        myWorksheets: state.myWorksheets.map((w) =>
          w.id === updated.id ? updated : w
        ),
      };
    }),
}));
