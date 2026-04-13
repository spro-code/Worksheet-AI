// Detects the subject domain from a topic/subject string and returns
// the appropriate SubjectDomain + the selected archetypes for that domain.
// Teacher-selected subject always takes priority over keyword detection.

import { ARCHETYPE_REGISTRY, type QuestionArchetype, type SubjectDomain } from './questionArchetypes';

interface RouteResult {
  domain: SubjectDomain;
  archetypes: QuestionArchetype[];
}

// Maps the UI subject labels (from SUBJECTS in mockData) to SubjectDomain values.
// This is the authoritative mapping when the teacher has made an explicit selection.
const SUBJECT_LABEL_MAP: Record<string, SubjectDomain> = {
  'Math':             'math',
  'Reading':          'english',
  'Writing':          'english',
  'Science':          'science',
  'Social Studies':   'history',
  'Life Skills':      'general_knowledge',
  'Social-Emotional': 'general_knowledge',
  'Communication':    'english',
  'Fine Motor':       'general_knowledge',
  'Gross Motor':      'general_knowledge',
  'Vocational':       'general_knowledge',
  'Behavior':         'general_knowledge',
  'Other':            'general_knowledge',
};

// Keyword → domain mappings (order matters: more specific first)
const DOMAIN_KEYWORDS: { keywords: string[]; domain: SubjectDomain }[] = [
  // Sciences
  { keywords: ['physics', 'force', 'motion', 'gravity', 'velocity', 'acceleration', 'energy', 'light', 'sound', 'magnetism', 'electricity', 'optics'], domain: 'physics' },
  { keywords: ['chemistry', 'chemical', 'element', 'compound', 'reaction', 'atom', 'molecule', 'periodic', 'acid', 'base', 'bonding', 'oxidation'], domain: 'chemistry' },
  { keywords: ['biology', 'cell', 'organism', 'photosynthesis', 'respiration', 'digestion', 'plant', 'animal', 'human body', 'ecosystem', 'genetics', 'evolution', 'anatomy'], domain: 'biology' },
  { keywords: ['science', 'nature', 'experiment', 'hypothesis', 'observation'], domain: 'science' },

  // Math
  { keywords: ['math', 'mathematics', 'arithmetic', 'algebra', 'geometry', 'fraction', 'decimal', 'percentage', 'number', 'counting', 'addition', 'subtraction', 'multiplication', 'division', 'equation', 'measurement', 'shapes', 'pattern', 'word problem'], domain: 'math' },

  // Social studies
  { keywords: ['history', 'historical', 'ancient', 'war', 'revolution', 'civilization', 'empire', 'independence', 'colonialism', 'freedom fighter', 'ruler', 'dynasty'], domain: 'history' },
  { keywords: ['geography', 'map', 'country', 'continent', 'capital', 'river', 'mountain', 'climate', 'landform', 'ocean', 'population', 'culture', 'region'], domain: 'geography' },

  // Languages
  { keywords: ['hindi', 'devanagari', 'हिंदी'], domain: 'hindi' },
  { keywords: ['bengali', 'bangla', 'বাংলা'], domain: 'bengali' },
  { keywords: ['english', 'grammar', 'reading', 'comprehension', 'essay', 'writing', 'vocabulary', 'spelling', 'punctuation', 'sentence', 'paragraph', 'story', 'poem', 'literature'], domain: 'english' },

  // GK
  { keywords: ['general knowledge', 'gk', 'current affairs', 'world', 'trivia', 'quiz'], domain: 'general_knowledge' },
];

/**
 * Resolves the subject domain in two stages:
 * 1. If the teacher selected a subject in the wizard, use SUBJECT_LABEL_MAP (authoritative).
 * 2. Otherwise, fall back to keyword matching on the free-text topic.
 */
export function routeSubject(topic: string, subjectLabel?: string): RouteResult {
  // Stage 1: explicit teacher selection wins unconditionally
  if (subjectLabel && SUBJECT_LABEL_MAP[subjectLabel]) {
    const domain = SUBJECT_LABEL_MAP[subjectLabel];
    return { domain, archetypes: ARCHETYPE_REGISTRY[domain] };
  }

  // Stage 2: keyword detection on the topic text only (not subjectLabel)
  const haystack = topic.toLowerCase();
  for (const { keywords, domain } of DOMAIN_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) {
      return { domain, archetypes: ARCHETYPE_REGISTRY[domain] };
    }
  }

  return { domain: 'general_knowledge', archetypes: ARCHETYPE_REGISTRY.general_knowledge };
}

/**
 * Pick the best single archetype for a given topic within a domain.
 * Tries to match on description/label keywords; falls back to the first archetype.
 */
export function pickArchetype(archetypes: QuestionArchetype[], topic: string): QuestionArchetype {
  const lc = topic.toLowerCase();
  const scored = archetypes.map((a) => {
    const text = `${a.label} ${a.description}`.toLowerCase();
    const words = lc.split(/\s+/).filter((w) => w.length > 3);
    const score = words.filter((w) => text.includes(w)).length;
    return { a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored[0].a;
}
