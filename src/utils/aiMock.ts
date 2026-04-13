import type { AIGenerationSettings, WorksheetTheme, Worksheet } from '../types';
import { generateQuestionsV2 } from '../lib/ai/worksheetEngine';

// ─── Worksheet Chat ────────────────────────────────────────────────────────

export interface WorksheetChatResponse {
  intent: string;
  responseMessage: string;
  updatedWorksheet?: {
    title?: string;
    sections?: Array<{ title: string; questions: unknown[] }>;
  } | null;
  assumptions?: string[] | null;
}

export async function getWorksheetChatResponse(
  message: string,
  worksheet: Worksheet | null | undefined,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<WorksheetChatResponse> {
  const res = await fetch('/api/worksheetChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, worksheet, conversationHistory }),
  });
  if (!res.ok) {
    return { intent: 'answer_question', responseMessage: 'Sorry, something went wrong.', updatedWorksheet: null };
  }
  return res.json() as Promise<WorksheetChatResponse>;
}

// Re-export the engine as the canonical generateQuestions function
export { generateQuestionsV2 as generateQuestions };

// ─── Learning Objectives ───────────────────────────────────────────────────

export async function generateObjectives(topic: string, gradeLevel: string, abilityLevel?: string): Promise<string[]> {
  const res = await fetch('/api/generateObjectives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, gradeLevel, abilityLevel }),
  });

  if (!res.ok) return [];
  const { objectives } = await res.json() as { objectives: string[] };
  return objectives;
}

// ─── AI Chat ───────────────────────────────────────────────────────────────

export async function getAIChatResponse(userMessage: string, worksheetContext: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, worksheetContext }),
  });

  if (!res.ok) return 'Sorry, something went wrong.';
  const { text } = await res.json() as { text: string };
  return text;
}

// ─── Theme colors ──────────────────────────────────────────────────────────

export function getThemeColors(theme: WorksheetTheme): {
  header: string; accent: string; card: string; text: string; border: string;
} {
  const themes = {
    playful:          { header: 'from-violet-500 to-pink-500',   accent: 'bg-violet-500', card: 'bg-white border-violet-100',  text: 'text-violet-700', border: 'border-violet-200' },
    fun_friendly:     { header: 'from-orange-400 to-yellow-400', accent: 'bg-orange-400', card: 'bg-white border-orange-100',  text: 'text-orange-700', border: 'border-orange-200' },
    serious_academic: { header: 'from-blue-600 to-indigo-600',   accent: 'bg-blue-600',   card: 'bg-white border-blue-100',   text: 'text-blue-700',   border: 'border-blue-200'   },
    minimal:          { header: 'from-gray-600 to-gray-700',     accent: 'bg-gray-600',   card: 'bg-white border-gray-200',   text: 'text-gray-700',   border: 'border-gray-300'   },
    colorful:         { header: 'from-pink-500 to-cyan-500',     accent: 'bg-pink-500',   card: 'bg-white border-pink-100',   text: 'text-pink-700',   border: 'border-pink-200'   },
    illustrated:      { header: 'from-emerald-500 to-teal-500',  accent: 'bg-emerald-500',card: 'bg-white border-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200'},
    calm_focus:       { header: 'from-sky-400 to-blue-400',      accent: 'bg-sky-400',    card: 'bg-white border-sky-100',    text: 'text-sky-700',    border: 'border-sky-200'    },
  };
  return themes[theme] || themes.playful;
}
