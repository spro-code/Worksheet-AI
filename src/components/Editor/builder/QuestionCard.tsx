import { useState } from 'react';
import type { Question, QuestionType } from '../../../types';
import { useWorksheetStore } from '../../../store/worksheetStore';
import { QuestionHeader }  from './QuestionHeader';
import { QuestionContent } from './QuestionContent';
import { QuestionFooter }  from './QuestionFooter';
import { ACCENT }          from './constants';
import { cn }              from '@/lib/utils';

interface Props {
  question:  Question;
  sectionId: string;
}

export function QuestionCard({ question, sectionId }: Props) {
  const {
    selectedQuestionId,
    setSelectedQuestionId,
    updateQuestion,
    duplicateQuestion,
    deleteQuestion,
  } = useWorksheetStore();

  const [showHint, setShowHint] = useState(!!question.hint);
  const isSelected = selectedQuestionId === question.id;

  const update = (updates: Partial<Question>) => updateQuestion(question.id, updates);

  const handleTypeChange = (type: QuestionType) => {
    // When switching type, reset type-specific fields so no stale data shows
    update({
      type,
      options: (['multiple_choice', 'checkbox'].includes(type))
        ? [
            { id: crypto.randomUUID(), text: '', isCorrect: true  },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
          ]
        : type === 'true_false'
        ? [
            { id: crypto.randomUUID(), text: 'True',  isCorrect: true  },
            { id: crypto.randomUUID(), text: 'False', isCorrect: false },
          ]
        : undefined,
      pairs:  type === 'matching'  ? [{ id: crypto.randomUUID(), left: '', right: '' }, { id: crypto.randomUUID(), left: '', right: '' }] : undefined,
      items:  type === 'ordering'  ? ['', ''] : undefined,
      blanks: type === 'fill_blank' ? ['']    : undefined,
      imageUrl: type === 'image_question' ? undefined : question.imageUrl,
    });
  };

  return (
    <div
      onClick={() => setSelectedQuestionId(isSelected ? null : question.id)}
      className={cn(
        'bg-white rounded-lg border border-gray-200 transition-shadow duration-150 cursor-pointer',
        isSelected ? 'shadow-md' : 'hover:shadow-sm'
      )}
      style={{ borderLeft: `6px solid ${isSelected ? ACCENT : 'transparent'}` }}
    >
      {/* Header: drag handle + question input + type dropdown */}
      <div onClick={(e) => e.stopPropagation()}>
        <QuestionHeader
          text={question.text}
          type={question.type}
          isSelected={isSelected}
          onTextChange={(text) => update({ text })}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* Content: type-specific editor */}
      <div
        className="px-14 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <QuestionContent question={question} onUpdate={update} />

        {/* Hint field */}
        {showHint && (
          <div className="pt-3 border-t border-dashed border-gray-100 mt-3">
            <input
              type="text"
              value={question.hint ?? ''}
              onChange={(e) => update({ hint: e.target.value })}
              placeholder="Add a hint for students…"
              className="w-full text-sm text-gray-500 italic border-b border-dashed border-gray-300 focus:border-gray-400 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Footer: actions bar — only visible when selected */}
      {isSelected && (
        <div onClick={(e) => e.stopPropagation()}>
          <QuestionFooter
            required={question.required ?? false}
            difficulty={question.difficulty ?? 'intermediate'}
            points={question.points ?? 1}
            showHint={showHint}
            onToggleRequired={() => update({ required: !question.required })}
            onChangeDifficulty={(difficulty) => update({ difficulty })}
            onChangePoints={(points) => update({ points })}
            onToggleHint={() => setShowHint((v) => !v)}
            onDuplicate={() => duplicateQuestion(question.id)}
            onDelete={() => deleteQuestion(question.id)}
          />
        </div>
      )}

      {/* Collapsed hint indicator */}
      {!isSelected && question.hint && (
        <div className="px-14 pb-3 flex items-center gap-1.5 text-gray-400">
          <span className="text-xs">💡 Has hint</span>
        </div>
      )}
    </div>
  );
}
