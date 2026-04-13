import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BodySchema = z.object({
  message: z.string(),
  worksheetContext: z.string().optional(),
});

export async function chatRoute(req: Request, res: Response): Promise<void> {
  const parseResult = BodySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const { message, worksheetContext } = parseResult.data;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `You are an AI assistant helping a special education teacher modify a worksheet.${worksheetContext ? ` Context: ${worksheetContext}.` : ''} Be concise. 2-3 sentences max unless listing items.`,
      messages: [{ role: 'user', content: message }],
    });

    const text = (response.content[0] as { type: string; text: string }).text;
    res.json({ text });
  } catch (err) {
    console.error('[chat] Failed:', err);
    res.status(500).json({ error: 'Chat failed', text: 'Sorry, something went wrong.' });
  }
}
