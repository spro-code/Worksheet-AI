// Question archetypes per subject — defines what kinds of questions
// are valid for each subject domain.

export type SubjectDomain =
  | 'math'
  | 'english'
  | 'hindi'
  | 'bengali'
  | 'language' // fallback for any language subject
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'science' // fallback for any science subject
  | 'history'
  | 'geography'
  | 'general_knowledge';

export interface QuestionArchetype {
  id: string;
  label: string;
  description: string;
  // Which question types map well to this archetype
  preferredTypes: string[];
  // Whether this archetype benefits from a visual aid
  usesImage: boolean;
  // What the image should depict (template string, {topic} replaced)
  imageContext?: string;
}

// ─── Language Archetypes (English / Hindi / Bengali) ──────────────────────

export const LANGUAGE_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'reading_comprehension',
    label: 'Reading Comprehension',
    description: 'A short passage followed by questions about its content, meaning, and inference.',
    preferredTypes: ['multiple_choice', 'short_answer', 'true_false'],
    usesImage: true,
    imageContext: 'An illustrated scene depicting {topic} suitable for children',
  },
  {
    id: 'essay_prompt',
    label: 'Essay / Writing Prompt',
    description: 'An open-ended writing task asking the student to express ideas on a topic.',
    preferredTypes: ['paragraph', 'short_answer'],
    usesImage: false,
  },
  {
    id: 'grammar_correction',
    label: 'Grammar Correction',
    description: 'Sentences with grammatical errors for the student to identify and correct.',
    preferredTypes: ['short_answer', 'fill_blank', 'multiple_choice'],
    usesImage: false,
  },
  {
    id: 'sentence_formation',
    label: 'Sentence Formation',
    description: 'Words or phrases to be arranged into correct sentences.',
    preferredTypes: ['ordering', 'fill_blank', 'short_answer'],
    usesImage: false,
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    description: 'Synonyms, antonyms, word meanings, or fill-in-the-blank vocabulary usage.',
    preferredTypes: ['multiple_choice', 'fill_blank', 'matching'],
    usesImage: false,
  },
  {
    id: 'creative_writing',
    label: 'Creative Writing',
    description: 'A story starter or imaginative prompt for the student to continue.',
    preferredTypes: ['paragraph'],
    usesImage: true,
    imageContext: 'A whimsical illustration related to {topic} that could inspire a story',
  },
];

// ─── Math Archetypes ───────────────────────────────────────────────────────

export const MATH_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'arithmetic',
    label: 'Arithmetic Problems',
    description: 'Direct calculation problems: addition, subtraction, multiplication, division.',
    preferredTypes: ['short_answer', 'multiple_choice', 'fill_blank'],
    usesImage: true,
    imageContext: 'A visual math aid showing {topic} with objects or diagrams',
  },
  {
    id: 'word_problem',
    label: 'Word Problems',
    description: 'Real-world scenario requiring mathematical reasoning to solve.',
    preferredTypes: ['short_answer', 'multiple_choice'],
    usesImage: true,
    imageContext: 'An illustrated real-world scene depicting {topic} situation for a math word problem',
  },
  {
    id: 'pattern_recognition',
    label: 'Pattern Recognition',
    description: 'Number sequences or patterns the student must identify and continue.',
    preferredTypes: ['fill_blank', 'short_answer', 'multiple_choice'],
    usesImage: false,
  },
  {
    id: 'geometry',
    label: 'Geometry',
    description: 'Questions about shapes, angles, area, perimeter, and spatial reasoning.',
    preferredTypes: ['multiple_choice', 'short_answer', 'true_false'],
    usesImage: true,
    imageContext: 'A clean labeled geometry diagram illustrating {topic}',
  },
  {
    id: 'fractions',
    label: 'Fractions & Decimals',
    description: 'Questions about fractions, equivalent fractions, decimals, and percentages.',
    preferredTypes: ['multiple_choice', 'short_answer', 'fill_blank'],
    usesImage: true,
    imageContext: 'A pie chart or fraction bar diagram illustrating {topic}',
  },
  {
    id: 'measurement',
    label: 'Measurement',
    description: 'Questions about units, time, money, length, weight, and volume.',
    preferredTypes: ['multiple_choice', 'short_answer', 'fill_blank'],
    usesImage: false,
  },
];

// ─── Physics Archetypes ────────────────────────────────────────────────────

export const PHYSICS_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'conceptual',
    label: 'Conceptual Questions',
    description: 'Questions testing understanding of physical concepts without calculation.',
    preferredTypes: ['multiple_choice', 'short_answer', 'true_false'],
    usesImage: true,
    imageContext: 'A clear educational diagram illustrating the concept of {topic}',
  },
  {
    id: 'formula_application',
    label: 'Formula-Based Problems',
    description: 'Numerical problems requiring application of physics formulas.',
    preferredTypes: ['short_answer', 'multiple_choice', 'fill_blank'],
    usesImage: false,
  },
  {
    id: 'real_world',
    label: 'Real-World Applications',
    description: 'Everyday scenarios explained through physics principles.',
    preferredTypes: ['short_answer', 'multiple_choice'],
    usesImage: true,
    imageContext: 'A real-world illustration showing {topic} in everyday life',
  },
  {
    id: 'true_false_concepts',
    label: 'True/False Concepts',
    description: 'Statements about physics principles that the student must evaluate.',
    preferredTypes: ['true_false'],
    usesImage: false,
  },
];

// ─── Chemistry Archetypes ──────────────────────────────────────────────────

