import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, Loader2, CheckSquare } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { getWorksheetChatResponse } from '../../utils/aiMock';
import { buildQuestionImage } from '../../utils/questionImages';
import { nanoid } from '../../utils/nanoid';
import type { Question } from '../../types';
import type { RawQuestion } from '../../lib/ai/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const numbered = line.match(/^(\d+)\. (.+)/);
        if (numbered) return (
          <div key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="text-gray-500 font-semibold shrink-0 tabular-nums">{numbered[1]}.</span>
            <span className="text-gray-700">{numbered[2]}</span>
          </div>
        );
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-sm leading-relaxed text-gray-700">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-gray-900">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

const SUGGESTIONS = [
  { label: 'Make questions easier', icon: '✦' },
  { label: 'Add visual hints', icon: '👁' },
  { label: 'Add scaffolding', icon: '🧱' },
  { label: 'Align to IEP goals', icon: '🎯' },
  { label: 'Add word problems', icon: '📝' },
  { label: 'More questions', icon: '➕' },
];

interface AISidebarProps {
  onFinalize: () => void;
}

export function AISidebar({ onFinalize }: AISidebarProps) {
  const { chatMessages, addChatMessage, isChatLoading, setChatLoading, activeWorksheet, updateWorksheet } = useWorksheetStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || isChatLoading) return;
    setInput('');
    addChatMessage({ role: 'user', content: msg });
    setChatLoading(true);

    const history = chatMessages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await getWorksheetChatResponse(msg, activeWorksheet, history);

      if (activeWorksheet && response.updatedWorksheet?.sections?.length) {
        const newSections = response.updatedWorksheet.sections.map((s, i) => {
          const rawQuestions = s.questions as RawQuestion[];
          const questions: Question[] = rawQuestions.map((q) => {
            const { imageSpec, ...rest } = q;
            const question: Question = { ...rest, id: nanoid() };
            if (q.type === 'image_question') {
              question.imageUrl = buildQuestionImage(imageSpec ?? null, q.text, 0);
            }
            return question;
          });
          return {
            id: activeWorksheet.sections[i]?.id ?? nanoid(),
            title: s.title,
            questions,
          };
        });

        const totalQuestions = newSections.reduce((n, s) => n + s.questions.length, 0);
        updateWorksheet(activeWorksheet.id, {
          title: response.updatedWorksheet.title ?? activeWorksheet.title,
          sections: newSections,
          questionCount: totalQuestions,
        });
      }

      const assumptions = response.assumptions?.filter(Boolean) ?? [];
      const displayText = assumptions.length > 0
        ? `${response.responseMessage}\n\n_Assumed: ${assumptions.join('; ')}_`
        : response.responseMessage;

      addChatMessage({ role: 'assistant', content: displayText });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const hasMessages = chatMessages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-500 flex items-center justify-center shadow-sm shadow-gray-200">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-4 space-y-4">
          {!hasMessages ? (
            /* Empty state */
            <div className="space-y-4">
              {/* Primary CTA */}
              <button
                onClick={onFinalize}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gray-500 text-white text-left shadow-md shadow-gray-200 hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.01] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <CheckSquare size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">Finalize Worksheet</p>
                  <p className="text-[11px] text-white/75 mt-0.5 leading-relaxed">Preview, add tags &amp; publish</p>
                </div>
                <span className="text-white/50 group-hover:text-white/80 text-lg transition-colors">→</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">or refine first</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* AI suggestions */}
              <div className="space-y-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all group"
                  >
                    <span className="text-base leading-none">{s.icon}</span>
                    <span className="flex-1 font-medium">{s.label}</span>
                    <span className="text-gray-300 group-hover:text-gray-400 text-xs">↗</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat thread */
            <div className="space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2 animate-fade-in',
                    msg.role === 'user' ? 'justify-end' : 'items-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-gray-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={11} className="text-white" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm',
                    msg.role === 'user'
                      ? 'bg-gray-500 text-white rounded-tr-sm leading-relaxed'
                      : 'bg-gray-50 rounded-tl-sm'
                  )}>
                    {msg.role === 'user'
                      ? msg.content
                      : <MessageContent content={msg.content} />
                    }
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isChatLoading && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="w-6 h-6 rounded-md bg-gray-500 flex items-center justify-center shrink-0">
                    <Sparkles size={11} className="text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick replies after response */}
              {!isChatLoading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.label)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── Input ──────────────────────────────────────────── */}
      <div className="shrink-0 p-3 border-t border-gray-100">
        <div className="relative rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#1A8917] focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to modify your worksheet…"
            rows={2}
            className="w-full resize-none bg-transparent px-3.5 pt-3 pb-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none leading-relaxed"
          />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            <span className="text-[10px] text-gray-300 hidden sm:block">⏎ send</span>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isChatLoading}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                input.trim() && !isChatLoading
                  ? 'bg-gray-500 text-white hover:bg-[#1A8917] shadow-sm shadow-gray-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              {isChatLoading
                ? <Loader2 size={13} className="animate-spin" />
                : <ArrowUp size={13} />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
