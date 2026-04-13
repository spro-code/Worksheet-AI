// Shared Zod schemas for AI-generated question validation.
// Imported by both the server route and the frontend engine.
// Designed to be permissive about fields Claude commonly omits or nullifies.

import { z } from 'zod';

// Coerce null → undefined for optional string fields Claude sometimes nullifies
const optStr = z.string().nullish().transform((v) => v ?? undefined);
const optNum = z.number().nullish().transform((v) => v ?? undefined);
const optBool = z.boolean().nullish().transform((v) => v ?? undefined);

export const AnswerOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  isCorrect: optBool,
  imageUrl: optStr,
});

export const MatchingPairSchema = z.object({
  id: z.string().optional(),
  left: z.string(),
  right: z.string(),
});

export const ImageSpecSchema = z.object({
  operation: z.enum([
    'multiplication', 'division', 'addition', 'subtraction',
    'fraction', 'counting', 'comparison',
    'diagram', 'timeline', 'map', 'scene',
    'generic',
  ]).catch('generic'),   // unknown operation values → 'generic' instead of crashing
  num1: optNum,
  num2: optNum,
  objectEmoji: optStr,
  objectLabel: optStr,
}).nullish().transform((v) => v ?? undefined);

export const QuestionSchema = z.object({
  id: z.string().optional(),          // we replace with nanoid() anyway
  type: z.enum([
    'multiple_choice', 'short_answer', 'paragraph', 'checkbox',
    'image_question', 'fill_blank', 'matching', 'ordering', 'true_false',
  ]),
  text: z.string(),
  hint: optStr,
  explanation: optStr,
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).nullish()
    .transform((v) => v ?? undefined),
  points: optNum,
  options: z.array(AnswerOptionSchema).nullish().transform((v) => v ?? undefined),
  blanks: z.array(z.string()).nullish().transform((v) => v ?? undefined),
  pairs: z.array(MatchingPairSchema).nullish().transform((v) => v ?? undefined),
  items: z.array(z.string()).nullish().transform((v) => v ?? undefined),
  answerKey:   optStr,
  imagePrompt: optStr,   // natural language image description (for future real image gen)
  imageUrl:    optStr,
  imageSpec:   ImageSpecSchema,
});

export const WorksheetSchema = z.array(QuestionSchema);

export type RawQuestion = z.infer<typeof QuestionSchema>;
