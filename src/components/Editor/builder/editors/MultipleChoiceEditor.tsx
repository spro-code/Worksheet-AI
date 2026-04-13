import { Check, X } from 'lucide-react';
import type { AnswerOption } from '../../../../types';
import { ACCENT } from '../constants';
import { cn } from '@/lib/utils';

interface Props {
  options: AnswerOption[];
  isCheckbox?: boolean;
  isTrueFalse?: boolean;
  onChangeOption: (id: string, text: string) => void;
  onToggleCorrect: (id: string) => void;
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
}

export function MultipleChoiceEditor({
  options,
  isCheckbox = false,
  isTrueFalse = false,
  onChangeOption,
  onToggleCorrect,
  onAddOption,
  onRemoveOption,
}: Props) {
  return (
    <div className="space-y-1">
      {options.map((opt, i) => (
        <div key={opt.id} className="flex items-center gap-3 py-0.5 group/opt">
          {/* Correct-answer indicator — radio for MC/TF, checkbox for CB */}
          <button
            onClick={() => onToggleCorrect(opt.id)}
            className={cn(
              'shrink-0 flex items-center justify-center border-2 transition-all',
              isCheckbox ? 'w-[18px] h-[18px] rounded-sm' : 'w-[18px] h-[18px] rounded-full'
            )}
            style={
              opt.isCorrect
                ? { backgroundColor: ACCENT, borderColor: ACCENT }
                : { borderColor: '#9CA3AF' }
            }
            title={opt.isCorrect ? 'Mark as incorrect' : 'Mark as correct'}
          >
            {opt.isCorrect && (
              isCheckbox
                ? <Check size={11} className="text-white" strokeWidth={3} />
                : <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </button>

          {/* Option text */}
          <input
            type="text"
            value={opt.text}
            onChange={(e) => onChangeOption(opt.id, e.target.value)}
            placeholder={isTrueFalse ? opt.text : `Option ${String.fromCharCode(65 + i)}`}
            disabled={isTrueFalse}
            className="flex-1 text-sm text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none py-1.5 placeholder:text-gray-500 transition-colors disabled:cursor-default"
          />

          {/* Remove */}
          {!isTrueFalse && (
            <button
              onClick={() => onRemoveOption(opt.id)}
              className="opacity-0 group-hover/opt:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              title="Remove option"
            >
              <X size={15} />
            </button>
          )}
        </div>
      ))}

      {/* Add option row */}
      {!isTrueFalse && (
        <div className="flex items-center gap-3 pt-0.5">
          <div
            className={cn(
              'shrink-0 border-2 border-gray-300',
              isCheckbox ? 'w-[18px] h-[18px] rounded-sm' : 'w-[18px] h-[18px] rounded-full'
            )}
          />
          <button
            onClick={onAddOption}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors py-1.5 text-left"
          >
            Add option
          </button>
        </div>
      )}
    </div>
  );
}
