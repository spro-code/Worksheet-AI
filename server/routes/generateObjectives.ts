import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return text.trim();
}

const BodySchema = z.object({
  topic: z.string(),
  gradeLevel: z.string(),
  abilityLevel: z.string().optional(),
});

export async function generateObjectivesRoute(req: Request, res: Response): Promise<void> {
  const parseResult = BodySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const { topic, gradeLevel, abilityLevel } = parseResult.data;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Generate 4-5 measurable learning objectives for a "${topic}" worksheet for ${gradeLevel} students (${abilityLevel || 'Developing'} level, special education context).\n\nStart each with an action verb. Return ONLY a JSON array of strings.`,
      }],
    });

    const raw = extractJSON((message.content[0] as { type: string; text: string }).text);
    const objectives = JSON.parse(raw) as string[];
    res.json({ objectives });
  } catch (err) {
    console.error('[generateObjectives] Failed:', err);
    res.status(500).json({ error: 'Failed to generate objectives', objectives: [] });
  }
}
