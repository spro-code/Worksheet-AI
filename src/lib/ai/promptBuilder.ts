// Builds a subject-specific, archetype-aware Claude prompt for question generation.

import type { AIGenerationSettings } from '../../types';
import type { QuestionArchetype, SubjectDomain } from './questionArchetypes';
import { planImages } from './imagePlanner';

export interface PromptContext {
  settings: AIGenerationSettings;
  domain: SubjectDomain;
  archetype: QuestionArchetype;
}

/**
 * Generates a deterministic, round-robin question type plan.
 *
 * planQuestions(6, ["multiple_choice", "fill_blank", "short_answer"])
 * → ["multiple_choice", "fill_blank", "short_answer",
 *    "multiple_choice", "fill_blank", "short_answer"]
 */
export function planQuestions(questionCount: number, allowedTypes: string[]): string[] {
  if (!allowedTypes.length) return Array(questionCount).fill('multiple_choice');
  return Array.from({ length: questionCount }, (_, i) => allowedTypes[i % allowedTypes.length]);
}

function resolveAllowedTypes(ctx: PromptContext): string[] {
  const { settings, archetype } = ctx;
  const { questionTypes, includeImages } = settings;

  if (includeImages === true) {
    return ['image_question'];
  }

  let types: string[];
  if (questionTypes?.length) {
    types = [...questionTypes];
  } else {
    types = [...archetype.preferredTypes];
  }

  if (includeImages === 'mixed' && !types.includes('image_question')) {
    types.push('image_question');
  }

  return types.slice(0, 4);
}

function imageDirective(settings: AIGenerationSettings): string {
  if (settings.includeImages === true) return `ALL questions must be type "image_question".`;
  if (settings.includeImages === 'mixed') return `Roughly half the questions should be "image_question". Alternate: image, non-image, image, non-image.`;
  return `Do NOT use "image_question" type.`;
}

function domainRules(domain: SubjectDomain, topic: string, gradeLevel: string, abilityLevel: string): string {
  switch (domain) {
    case 'math':
      return `
MATH RULES:
- Every question must involve a real mathematical operation (addition, subtraction, multiplication, division, fractions, geometry, etc.).
- Word problems must contain numbers and a clear calculation task.
- Do NOT generate language/reading questions — no essays, no grammar, no vocabulary.
- Difficulty must match ${gradeLevel} ${abilityLevel}: use numbers and concepts appropriate for that level.`;

    case 'english':
    case 'hindi':
    case 'bengali':
    case 'language':
      return `
LANGUAGE RULES:
- Questions must test reading comprehension, grammar, vocabulary, or writing skills.
- Do NOT generate math or science questions.
- Use age-appropriate language. Short, clear sentences.`;

    case 'physics':
    case 'chemistry':
    case 'biology':
    case 'science':
      return `
SCIENCE RULES:
- All questions must be about the specific science concept: "${topic}".
- Include a mix of conceptual understanding and application questions.
- Do NOT mix in history, geography, or language questions.`;

    case 'history':
      return `
HISTORY RULES:
- All questions must relate to the specific historical topic: "${topic}".
- Include causes, effects, key figures, dates, and significance.
- Do NOT generate geography or science questions.`;

    case 'geography':
      return `
GEOGRAPHY RULES:
- All questions must relate to the geographic topic: "${topic}".
- Include facts about locations, physical features, climate, or cultures as relevant.
- Do NOT generate history or science questions.`;

    default:
      return '';
  }
}

export function buildPrompt(ctx: PromptContext): string {
  const { settings, domain, archetype } = ctx;
  const { topic, gradeLevel, abilityLevel = 'Developing', questionCount = 8, includeImages } = settings;

  const allowedTypes = resolveAllowedTypes(ctx);
  const plan = planQuestions(questionCount, allowedTypes);
  const questionPlan = plan.map((t, i) => `${i + 1}. ${t}`).join('\n');

  const imagePlan = planImages(domain, archetype);
  const imageSpec = includeImages ? imagePlan.specInstructions : '';

  return `You are an expert special education worksheet creator.

TASK: Generate exactly ${questionCount} worksheet questions about "${topic}" for ${gradeLevel} students at the ${abilityLevel} level.

SUBJECT DOMAIN: ${domain.toUpperCase()}
ARCHETYPE: ${archetype.label} — ${archetype.description}

QUESTION PLAN (follow this exact order and type for each question):
${questionPlan}

${imageDirective(settings)}
${imageSpec}
${domainRules(domain, topic, gradeLevel, abilityLevel)}

GENERAL RULES FOR ALL QUESTIONS:
- Every question must clearly relate to "${topic}". Zero off-topic questions.
- Language and difficulty must match ${gradeLevel} ${abilityLevel} level — simple vocabulary, short sentences.
- multiple_choice / true_false / image_question: exactly one option with isCorrect: true, rest false. Provide 4 options.
- fill_blank: "blanks" array with the correct answer word(s).
- matching: "pairs" array with 3–4 pairs.
- short_answer: "answerKey" with the expected answer.
- "hint": a short helpful clue (required on every question).
- "difficulty": "beginner" | "intermediate" | "advanced"
- "points": 1 for beginner, 2 for intermediate, 3 for advanced`;
}
