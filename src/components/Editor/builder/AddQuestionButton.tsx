import { useState, useRef, useEffect } from 'react';
import {
  Plus, CheckSquare, AlignLeft, Rows3,
  Minus, ToggleLeft, Link, List, Image,
} from 'lucide-react';
import type { QuestionType } from '../../../types';
import { ACCENT } from './constants';
import { cn } from '@/lib/utils';

const TYPES: { type: QuestionType; label: string; icon: React.ReactNode }[] = [
  { type: 'multiple_choice', label: 'Multiple Choice',   icon: <CheckSquare size={15} /> },
  { type: 'short_answer',    label: 'Short Answer',      icon: <AlignLeft size={15} />   },
  { type: 'paragraph',       label: 'Paragraph',         icon: <Rows3 size={15} />       },
  { type: 'checkbox',        label: 'Checkbox',          icon: <CheckSquare size={15} /> },
  { type: 'fill_blank',      label: 'Fill in the Blank', icon: <Minus size={15} />       },
  { type: 'true_false',      label: 'True / False',      icon: <ToggleLeft size={15} />  },
  { type: 'matching',        label: 'Matching',          icon: <Link size={15} />        },
  { type: 'ordering',        label: 'Ordering',          icon: <List size={15} />        },
  { type: 'image_question',  label: 'Image Question',    icon: <Image size={15} />       },
];

interface Props {
  onAdd: (type: QuestionType) => void;
}

export function AddQuestionButton({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-center pt-2 pb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-5 py-2 rounded-full border-2 border-dashed text-sm font-medium transition-all',
          open
            ? 'border-[#673AB7] text-[#673AB7] bg-purple-50'
            : 'border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700'
        )}
      >
        <Plus size={15} /> Add question
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 w-56 z-50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Question type</p>
          </div>
          <div className="py-1">
            {TYPES.map(({ type, label, icon }) => (
              <button
                key={type}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur from closing before click fires
                  onAdd(type);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-gray-400 shrink-0">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
