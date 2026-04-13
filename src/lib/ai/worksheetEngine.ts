// Frontend engine — builds no prompts, calls no AI directly.
// Sends AIGenerationSettings to the backend API route and
// post-processes the returned questions (SVG image generation).

import type { Question, AIGenerationSettings } from '../../types';
import { nanoid } from '../../utils/nanoid';
import { buildQuestionImage } from '../../utils/questionImages';
import type { RawQuestion } from './schemas';

export async function generateQuestionsV2(settings: AIGenerationSettings): Promise<Question[]> {
  const res = await fetch('/api/generateWorksheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Server error ${res.status}`);
  }

  const { questions: raw }: { questions: RawQuestion[] } = await res.json();

  // Post-process: assign fresh IDs and build SVG images client-side
  return raw.map((q, index) => {
    const { imageSpec, imagePrompt, ...rest } = q;
    const question: Question = { ...rest, id: nanoid() };

    if (imagePrompt) question.imagePrompt = imagePrompt;

    if (q.type === 'image_question') {
      question.imageUrl = buildQuestionImage(imageSpec ?? null, q.text, index);
    }

    return question;
  });
}
