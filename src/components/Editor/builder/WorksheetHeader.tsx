import { useRef, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useWorksheetStore } from '../../../store/worksheetStore';
import { THEMES } from '../../../data/mockData';
import { ACCENT } from './constants';
import { cn } from '@/lib/utils';

const DEFAULT_INSTRUCTIONS = [
  'Read each question carefully before answering.',
  'Show your work where required.',
  'Circle or write your answer clearly.',
];

export function WorksheetHeader() {
  const { activeWorksheet, updateWorksheet } = useWorksheetStore();
  if (!activeWorksheet) return null;

  const theme = THEMES[activeWorksheet.theme];

  const instructions: string[] = activeWorksheet.description
    ? activeWorksheet.description.split('\n').filter(Boolean)
    : [...DEFAULT_INSTRUCTIONS];

  const save    = (lines: string[]) =>
    updateWorksheet(activeWorksheet.id, { description: lines.filter(Boolean).join('\n') });
  const update  = (i: number, val: string) => { const n = [...instructions]; n[i] = val; save(n); };
  const add     = () => save([...instructions, '']);
  const remove  = (i: number) => { const n = instructions.filter((_, idx) => idx !== i); save(n.length ? n : ['']); };

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [activeWorksheet.title]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Thick theme accent bar */}
      <div className={`h-2.5 ${theme.colors}`} />

      <div className="px-8 py-7 space-y-5">
        {/* Editable title */}
        <textarea
          ref={titleRef}
          value={activeWorksheet.title}
          onChange={(e) => updateWorksheet(activeWorksheet.id, { title: e.target.value })}
          rows={1}
          placeholder="Worksheet title"
          className="w-full text-[2rem] font-normal text-gray-800 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none resize-none overflow-hidden leading-tight placeholder:text-gray-300 pb-2 transition-colors"
          onFocus={(e) => (e.currentTarget.style.borderBottomColor = ACCENT)}
          onBlur={(e)  => (e.currentTarget.style.borderBottomColor = '')}
        />

        {/* Instructions list */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Instructions</p>
          {instructions.map((line, i) => (
            <div key={i} className="flex items-start gap-2 group/line">
              <span className="mt-2.5 text-gray-400 text-sm leading-none shrink-0">•</span>
              <input
                type="text"
                value={line}
                onChange={(e) => update(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')                                 { e.preventDefault(); add(); }
                  if (e.key === 'Backspace' && !line && instructions.length > 1) { e.preventDefault(); remove(i); }
                }}
                placeholder="Add an instruction…"
                className="flex-1 text-sm text-gray-600 bg-transparent border-0 border-b border-transparent focus:border-gray-300 focus:outline-none py-1 transition-colors placeholder:text-gray-300"
              />
              {instructions.length > 1 && (
                <button
                  onClick={() => remove(i)}
                  className="opacity-0 group-hover/line:opacity-100 mt-1.5 text-gray-300 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={add}
            className="flex items-center gap-1.5 text-xs mt-1 text-gray-400 hover:text-gray-600 transition-colors pl-4"
          >
            <PlusCircle size={13} /> Add instruction
          </button>
        </div>
      </div>
    </div>
  );
}