export const CHEMISTRY_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'element_identification',
    label: 'Element / Compound Identification',
    description: 'Questions about periodic table elements, symbols, atomic numbers, and compounds.',
    preferredTypes: ['multiple_choice', 'matching', 'fill_blank'],
    usesImage: false,
  },
  {
    id: 'reaction_equations',
    label: 'Chemical Reactions',
    description: 'Balancing equations, identifying reactants/products, reaction types.',
    preferredTypes: ['fill_blank', 'short_answer', 'multiple_choice'],
    usesImage: false,
  },
  {
    id: 'conceptual_theory',
    label: 'Conceptual Theory',
    description: 'Questions about atomic structure, bonding, states of matter, and chemical properties.',
    preferredTypes: ['multiple_choice', 'short_answer', 'true_false'],
    usesImage: true,
    imageContext: 'A labeled educational diagram of {topic} for chemistry class',
  },
];

// ─── Biology Archetypes ────────────────────────────────────────────────────

export const BIOLOGY_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'diagram_labeling',
    label: 'Diagram Labeling',
    description: 'Label the parts of a biological structure (cell, plant, heart, etc.).',
    preferredTypes: ['fill_blank', 'matching', 'multiple_choice'],
    usesImage: true,
    imageContext: 'A clear labeled educational diagram of {topic} for biology class',
  },
  {
    id: 'life_processes',
    label: 'Life Processes',
    description: 'Questions about biological processes: photosynthesis, respiration, digestion, etc.',
    preferredTypes: ['short_answer', 'multiple_choice', 'true_false'],
    usesImage: true,
    imageContext: 'An educational illustration showing the process of {topic}',
  },
  {
    id: 'classification',
    label: 'Classification',
    description: 'Classify organisms, cells, or biological structures into categories.',
    preferredTypes: ['matching', 'multiple_choice', 'ordering'],
    usesImage: false,
  },
  {
    id: 'conceptual_biology',
    label: 'Conceptual Questions',
    description: 'Open-ended questions about biological concepts and their significance.',
    preferredTypes: ['short_answer', 'true_false'],
    usesImage: false,
  },
];

// ─── History Archetypes ────────────────────────────────────────────────────

export const HISTORY_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'event_analysis',
    label: 'Event Analysis',
    description: 'Questions about causes, effects, and significance of historical events.',
    preferredTypes: ['short_answer', 'multiple_choice'],
    usesImage: true,
    imageContext: 'A historical illustration or scene depicting {topic}',
  },
  {
    id: 'timeline',
    label: 'Timeline / Sequencing',
    description: 'Arrange historical events in chronological order.',
    preferredTypes: ['ordering', 'matching', 'fill_blank'],
    usesImage: false,
  },
  {
    id: 'key_figures',
    label: 'Key Historical Figures',
    description: 'Questions about historical people, their roles, and contributions.',
    preferredTypes: ['multiple_choice', 'short_answer', 'matching'],
    usesImage: true,
    imageContext: 'A portrait-style illustration of a historical figure or scene from {topic}',
  },
  {
    id: 'cause_effect',
    label: 'Cause & Effect',
    description: 'Identify the causes and consequences of historical events.',
    preferredTypes: ['short_answer', 'matching', 'multiple_choice'],
    usesImage: false,
  },
];

// ─── Geography Archetypes ──────────────────────────────────────────────────

export const GEOGRAPHY_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'map_knowledge',
    label: 'Map / Location',
    description: 'Identify countries, capitals, rivers, mountains on a map.',
    preferredTypes: ['multiple_choice', 'fill_blank', 'matching'],
    usesImage: true,
    imageContext: 'A simple educational map highlighting {topic}',
  },
  {
    id: 'physical_features',
    label: 'Physical Features',
    description: 'Questions about landforms, climate zones, and natural features.',
    preferredTypes: ['multiple_choice', 'short_answer', 'true_false'],
    usesImage: false,
  },
  {
    id: 'culture_people',
    label: 'Culture & People',
    description: 'Questions about populations, languages, traditions, and economies.',
    preferredTypes: ['short_answer', 'multiple_choice'],
    usesImage: false,
  },
];

// ─── General Knowledge Archetypes ─────────────────────────────────────────

export const GK_ARCHETYPES: QuestionArchetype[] = [
  {
    id: 'factual_recall',
    label: 'Factual Questions',
    description: 'Direct fact-based questions across a variety of topics.',
    preferredTypes: ['multiple_choice', 'true_false', 'fill_blank'],
    usesImage: false,
  },
  {
    id: 'current_affairs',
    label: 'Current Affairs / World Events',
    description: 'Questions about notable world events, organizations, and achievements.',
    preferredTypes: ['multiple_choice', 'short_answer'],
    usesImage: false,
  },
];

// ─── Registry ──────────────────────────────────────────────────────────────

export const ARCHETYPE_REGISTRY: Record<SubjectDomain, QuestionArchetype[]> = {
  math:             MATH_ARCHETYPES,
  english:          LANGUAGE_ARCHETYPES,
  hindi:            LANGUAGE_ARCHETYPES,
  bengali:          LANGUAGE_ARCHETYPES,
  language:         LANGUAGE_ARCHETYPES,
  physics:          PHYSICS_ARCHETYPES,
  chemistry:        CHEMISTRY_ARCHETYPES,
  biology:          BIOLOGY_ARCHETYPES,
  science:          [...PHYSICS_ARCHETYPES, ...BIOLOGY_ARCHETYPES, ...CHEMISTRY_ARCHETYPES],
  history:          HISTORY_ARCHETYPES,
  geography:        GEOGRAPHY_ARCHETYPES,
  general_knowledge: GK_ARCHETYPES,
};
