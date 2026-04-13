import { useState, useCallback, useEffect, useRef } from 'react';
import { X, CheckCircle2, ChevronLeft, ChevronRight, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Worksheet, Question } from '../../types';

type Answers = Record<string, string | string[]>;

// ─── Single interactive question ─────────────────────────────────────────────

function TestQuestion({
  question,
  index,
  total,
  answers,
  onAnswer,
}: {
  question: Question;
  index: number;
  total: number;
  answers: Answers;
  onAnswer: (id: string, value: string | string[]) => void;
}) {
  const selected = answers[question.id];

  const isOptionSelected = (key: string) =>
    Array.isArray(selected) ? selected.includes(key) : selected === key;

  const toggleCheckbox = (key: string) => {
    const cur = (answers[question.id] as string[]) ?? [];
    onAnswer(question.id, cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Question {index + 1} of {total}
        </span>
        {question.points && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Award size={11} /> {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        )}
      </div>

      {/* Question text */}
      <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-6">
        {question.text}
      </h2>

      {/* Image */}
      {question.imageUrl && (
        <div className="mb-6">
          <img src={question.imageUrl} alt="" className="rounded-2xl max-h-48 object-contain border border-gray-100 shadow-sm" />
        </div>
      )}

      {/* Hint */}
      {question.hint && (
        <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
          <span className="text-amber-400 shrink-0 text-sm">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">{question.hint}</p>
        </div>
      )}

      {/* Answers */}
      <div className="flex-1 space-y-2.5">

        {/* MCQ / image_question */}
        {(question.type === 'multiple_choice' || question.type === 'image_question') &&
          question.options?.map((opt) => {
            const key = opt.id ?? opt.text;
            const sel = isOptionSelected(key);
            return (
              <button
                key={key}
                onClick={() => onAnswer(question.id, key)}
                className={cn(
                  'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-150 active:scale-[0.99]',
                  sel
                    ? 'border-gray-1000 bg-gray-500 text-white shadow-md shadow-gray-200'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                  sel ? 'border-white' : 'border-gray-300'
                )}>
                  {sel && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
                {opt.text}
              </button>
            );
          })}

        {/* True/False */}
        {question.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-3">
            {['True', 'False'].map((v) => {
              const sel = selected === v;
              return (
                <button
                  key={v}
                  onClick={() => onAnswer(question.id, v)}
                  className={cn(
                    'py-5 rounded-2xl border-2 text-base font-semibold transition-all duration-150 active:scale-[0.98]',
                    sel
                      ? 'border-gray-1000 bg-gray-500 text-white shadow-md shadow-gray-200'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
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
            const key = opt.id ?? opt.text;
            const sel = isOptionSelected(key);
            return (
              <button
                key={key}
                onClick={() => toggleCheckbox(key)}
                className={cn(
                  'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-150',
                  sel
                    ? 'border-gray-1000 bg-gray-500 text-white shadow-md shadow-gray-200'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all',
                  sel ? 'border-white bg-white/20' : 'border-gray-300'
                )}>
                  {sel && <span className="text-white text-xs font-bold leading-none">✓</span>}
                </div>
                {opt.text}
              </button>
            );
          })}

        {/* Short answer */}
        {question.type === 'short_answer' && (
          <input
            type="text"
            placeholder="Type your answer…"
            value={(selected as string) ?? ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] focus:ring-4 focus:ring-gray-300 shadow-sm transition-all"
          />
        )}

        {/* Paragraph */}
        {question.type === 'paragraph' && (
          <textarea
            placeholder="Write your response here…"
            value={(selected as string) ?? ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            rows={5}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] focus:ring-4 focus:ring-gray-300 shadow-sm transition-all resize-none"
          />
        )}

        {/* Fill blank */}
        {question.type === 'fill_blank' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 shrink-0">Answer:</span>
            <input
              type="text"
              placeholder="fill in the blank"
              value={(selected as string) ?? ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1A8917] transition-all shadow-sm"
            />
          </div>
        )}

        {/* Matching */}
        {question.type === 'matching' && question.pairs?.length && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Column A</p>
              {question.pairs.map((p, i) => (
                <div key={i} className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm">
                  {i + 1}. {p.left}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Column B</p>
              {[...question.pairs].sort(() => 0.5 - Math.random()).map((p, i) => (
                <div key={i} className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm">
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
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm">
                <span className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-semibold shrink-0">{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Completion screen ────────────────────────────────────────────────────────

function CompletionScreen({ total, answered, onClose }: { total: number; answered: number; onClose: () => void }) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-[#1A8917] flex items-center justify-center mb-6 shadow-xl shadow-gray-200">
        <CheckCircle2 size={36} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted!</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs">
        {answered} of {total} questions answered ({pct}% completion).
        Your teacher will review your responses.
      </p>
      <div className="w-48 h-2 rounded-full bg-gray-100 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gray-500 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-2xl bg-[#1A8917] text-white text-sm font-semibold hover:bg-[#0F730C] transition-colors"
      >
        Close
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface TakeTestModalProps {
  worksheet: Worksheet;
  studentName: string;
  onClose: () => void;
}

export function TakeTestModal({ worksheet, studentName, onClose }: TakeTestModalProps) {
  const questions = worksheet.sections.flatMap((s) => s.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex((i) => i - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, currentIndex, questions.length]);

  const onAnswer = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    if (!a) return false;
    return Array.isArray(a) ? a.length > 0 : a.length > 0;
  }).length;

  const currentQ = questions[currentIndex];
  const isAnswered = (q: Question) => {
    const a = answers[q.id];
    if (!a) return false;
    return Array.isArray(a) ? a.length > 0 : a.length > 0;
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'modal-up 0.2s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center gap-4 px-6 py-4 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">{studentName}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{worksheet.title}</p>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg shrink-0">
            <Clock size={11} />
            {formatTime(elapsed)}
          </div>

          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors shrink-0">
            <X size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="shrink-0 h-1 bg-gray-100">
          <div
            className="h-full bg-gray-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Question dots sidebar */}
          <div className="shrink-0 w-12 flex flex-col items-center gap-1.5 py-5 border-r border-gray-50 overflow-y-auto">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                title={`Question ${i + 1}`}
                className={cn(
                  'w-6 h-6 rounded-lg text-[10px] font-bold transition-all duration-150 shrink-0',
                  i === currentIndex
                    ? 'bg-gray-500 text-white shadow-sm shadow-gray-200'
                    : isAnswered(q)
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-8">
            {submitted ? (
              <CompletionScreen total={questions.length} answered={answeredCount} onClose={onClose} />
            ) : (
              currentQ && (
                <TestQuestion
                  question={currentQ}
                  index={currentIndex}
                  total={questions.length}
                  answers={answers}
                  onAnswer={onAnswer}
                />
              )
            )}
          </div>
        </div>

        {/* Footer navigation */}
        {!submitted && (
          <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            <span className="text-xs text-gray-400">
              {answeredCount} / {questions.length} answered
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-800 border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gray-500 hover:bg-[#1A8917] transition-all shadow-md shadow-gray-200 active:scale-[0.98]"
              >
                <CheckCircle2 size={14} /> Submit
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modal-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
