import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { WorksheetSchema } from '../../src/lib/ai/schemas.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Worksheet serialiser ─────────────────────────────────────────────────────
interface QuestionLike {
  type: string;
  text: string;
  options?: Array<{ text: string; isCorrect?: boolean | null }>;
  blanks?: string[];
  answerKey?: string;
  hint?: string;
  pairs?: Array<{ left: string; right: string }>;
  items?: string[];
}

interface WorksheetLike {
  title: string;
  subject: string;
  gradeLevel: string;
  abilityLevel?: string;
  sections: Array<{ title: string; questions: QuestionLike[] }>;
}

function serializeWorksheet(ws: WorksheetLike): string {
  const questions = ws.sections.flatMap((s) => s.questions);
  const lines: string[] = [
    `Title: ${ws.title}`,
    `Subject: ${ws.subject} | Grade: ${ws.gradeLevel}${ws.abilityLevel ? ` | Ability: ${ws.abilityLevel}` : ''}`,
    `Total questions: ${questions.length}`,
    '',
  ];
  questions.forEach((q, i) => {
    lines.push(`Q${i + 1} [${q.type}]: ${q.text}`);
    if (q.options?.length) q.options.forEach((o) => lines.push(`  ${o.isCorrect ? '✓' : '○'} ${o.text}`));
    if (q.blanks?.length)  lines.push(`  Answer: ${q.blanks.join(', ')}`);
    if (q.answerKey)       lines.push(`  Answer: ${q.answerKey}`);
    if (q.hint)            lines.push(`  Hint: ${q.hint}`);
    if (q.pairs?.length)   q.pairs.forEach((p) => lines.push(`  ${p.left} ↔ ${p.right}`));
    if (q.items?.length)   lines.push(`  Items: ${q.items.join(' | ')}`);
  });
  return lines.join('\n');
}

// ─── System prompt ────────────────────────────────────────────────────────────
// OUTPUT SCHEMA removed — now enforced by the submit_response tool definition.
const SYSTEM_PROMPT = `You are an AI worksheet editor inside a special education worksheet tool.

ROLE: You directly modify, transform, and improve worksheets that are already open in the editor.

CRITICAL RULES:
- The worksheet in "CURRENT WORKSHEET" is already open. NEVER ask the teacher to paste it again.
- Make changes immediately. Only ask for clarification if a critical detail is truly missing.
- Default to MODIFY mode for any editing request.
- Infer grade level, subject, and format from the current worksheet when not specified.
- Be action-oriented. Skip preamble like "Sure!" or "I can help with that."
- responseMessage: 2 sentences max. Describe what you changed, not what you are about to do.

INTENT TYPES:
- modify_existing_worksheet — general edits, rewrites, restructuring
- simplify_existing_worksheet — easier language, shorter sentences, simpler vocabulary
- convert_format — e.g. MCQ → short answer, questions → reading passage
- reduce_question_count — keep the best N, remove the rest
- add_visual_support — change appropriate questions to image_question type
- change_grade_level — rewrite all text for a different grade
- create_new_worksheet — teacher explicitly wants a brand new worksheet
- answer_question — informational question, no worksheet change needed

COMMON REQUESTS — handle directly without follow-up:
- "make it easier/harder" → rewrite questions at appropriate difficulty
- "simplify language" → shorten sentences, simpler vocabulary, same questions
- "reduce to N questions" → keep best N
- "add more questions" → add questions matching existing style
- "turn into a reading passage" → merge topic, generate comprehension questions
- "change to 6th grade" → rewrite all text for that grade level
- "convert MCQ to short answer" → change types, update answer fields
- "add visual support" → change appropriate questions to image_question type

QUESTION FORMAT in updatedWorksheet:
- Required on every question: type, text, hint, difficulty (beginner|intermediate|advanced), points (1/2/3)
- multiple_choice / true_false / image_question: "options" array, exactly one isCorrect:true, 4 options
- fill_blank: "blanks" array with correct answer(s)
- short_answer / paragraph: "answerKey" string
- matching: "pairs" array [{"id":"p1","left":"...","right":"..."}]
- ordering: "items" array
- updatedWorksheet.sections must contain the FULL updated question list`;

