import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Globe, Lock, CheckCircle2, Sparkles, Tag, Clock } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { cn } from '@/lib/utils';
import type { Question } from '../../types';

// ─── Answer state ─────────────────────────────────────────────────────────────
type Answers = Record<string, string | string[]>;

// ─── Interactive question renderer ───────────────────────────────────────────

function StudentQuestion({
  question,
  index,
  answers,
  onAnswer,
}: {
  question: Question;
  index: number;
  answers: Answers;
  onAnswer: (id: string, value: string | string[]) => void;
}) {
  const selected = answers[question.id];

  const isOptionSelected = (optId: string) =>
    Array.isArray(selected) ? selected.includes(optId) : selected === optId;

  const toggleCheckbox = (optId: string) => {
    const cur = (answers[question.id] as string[]) ?? [];
    onAnswer(
      question.id,
      cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId]
    );
  };

  const isAnswered = (): boolean => {
    if (!selected) return false;
    if (Array.isArray(selected)) return selected.length > 0;
    return selected.length > 0;
  };

  return (
    <div
      className={cn(
        'group relative rounded-2xl border transition-all duration-200 p-5',
        isAnswered()
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      )}
    >
      {/* Question number badge + text */}
      <div className="flex gap-3 mb-4">
        <div
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
            isAnswered() ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-500'
          )}
        >
          {index + 1}
        </div>
        <p className="text-gray-900 leading-relaxed text-[15px] font-medium pt-0.5">
          {question.text}
        </p>
      </div>

      {/* Image */}
      {question.imageUrl && (
        <div className="ml-10 mb-4">
          <img
            src={question.imageUrl}
            alt=""
            className="rounded-xl max-h-40 object-contain border border-gray-100 shadow-sm"
          />
        </div>
      )}

      {/* Answer area */}
      <div className="ml-10 space-y-2">

        {/* Multiple choice / image_question */}
        {(question.type === 'multiple_choice' || question.type === 'image_question') &&
          question.options?.map((opt) => {
            const sel = isOptionSelected(opt.id ?? opt.text);
            return (
              <button
                key={opt.id ?? opt.text}
                onClick={() => onAnswer(question.id, opt.id ?? opt.text)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-150',
                  sel
                    ? 'border-[#1A8917] bg-gray-500 text-white shadow-sm shadow-gray-200'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
                    sel ? 'border-white bg-white' : 'border-gray-300'
                  )}
                >
                  {sel && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                </div>
                <span className={cn('flex-1', sel ? 'font-medium' : '')}>{opt.text}</span>
              </button>
            );
          })}

        {/* True / False */}
        {question.type === 'true_false' && (
          <div className="flex gap-3">
            {['True', 'False'].map((v) => {
              const sel = selected === v;
              return (
                <button
                  key={v}
                  onClick={() => onAnswer(question.id, v)}
                  className={cn(
                    'flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-150',
                    sel
                      ? 'border-[#1A8917] bg-gray-500 text-white shadow-sm shadow-gray-200'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {v}
                </button>
              );
            })}
          </div>
        )}

        {/* Checkbox */}
        {question.type === 'checkbox' &&
          question.options?.map((opt) => {
            const sel = isOptionSelected(opt.id ?? opt.text);
            return (
              <button
                key={opt.id ?? opt.text}
                onClick={() => toggleCheckbox(opt.id ?? opt.text)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-150',
                  sel
                    ? 'border-[#1A8917] bg-gray-500 text-white shadow-sm shadow-gray-200'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
                    sel ? 'border-white bg-white' : 'border-gray-300'
                  )}
                >
                  {sel && <div className="w-2.5 h-2.5 rounded-sm bg-gray-500" />}
                </div>
                {opt.text}
              </button>
            );
          })}

        {/* Short answer */}
        {question.type === 'short_answer' && (
          <input
            type="text"
            placeholder="Write your answer here…"
            value={(selected as string) ?? ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] focus:ring-2 focus:ring-gray-100 transition-all bg-white"
          />
        )}

        {/* Paragraph */}
        {question.type === 'paragraph' && (
          <textarea
            placeholder="Write your response here…"
            value={(selected as string) ?? ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] focus:ring-2 focus:ring-gray-100 transition-all resize-none bg-white"
          />
        )}

        {/* Fill blank */}
        {question.type === 'fill_blank' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Answer:</span>
            <input
              type="text"
              placeholder="fill in the blank"
              value={(selected as string) ?? ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] focus:ring-2 focus:ring-gray-100 transition-all w-44 bg-white"
            />
          </div>
        )}

        {/* Matching */}
        {question.type === 'matching' && question.pairs?.length && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Column A</p>
              {question.pairs.map((p, i) => (
                <div key={i} className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  {i + 1}. {p.left}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Column B</p>
              {[...question.pairs].sort(() => 0.5 - Math.random()).map((p, i) => (
                <div key={i} className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                  {String.fromCharCode(65 + i)}. {p.right}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ordering */}
        {question.type === 'ordering' && question.items?.length && (
          <div className="space-y-2">
            {[...question.items].sort(() => 0.5 - Math.random()).map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700">
                <span className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400 shrink-0">{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Points */}
      {question.points && (
        <div className="ml-10 mt-3">
          <span className={cn(
            'text-[11px] font-medium',
            isAnswered() ? 'text-gray-900' : 'text-gray-400'
          )}>
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Suggested tags ───────────────────────────────────────────────────────────
const SUGGESTED_TAGS = [
  'reading comprehension', 'special ed', 'IEP aligned',
  'K-2', '3-5', '6-8', 'vocabulary', 'phonics', 'fractions', 'math',
];

// ─── Main modal ───────────────────────────────────────────────────────────────
interface FinalizeModalProps {
  onClose: () => void;
}

export function FinalizeModal({ onClose }: FinalizeModalProps) {
  const { activeWorksheet, updateWorksheet } = useWorksheetStore();
  const [publishToMarket, setPublishToMarket] = useState(activeWorksheet?.isPublic ?? false);
  const [tags, setTags] = useState<string[]>(activeWorksheet?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const tagRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const onAnswer = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  if (!activeWorksheet) return null;

  const questions = activeWorksheet.sections.flatMap((s) => s.questions);
  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    return a.length > 0;
  }).length;
  const totalPoints = questions.reduce((s, q) => s + (q.points ?? 1), 0);
  const estimatedMin = Math.max(5, Math.ceil(questions.length * 1.5));

  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const handlePublish = () => {
    updateWorksheet(activeWorksheet.id, {
      status: 'published',
      isPublic: publishToMarket,
      tags,
    });
    setPublished(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal shell */}
      <div className="relative w-full sm:w-[92vw] sm:max-w-5xl h-[94vh] sm:h-[90vh] bg-[#FAFAFA] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'modal-up 0.22s cubic-bezier(0.32,0.72,0,1)' }}
      >

        {/* ── Top bar ──────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center gap-4 px-6 h-14 bg-white border-b border-gray-100">
          {/* Drag indicator (mobile) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 sm:hidden" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {activeWorksheet.title}
              </span>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                Draft
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs text-gray-400">
            <Clock size={12} />
            <span>~{estimatedMin} min</span>
            <span className="mx-1">·</span>
            <span>{totalPoints} pts</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Student Preview ─────────────────────────── */}
          <div className="flex-1 overflow-y-auto bg-gray-50/80">
            {/* Preview header bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-2.5 bg-white/80 backdrop-blur-sm border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gray-500 flex items-center justify-center">
                  <Sparkles size={10} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className={cn('font-semibold', answeredCount > 0 ? 'text-gray-900' : 'text-gray-400')}>
                    {answeredCount}
                  </span>
                  <span>/ {questions.length} answered</span>
                </div>
                {answeredCount > 0 && (
                  <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full transition-all duration-500"
                      style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Worksheet document */}
            <div className="max-w-2xl mx-auto px-6 py-8">
              {/* Paper header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
                  {activeWorksheet.title}
                </h1>
                <p className="text-sm text-gray-400">
                  {activeWorksheet.subject}
                  {activeWorksheet.gradeLevel ? ` · ${activeWorksheet.gradeLevel}` : ''}
                  {activeWorksheet.abilityLevel ? ` · ${activeWorksheet.abilityLevel}` : ''}
                </p>
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Name</p>
                    <div className="border-b border-gray-300 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Date</p>
                    <div className="border-b border-gray-300 h-6" />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <StudentQuestion
                    key={q.id}
                    question={q}
                    index={i}
                    answers={answers}
                    onAnswer={onAnswer}
                  />
                ))}
              </div>

              {/* End of worksheet */}
              <div className="mt-6 flex items-center justify-center">
                <span className="text-xs text-gray-300 tracking-widest uppercase">— End of Worksheet —</span>
              </div>
            </div>
          </div>

          {/* ── Right: Publish settings ───────────────────────── */}
          <div className="w-[300px] shrink-0 flex flex-col bg-white border-l border-gray-100">
            <div className="flex-1 overflow-y-auto p-6 space-y-7">

              {/* Visibility */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Visibility</p>
                <div className="space-y-2">
                  {[
                    {
                      value: false,
                      icon: Lock,
                      label: 'Private',
                      desc: 'Only visible to you and your caseload.',
                    },
                    {
                      value: true,
                      icon: Globe,
                      label: 'Marketplace',
                      desc: 'All teachers can discover and use it.',
                    },
                  ].map(({ value, icon: Icon, label, desc }) => {
                    const active = publishToMarket === value;
                    return (
                      <button
                        key={label}
                        onClick={() => setPublishToMarket(value)}
                        className={cn(
                          'w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150',
                          active
                            ? 'border-gray-1000 bg-gray-50'
                            : 'border-gray-100 hover:border-gray-200 bg-gray-50/60'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          active ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-500'
                        )}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-semibold leading-tight', active ? 'text-gray-900' : 'text-gray-700')}>
                            {label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all',
                          active ? 'border-gray-1000 bg-gray-500' : 'border-gray-300'
                        )}>
                          {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tags</p>

                {/* Input */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#1A8917] focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100 transition-all mb-3">
                  <Tag size={13} className="text-gray-400 ml-2 shrink-0" />
                  <input
                    ref={tagRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                    placeholder="Add a tag…"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                  {tagInput.trim() && (
                    <button
                      onClick={() => addTag(tagInput)}
                      className="px-2.5 py-1 text-xs font-semibold bg-gray-500 text-white rounded-lg mr-0.5 hover:bg-[#1A8917] transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>

                {/* Active tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="group flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-gray-100 text-gray-900 text-xs font-medium"
                      >
                        {t}
                        <button
                          onClick={() => removeTag(t)}
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900"
                        >
                          <X size={9} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested */}
                {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).length > 0 && (
                  <>
                    <p className="text-[11px] text-gray-400 font-medium mb-2">Suggested</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 8).map((t) => (
                        <button
                          key={t}
                          onClick={() => addTag(t)}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-[#1A8917] hover:text-gray-900 hover:bg-gray-50 transition-all"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Publish action */}
            <div className="shrink-0 p-5 border-t border-gray-100">
              {published ? (
                <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-sm">
                  <CheckCircle2 size={16} />
                  Published successfully!
                </div>
              ) : (
                <button
                  onClick={handlePublish}
                  className="w-full py-3.5 rounded-xl bg-gray-500 hover:bg-[#1A8917] active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  {publishToMarket ? 'Publish to Marketplace' : 'Publish Worksheet'}
                </button>
              )}
              <p className="text-center text-[11px] text-gray-400 mt-2.5 leading-relaxed">
                {publishToMarket
                  ? 'Teachers across your school can discover this.'
                  : 'You can publish to the marketplace anytime later.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-up {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
