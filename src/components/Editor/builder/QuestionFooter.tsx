import { Lightbulb, Copy, Trash2 } from 'lucide-react';
import type { DifficultyLevel } from '../../../types';
import { ACCENT } from './constants';
import { cn } from '@/lib/utils';

interface Props {
  required:   boolean;
  difficulty: DifficultyLevel;
  points:     number;
  showHint:   boolean;
  onToggleRequired:   () => void;
  onChangeDifficulty: (d: DifficultyLevel) => void;
  onChangePoints:     (p: number) => void;
  onToggleHint:       () => void;
  onDuplicate:        () => void;
  onDelete:           () => void;
}

export function QuestionFooter({
  required,
  difficulty,
  points,
  showHint,
  onToggleRequired,
  onChangeDifficulty,
  onChangePoints,
  onToggleHint,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <div className="border-t border-gray-100 px-5 py-2.5 flex items-center gap-1">
      {/* AddHint */}
      <button
        onClick={onToggleHint}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors mr-auto',
          showHint
            ? 'text-[#673AB7] bg-purple-50'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        )}
      >
        <Lightbulb size={13} />
        {showHint ? 'Remove hint' : 'Add hint'}
      </button>

      {/* DifficultySelector */}
      <select
        value={difficulty}
        onChange={(e) => onChangeDifficulty(e.target.value as DifficultyLevel)}
        className="text-xs text-gray-500 bg-transparent border-0 focus:outline-none cursor-pointer hover:text-gray-700 transition-colors"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <span className="text-gray-300 text-xs mx-0.5">·</span>

      {/* PointsInput */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={1}
          max={100}
          value={points}
          onChange={(e) => onChangePoints(Math.max(1, Number(e.target.value) || 1))}
          className="w-8 text-xs text-gray-500 bg-transparent border-0 focus:outline-none text-center"
        />
        <span className="text-xs text-gray-400">pts</span>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-2" />

      {/* DuplicateButton */}
      <button
        onClick={onDuplicate}
        title="Duplicate question"
        className="p-2 rounded text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Copy size={16} />
      </button>

      {/* DeleteButton */}
      <button
        onClick={onDelete}
        title="Delete question"
        className="p-2 rounded text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-2" />

      {/* RequiredToggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <span className="text-xs text-gray-600 font-medium">Required</span>
        <button
          onClick={onToggleRequired}
          aria-checked={required}
          role="switch"
          className="relative shrink-0 rounded-full transition-colors focus:outline-none"
          style={{ width: 36, height: 20, backgroundColor: required ? ACCENT : '#D1D5DB' }}
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-150"
            style={{ left: required ? 18 : 2 }}
          />
        </button>
      </label>
    </div>
  );
}
