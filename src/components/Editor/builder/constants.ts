import type { QuestionType } from '../../../types';

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice'   },
  { value: 'short_answer',    label: 'Short Answer'      },
  { value: 'paragraph',       label: 'Paragraph'         },
  { value: 'checkbox',        label: 'Checkbox'          },
  { value: 'fill_blank',      label: 'Fill in the Blank' },
  { value: 'true_false',      label: 'True / False'      },
  { value: 'matching',        label: 'Matching'          },
  { value: 'ordering',        label: 'Ordering'          },
  { value: 'image_question',  label: 'Image Question'    },
];

// Purple accent – matches Google Forms selection colour
export const ACCENT = '#673AB7';
