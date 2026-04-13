import { useRef, useEffect } from 'react';
import { GripVertical, ChevronDown } from 'lucide-react';
import type { QuestionType } from '../../../types';
import { QUESTION_TYPE_OPTIONS, ACCENT } from './constants';
import { cn } from '@/lib/utils';

interface QuestionHeaderProps {
  text: string;
  type: QuestionType;
  isSelected: boolean;
  onTextChange: (text: string) => void;
  onTypeChange: (type: QuestionType) => void;
  /** Pass drag-handle props from dnd library if used */
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function QuestionHeader({
  text,
  type,
  isSelected,
  onTextChange,
  onTypeChange,
  dragHandleProps,
}: QuestionHeaderProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  return (
    <div className="flex gap-3 items-start px-5 pt-5 pb-2">
      {/* DragHandle */}
      <div
        {...dragHandleProps}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 mt-2.5 transition-colors"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      {/* QuestionInput */}
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Question"
          rows={1}
          className={cn(
            'w-full text-[15px] text-gray-800 bg-gray-50 rounded-t-sm border-0 border-b-2 px-3 py-2',
            'resize-none overflow-hidden focus:outline-none transition-colors leading-relaxed',
            'placeholder:text-gray-400',
            isSelected ? '' : 'border-b-gray-300 hover:border-b-gray-400'
          )}
          style={isSelected ? { borderBottomColor: ACCENT } : {}}
        />
      </div>

      {/* QuestionTypeDropdown */}
      <div className="relative shrink-0 w-48">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as QuestionType)}
          className="w-full appearance-none bg-white text-sm text-gray-700 border border-gray-300 rounded px-3 pr-8 py-[9px] focus:outline-none hover:border-gray-400 transition-colors cursor-pointer"
          style={{ fontFamily: 'inherit' }}
        >
          {QUESTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
