/**
 * QuestionContent
 * Routes to the correct editor component based on question.type.
 * All callbacks are passed in so this component is purely presentational.
 */
import type { Question, AnswerOption, MatchingPair } from '../../../types';
import { MultipleChoiceEditor } from './editors/MultipleChoiceEditor';
import { ShortAnswerEditor }    from './editors/ShortAnswerEditor';
import { ParagraphEditor }      from './editors/ParagraphEditor';
import { FillBlankEditor }      from './editors/FillBlankEditor';
import { MatchingEditor }       from './editors/MatchingEditor';
import { OrderingEditor }       from './editors/OrderingEditor';
import { ImageQuestionEditor }  from './editors/ImageQuestionEditor';
import { nanoid }               from '../../../utils/nanoid';

interface Props {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

export function QuestionContent({ question, onUpdate }: Props) {
  // ── option helpers ────────────────────────────────────────────────────────
  const options = question.options ?? [];

  const changeOption  = (id: string, text: string) =>
    onUpdate({ options: options.map((o) => o.id === id ? { ...o, text } : o) });

  const toggleCorrect = (id: string) =>
    onUpdate({
      options: options.map((o) => ({
        ...o,
        isCorrect: question.type === 'checkbox'
          ? o.id === id ? !o.isCorrect : o.isCorrect
          : o.id === id,
      })),
    });

  const addOption     = () =>
    onUpdate({ options: [...options, { id: nanoid(), text: '', isCorrect: false }] });

  const removeOption  = (id: string) =>
    onUpdate({ options: options.filter((o) => o.id !== id) });

  // ── render ────────────────────────────────────────────────────────────────
  switch (question.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceEditor
          options={options}
          onChangeOption={changeOption}
          onToggleCorrect={toggleCorrect}
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
      );

    case 'checkbox':
      return (
        <MultipleChoiceEditor
          options={options}
          isCheckbox
          onChangeOption={changeOption}
          onToggleCorrect={toggleCorrect}
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
      );

    case 'true_false':
      return (
        <MultipleChoiceEditor
          options={options}
          isTrueFalse
          onChangeOption={changeOption}
          onToggleCorrect={toggleCorrect}
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
      );

    case 'short_answer':
      return <ShortAnswerEditor />;

    case 'paragraph':
      return <ParagraphEditor />;

    case 'fill_blank':
      return (
        <FillBlankEditor
          value={question.blanks?.[0] ?? ''}
          onChange={(val) => onUpdate({ blanks: [val] })}
        />
      );

    case 'matching':
      return (
        <MatchingEditor
          pairs={question.pairs ?? []}
          onChange={(pairs: MatchingPair[]) => onUpdate({ pairs })}
        />
      );

    case 'ordering':
      return (
        <OrderingEditor
          items={question.items ?? []}
          onChange={(items) => onUpdate({ items })}
        />
      );

    case 'image_question':
      return (
        <ImageQuestionEditor
          imageUrl={question.imageUrl}
          onImageChange={(url) => onUpdate({ imageUrl: url })}
        />
      );

    default:
      return null;
  }
}
