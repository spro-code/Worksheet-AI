import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';
import { z } from 'zod';
import { routeSubject, pickArchetype } from '../../src/lib/ai/subjectRouter.js';
import { buildPrompt } from '../../src/lib/ai/promptBuilder.js';
import { WorksheetSchema } from '../../src/lib/ai/schemas.js';
import type { AIGenerationSettings } from '../../src/types/index.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Session cache (10 min TTL) ───────────────────────────────────────────────
const cache = new Map<string, { questions: unknown[]; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000;

function cacheKey(s: AIGenerationSettings): string {
  return createHash('sha1')
    .update(JSON.stringify({
      topic: s.topic,
      subject: s.subject,
      gradeLevel: s.gradeLevel,
      abilityLevel: s.abilityLevel,
      questionCount: s.questionCount,
      difficulty: s.difficulty,
      includeImages: s.includeImages,
      questionTypes: [...(s.questionTypes ?? [])].sort(),
    }))
    .digest('hex');
}

// ─── Tool definition ──────────────────────────────────────────────────────────
// Claude is forced to call this tool — guarantees structured output, no regex needed.
const SUBMIT_QUESTIONS_TOOL: Anthropic.Tool = {
  name: 'submit_questions',
  description: 'Submit the generated worksheet questions as structured data.',
  input_schema: {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                'multiple_choice', 'short_answer', 'paragraph', 'checkbox',
                'image_question', 'fill_blank', 'matching', 'ordering', 'true_false',
              ],
            },
            text:        { type: 'string' },
            hint:        { type: 'string' },
            explanation: { type: 'string' },
            difficulty:  { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            points:      { type: 'number' },
            answerKey:   { type: 'string' },
            imagePrompt: {
              type: 'string',
              description: 'Natural language description of an illustration for this question (image_question only). E.g. "a child counting 5 red apples on a wooden table, bright flat illustration".',
            },
            imageSpec: {
              type: 'object',
              description: 'SVG rendering fallback spec (image_question only).',
              properties: {
                operation: {
                  type: 'string',
                  enum: [
                    'multiplication', 'division', 'addition', 'subtraction',
                    'fraction', 'counting', 'comparison',
                    'diagram', 'timeline', 'map', 'scene', 'generic',
                  ],
                },
                num1:        { type: 'number' },
                num2:        { type: 'number' },
                objectEmoji: { type: 'string' },
                objectLabel: { type: 'string' },
              },
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id:        { type: 'string' },
                  text:      { type: 'string' },
                  isCorrect: { type: 'boolean' },
                },
                required: ['text'],
              },
            },
            blanks: { type: 'array', items: { type: 'string' } },
            pairs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id:    { type: 'string' },
                  left:  { type: 'string' },
                  right: { type: 'string' },
                },
                required: ['left', 'right'],
              },
            },
            items: { type: 'array', items: { type: 'string' } },
          },
          required: ['type', 'text'],
        },
      },
    },
    required: ['questions'],
  },
};

// ─── Request schema ───────────────────────────────────────────────────────────
const SettingsSchema = z.object({
  topic:         z.string().optional(),
  subject:       z.string().optional(),
  gradeLevel:    z.string().optional(),
  abilityLevel:  z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  includeImages: z.union([z.boolean(), z.literal('mixed')]).optional(),
  questionCount: z.number().optional(),
  difficulty:    z.string().optional(),
  source:        z.string().optional(),
});

export async function generateWorksheetRoute(req: Request, res: Response): Promise<void> {
  const parseResult = SettingsSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid request body', details: parseResult.error.issues });
    return;
  }

  const settings = parseResult.data as AIGenerationSettings;
  const topic      = settings.topic      ?? 'General';
  const gradeLevel = settings.gradeLevel ?? 'Elementary';

  // ── Cache check ───────────────────────────────────────────────────────────
  const key = cacheKey(settings);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log('[generateWorksheet] Cache hit');
    res.json({ questions: cached.questions });
    return;
  }

  try {
    const { domain, archetypes } = routeSubject(topic, settings.subject);
    const archetype = pickArchetype(archetypes, topic);
    const prompt    = buildPrompt({ settings: { ...settings, topic, gradeLevel }, domain, archetype });

    const message = await client.messages.create({
      model:       'claude-sonnet-4-5',
      max_tokens:  4000,
      tools:       [SUBMIT_QUESTIONS_TOOL],
      tool_choice: { type: 'tool', name: 'submit_questions' },
      messages:    [{ role: 'user', content: prompt }],
    });

    // tool_choice forces exactly one tool_use block — no regex, no fences
    const toolBlock = message.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );

    if (!toolBlock) {
      console.error('[generateWorksheet] No tool_use block returned');
      res.status(422).json({ error: 'AI returned no structured output', questions: [] });
      return;
    }

    const raw = (toolBlock.input as { questions: unknown[] }).questions;
    const result = WorksheetSchema.safeParse(raw);

    if (!result.success) {
      console.error('[generateWorksheet] Validation errors:', JSON.stringify(result.error.issues, null, 2));
      res.status(422).json({ error: 'AI returned malformed response', questions: [] });
      return;
    }

    cache.set(key, { questions: result.data, ts: Date.now() });
    res.json({ questions: result.data });
  } catch (err) {
    console.error('[generateWorksheet] Generation failed:', err);
    res.status(500).json({ error: 'Generation failed', questions: [] });
  }
}