// ─── Tool definition ──────────────────────────────────────────────────────────
const SUBMIT_RESPONSE_TOOL: Anthropic.Tool = {
  name: 'submit_response',
  description: 'Submit the worksheet assistant response with optional worksheet updates.',
  input_schema: {
    type: 'object',
    properties: {
      intent: {
        type: 'string',
        enum: [
          'modify_existing_worksheet', 'simplify_existing_worksheet', 'convert_format',
          'reduce_question_count', 'add_visual_support', 'change_grade_level',
          'create_new_worksheet', 'answer_question',
        ],
      },
      responseMessage: { type: 'string' },
      assumptions: { type: 'array', items: { type: 'string' } },
      updatedWorksheet: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
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
                      text:       { type: 'string' },
                      hint:       { type: 'string' },
                      difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                      points:     { type: 'number' },
                      answerKey:  { type: 'string' },
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
              required: ['title', 'questions'],
            },
          },
        },
      },
    },
    required: ['intent', 'responseMessage'],
  },
};

// ─── Request schema ───────────────────────────────────────────────────────────
const ConversationMessageSchema = z.object({
  role:    z.enum(['user', 'assistant']),
  content: z.string(),
});

const RequestBodySchema = z.object({
  message:             z.string(),
  worksheet:           z.any().optional(),
  conversationHistory: z.array(ConversationMessageSchema).optional(),
});

const UpdatedSectionSchema = z.object({
  title:     z.string().default('Questions'),
  questions: WorksheetSchema,
});

const AssistantResponseSchema = z.object({
  intent:           z.string(),
  responseMessage:  z.string(),
  updatedWorksheet: z.object({
    title:    z.string().optional(),
    sections: z.array(UpdatedSectionSchema).optional(),
  }).nullish(),
  assumptions: z.array(z.string()).nullish(),
});

// ─── Route handler ────────────────────────────────────────────────────────────
export async function worksheetChatRoute(req: Request, res: Response): Promise<void> {
  const parseResult = RequestBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const { message, worksheet, conversationHistory = [] } = parseResult.data;

  const worksheetBlock = worksheet
    ? `CURRENT WORKSHEET:\n${serializeWorksheet(worksheet as WorksheetLike)}\n\n`
    : '';
  const userContent = `${worksheetBlock}TEACHER REQUEST: ${message}`;

  const historyMessages = conversationHistory.slice(-6).map((m) => ({
    role:    m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    const response = await client.messages.create({
      model:       'claude-sonnet-4-5',
      max_tokens:  4000,
      system:      SYSTEM_PROMPT,
      tools:       [SUBMIT_RESPONSE_TOOL],
      tool_choice: { type: 'tool', name: 'submit_response' },
      messages:    [
        ...historyMessages,
        { role: 'user', content: userContent },
      ],
    });

    const toolBlock = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );

    if (!toolBlock) {
      res.json({ intent: 'answer_question', responseMessage: 'I had trouble processing that. Please try again.', updatedWorksheet: null, assumptions: [] });
      return;
    }

    const validated = AssistantResponseSchema.safeParse(toolBlock.input);
    if (!validated.success) {
      console.error('[worksheetChat] Response schema invalid:', validated.error.issues);
      const fallback = toolBlock.input as Record<string, unknown>;
      res.json({
        intent:           fallback.intent ?? 'answer_question',
        responseMessage:  typeof fallback.responseMessage === 'string' ? fallback.responseMessage : 'Done.',
        updatedWorksheet: null,
        assumptions:      [],
      });
      return;
    }

    res.json(validated.data);
  } catch (err) {
    console.error('[worksheetChat] Failed:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
}
