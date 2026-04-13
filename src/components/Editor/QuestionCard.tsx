import { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical, Lightbulb, Copy, Check, Plus, X, ChevronDown, ImagePlus, XCircle } from 'lucide-react';
import type { Question, QuestionType } from '../../types';
import { useWorksheetStore } from '../../store/worksheetStore';
import { nanoid } from '../../utils/nanoid';
import { THEMES } from '../../data/mockData';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  index: number;
  sectionId?: string;
  theme?: typeof THEMES[keyof typeof THEMES];
}

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'short_answer',    label: 'Short Answer'    },
  { value: 'paragraph',       label: 'Paragraph'       },
  { value: 'checkbox',        label: 'Checkbox'        },
  { value: 'fill_blank',      label: 'Fill in the Blank' },
  { value: 'true_false',      label: 'True / False'    },
  { value: 'matching',        label: 'Matching'        },
  { value: 'ordering',        label: 'Ordering'        },
  { value: 'image_question',  label: 'Image Question'  },
];

// Accent color for selected state (Google Forms purple)
const ACCENT = '#673AB7';

export function QuestionCard({ question, index, theme }: QuestionCardProps) {
  const { updateQuestion, deleteQuestion, selectedQuestionId, setSelectedQuestionId, activeWorksheet } = useWorksheetStore();
  const [showHint, setShowHint] = useState(!!question.hint);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);

  // Auto-resize question textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [question.text]);

  const t = theme ?? THEMES[activeWorksheet?.theme ?? 'playful'];
  const isSelected = selectedQuestionId === question.id;
  const isChoice   = question.type === 'multiple_choice' || question.type === 'checkbox' || question.type === 'true_false';

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateText   = (text: string) => updateQuestion(question.id, { text });
  const updateOption = (optId: string, text: string) =>
    updateQuestion(question.id, { options: (question.options || []).map((o) => o.id === optId ? { ...o, text } : o) });
  const toggleCorrect = (optId: string) => {
    const opts = (question.options || []).map((o) => ({
      ...o,
      isCorrect: question.type === 'checkbox' ? (o.id === optId ? !o.isCorrect : o.isCorrect) : o.id === optId,
    }));
    updateQuestion(question.id, { options: opts });
  };
  const addOption    = () => updateQuestion(question.id, { options: [...(question.options || []), { id: nanoid(), text: '', isCorrect: false }] });
  const removeOption = (id: string) => updateQuestion(question.id, { options: (question.options || []).filter((o) => o.id !== id) });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateQuestion(question.id, { imageUrl: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      onClick={() => setSelectedQuestionId(isSelected ? null : question.id)}
      className={cn(
        'bg-white rounded-lg border border-gray-200 transition-shadow duration-150 cursor-pointer',
        isSelected ? 'shadow-md' : 'hover:shadow-sm'
      )}
      style={isSelected ? { borderLeft: `6px solid ${ACCENT}` } : { borderLeft: '6px solid transparent' }}
    >
      {/* ── Header row: drag + question input + type selector ── */}
      <div className="flex gap-3 items-start px-5 pt-5 pb-2" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0 mt-2.5 hover:text-gray-500 transition-colors" />

        {/* Question text */}
        <div className="flex-1 min-w-0">
          {/* Image upload area for image_question type */}
          {question.type === 'image_question' && (
            <div className="mb-3">
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              {question.imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 group/img">
                  <img src={question.imageUrl} alt="" className="w-full max-h-52 object-contain bg-gray-50" />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100">
                    <button onClick={() => imageInputRef.current?.click()} className="bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-50">Replace</button>
                    <button onClick={() => updateQuestion(question.id, { imageUrl: undefined })} className="bg-white text-red-500 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-red-50 flex items-center gap-1.5">
                      <XCircle size={12} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-lg py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-300 transition-all"
                >
                  <ImagePlus size={24} />
                  <span className="text-sm">Click to upload image</span>
                </button>
              )}
            </div>
          )}

          {/* Question text input */}
          <textarea
            ref={textareaRef}
            value={question.text}
            onChange={(e) => updateText(e.target.value)}
            placeholder="Question"
            rows={1}
            className={cn(
              'w-full text-[15px] text-gray-800 bg-gray-50 rounded-t-sm border-0 border-b-2 px-3 py-2 resize-none overflow-hidden focus:outline-none transition-colors placeholder:text-gray-400 leading-relaxed',
              isSelected ? 'border-b-[#673AB7]' : 'border-b-gray-300 hover:border-b-gray-400'
            )}
            style={isSelected ? { borderBottomColor: ACCENT } : {}}
          />
        </div>

        {/* Type selector */}
        <div className="relative shrink-0 w-48">
          <select
            value={question.type}
            onChange={(e) => updateQuestion(question.id, { type: e.target.value as QuestionType })}
            className="w-full appearance-none bg-white text-sm text-gray-700 border border-gray-300 rounded px-3 pr-8 py-[9px] focus:outline-none hover:border-gray-400 transition-colors cursor-pointer"
            style={{ fontFamily: 'inherit' }}
          >
            {QUESTION_TYPES.map((qt) => <option key={qt.value} value={qt.value}>{qt.label}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Answer body ── */}
      <div className="px-14 pb-4 space-y-1.5" onClick={(e) => e.stopPropagation()}>

        {/* Multiple choice / Checkbox / True-False */}
        {isChoice && question.options && (
          <>
            {question.options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-3 py-0.5 group/opt">
                {/* Selection indicator */}
                <button
                  onClick={() => toggleCorrect(opt.id)}
                  className={cn(
                    'shrink-0 transition-all border-2',
                    question.type === 'checkbox' ? 'w-[18px] h-[18px] rounded-sm' : 'w-[18px] h-[18px] rounded-full',
                    opt.isCorrect ? `border-[${ACCENT}]` : 'border-gray-400 hover:border-gray-600'
                  )}
                  style={opt.isCorrect ? { backgroundColor: ACCENT, borderColor: ACCENT } : {}}
                >
                  {opt.isCorrect && (
                    question.type === 'checkbox'
                      ? <Check size={11} className="text-white mx-auto" strokeWidth={3} />
                      : <div className="w-2 h-2 rounded-full bg-white mx-auto mt-[2px]" />
                  )}
                </button>

                {/* Option text */}
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  placeholder={question.type === 'true_false' ? opt.text : `Option ${String.fromCharCode(65 + i)}`}
                  disabled={question.type === 'true_false'}
                  className="flex-1 text-sm text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none py-1.5 placeholder:text-gray-500 transition-colors disabled:cursor-default disabled:text-gray-600"
                />

                {/* Remove option */}
                {question.type !== 'true_false' && (
                  <button
                    onClick={() => removeOption(opt.id)}
                    className="opacity-0 group-hover/opt:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}

            {/* Add option row */}
            {question.type !== 'true_false' && (
              <div className="flex items-center gap-3 pt-0.5">
                <div className={cn('shrink-0 border-2 border-gray-300', question.type === 'checkbox' ? 'w-[18px] h-[18px] rounded-sm' : 'w-[18px] h-[18px] rounded-full')} />
                <button
                  onClick={addOption}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors py-1.5 text-left"
                >
                  Add option
                </button>
              </div>
            )}
          </>
        )}

        {/* Short answer */}
        {question.type === 'short_answer' && (
          <div className="py-2">
            <div className="w-3/5 border-b-2 border-dotted border-gray-300 py-2">
              <span className="text-sm text-gray-400 italic">Short-answer text</span>
            </div>
          </div>
        )}

        {/* Paragraph */}
        {question.type === 'paragraph' && (
          <div className="py-2 space-y-2.5">
            {[1, 2, 3].map((i) => <div key={i} className="border-b border-dotted border-gray-200 py-1" />)}
            <span className="text-xs text-gray-400 italic">Long answer text</span>
          </div>
        )}

        {/* Fill in the blank */}
        {question.type === 'fill_blank' && (
          <div className="py-2 space-y-2">
            <p className="text-xs text-gray-400">Correct answer</p>
            <input
              type="text"
              value={question.blanks?.[0] || ''}
              onChange={(e) => updateQuestion(question.id, { blanks: [e.target.value] })}
              placeholder="Type the answer…"
              className="w-3/5 text-sm text-gray-700 border-b-2 border-gray-300 focus:border-b-[#673AB7] bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
              style={{ '--tw-border-opacity': 1 } as React.CSSProperties}
              onFocus={(e) => (e.target.style.borderBottomColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderBottomColor = '')}
            />
          </div>
        )}

        {/* Matching */}
        {question.type === 'matching' && (
          <div className="py-2 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Prompt</p>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Match</p>
            </div>
            {(question.pairs || []).map((pair, i) => (
              <div key={pair.id} className="grid grid-cols-2 gap-4 group/pair">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0 w-4 text-right">{i + 1}.</span>
                  <input
                    type="text"
                    value={pair.left}
                    onChange={(e) => updateQuestion(question.id, { pairs: (question.pairs || []).map((p) => p.id === pair.id ? { ...p, left: e.target.value } : p) })}
                    placeholder={`Prompt ${i + 1}`}
                    className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pair.right}
                    onChange={(e) => updateQuestion(question.id, { pairs: (question.pairs || []).map((p) => p.id === pair.id ? { ...p, right: e.target.value } : p) })}
                    placeholder={`Match ${i + 1}`}
                    className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
                  />
                  <button
                    onClick={() => updateQuestion(question.id, { pairs: (question.pairs || []).filter((p) => p.id !== pair.id) })}
                    className="opacity-0 group-hover/pair:opacity-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => updateQuestion(question.id, { pairs: [...(question.pairs || []), { id: nanoid(), left: '', right: '' }] })}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5 pl-6 pt-1"
            >
              <Plus size={13} /> Add row
            </button>
          </div>
        )}

        {/* Ordering */}
        {question.type === 'ordering' && (
          <div className="py-2 space-y-2">
            {(question.items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3 group/item">
                <span className="text-xs text-gray-400 w-5 text-right shrink-0 font-medium">{i + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const items = [...(question.items || [])];
                    items[i] = e.target.value;
                    updateQuestion(question.id, { items });
                  }}
                  placeholder={`Step ${i + 1}`}
                  className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
                />
                <button
                  onClick={() => updateQuestion(question.id, { items: (question.items || []).filter((_, idx) => idx !== i) })}
                  className="opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateQuestion(question.id, { items: [...(question.items || []), ''] })}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5 pl-8 pt-1"
            >
              <Plus size={13} /> Add item
            </button>
          </div>
        )}

        {/* Hint field */}
        {showHint && (
          <div className="pt-2 border-t border-dashed border-gray-100 mt-2">
            <input
              type="text"
              value={question.hint || ''}
              onChange={(e) => updateQuestion(question.id, { hint: e.target.value })}
              placeholder="Add a hint for students…"
              className="w-full text-sm text-gray-500 italic border-b border-dashed border-gray-300 focus:border-gray-400 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
            />
          </div>
        )}
      </div>

      {/* ── Bottom action bar (visible when selected) ── */}
      {isSelected && (
        <div
          className="border-t border-gray-100 px-5 py-3 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hint toggle */}
          <button
            onClick={() => setShowHint((v) => !v)}
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

          {/* Difficulty */}
          <select
            value={question.difficulty || 'intermediate'}
            onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as Question['difficulty'] })}
            className="text-xs text-gray-500 bg-transparent border-0 focus:outline-none cursor-pointer pr-1 hover:text-gray-700"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <span className="text-gray-300 text-xs mx-1">·</span>

          {/* Points */}
          <div className="flex items-center gap-1">
            <input
              type="number" min={1} max={10}
              value={question.points || 1}
              onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
              className="w-8 text-xs text-gray-500 bg-transparent border-0 focus:outline-none text-center cursor-pointer"
            />
            <span className="text-xs text-gray-400">pts</span>
          </div>

          <div className="w-px h-5 bg-gray-200 mx-2" />

          {/* Duplicate */}
          <button
            onClick={() => {}}
            title="Duplicate"
            className="p-2 rounded text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Copy size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteQuestion(question.id)}
            title="Delete"
            className="p-2 rounded text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-2" />

          {/* Required toggle */}
          <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-600 font-medium select-none">Required</span>
            <button
              onClick={() => updateQuestion(question.id, { required: !question.required })}
              className="relative shrink-0 rounded-full transition-colors"
              style={{
                width: 36, height: 20,
                backgroundColor: question.required ? ACCENT : '#D1D5DB',
              }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-150"
                style={{ left: question.required ? 18 : 2 }}
              />
            </button>
          </label>
        </div>
      )}

      {/* Hint indicator when collapsed */}
      {!isSelected && question.hint && (
        <div className="px-14 pb-3 flex items-center gap-1.5 text-gray-400">
          <Lightbulb size={11} />
          <span className="text-xs">Has hint</span>
        </div>
      )}
    </div>
  );
}
