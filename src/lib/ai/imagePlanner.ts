// Plans image instructions embedded in the Claude prompt.
// Tells Claude what to include for image_question types.

import type { SubjectDomain, QuestionArchetype } from './questionArchetypes';

export interface ImagePlan {
  specInstructions: string;
  isMathStyle: boolean;
}

// ─── Shared image prompt style guide ─────────────────────────────────────────
const STYLE_GUIDE = `flat vector illustration, bright colorful educational style, white background, no text overlays, suitable for children ages 6-12`;

// ─── Domain-specific instructions ─────────────────────────────────────────────

const MATH_IMAGE_INSTRUCTIONS = `
IMAGE QUESTION RULES (Math):
For every "image_question", include both fields:

1. "imagePrompt" — natural language description of what to illustrate.
   Example: "5 red apples arranged in a row on a table, ${STYLE_GUIDE}"
   The description must match the math operation in the question exactly.

2. "imageSpec" — SVG fallback spec:
   { "operation": <one of: multiplication|division|addition|subtraction|fraction|counting|comparison>,
     "num1": <first number>, "num2": <second number if applicable>,
     "objectEmoji": <single emoji>, "objectLabel": <plural noun> }

Steps: identify the operation → extract the numbers → pick the physical object.
The question text must be self-contained and answerable without the image.`;

const NONMATH_IMAGE_INSTRUCTIONS = (domain: SubjectDomain) => {
  const operationMap: Record<string, string> = {
    science: 'diagram', biology: 'diagram', physics: 'diagram', chemistry: 'diagram',
    history: 'timeline',
    geography: 'map',
    english: 'scene', hindi: 'scene', bengali: 'scene', language: 'scene',
  };
  const operation = operationMap[domain] ?? 'generic';

  const examples: Record<string, string> = {
    diagram:  `"a concept diagram showing photosynthesis with leaves, sunlight and water arrows, ${STYLE_GUIDE}"`,
    timeline: `"a historical timeline showing key events of the Indian independence movement, ${STYLE_GUIDE}"`,
    map:      `"a simple illustrated map of South Asia with mountain ranges and rivers, ${STYLE_GUIDE}"`,
    scene:    `"a child reading a book under a tree on a sunny day, ${STYLE_GUIDE}"`,
    generic:  `"an educational illustration related to the topic, ${STYLE_GUIDE}"`,
  };

  return `
IMAGE QUESTION RULES:
For every "image_question", include both fields:

1. "imagePrompt" — natural language description of what to illustrate.
   Example: ${examples[operation]}
   Make it specific to the question content.

2. "imageSpec" — SVG fallback spec:
   { "operation": "${operation}", "objectEmoji": <emoji>, "objectLabel": <short noun phrase> }

The question text must be self-contained and answerable without the image.`;
};

// ─── Entry point ──────────────────────────────────────────────────────────────

export function planImages(domain: SubjectDomain, archetype: QuestionArchetype): ImagePlan {
  if (domain === 'math') {
    return { specInstructions: MATH_IMAGE_INSTRUCTIONS, isMathStyle: true };
  }

  if (archetype.usesImage) {
    return { specInstructions: NONMATH_IMAGE_INSTRUCTIONS(domain), isMathStyle: false };
  }

  return { specInstructions: '', isMathStyle: false };
}
