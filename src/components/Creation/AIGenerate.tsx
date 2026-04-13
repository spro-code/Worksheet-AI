import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Check, Loader2, Image, AlignLeft, CheckSquare, Minus, Link, List, ToggleLeft, Grid, Paperclip, Video, Globe, Target, ChevronUp, X, Upload, Timer, Flag } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import type { AIGenerationSettings, QuestionType } from '../../types';
import { GRADE_LEVELS, ABILITY_LEVELS, SUBJECTS, MOCK_GOALS, GOAL_STATUS_CONFIG } from '../../data/mockData';
import { generateQuestions, generateObjectives } from '../../utils/aiMock';
import { nanoid } from '../../utils/nanoid';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SourceType = 'iep_goals' | 'upload' | 'video_url' | 'website_url';

interface AttachedSource {
  type: SourceType;
  label: string;
  value?: string;
}

const CONTEXT_OPTIONS = [
  { key: 'session_notes', label: 'Session Notes',  desc: 'Recent therapy session notes' },
  { key: 'progress_data', label: 'Progress Data',  desc: 'Goal progress reports' },
  { key: 'goal_mastery',  label: 'Goal Mastery',   desc: 'Align with mastered goals' },
] as const;

type ContextKey = typeof CONTEXT_OPTIONS[number]['key'];

const SOURCE_OPTIONS: { type: SourceType; label: string; icon: React.ReactNode; desc: string; color: string; needsInput?: boolean; inputPlaceholder?: string }[] = [
  { type: 'iep_goals',   label: 'IEP Goals',   icon: <Target size={15} />, desc: 'Pull from student IEP goals', color: 'text-gray-900' },
  { type: 'upload',      label: 'Upload File', icon: <Upload size={15} />, desc: 'PDF, DOCX, image',            color: 'text-orange-600' },
  { type: 'video_url',   label: 'Video Link',  icon: <Video size={15} />,  desc: 'YouTube, Vimeo URL',          color: 'text-red-600',  needsInput: true, inputPlaceholder: 'Paste video URL…' },
  { type: 'website_url', label: 'Website URL', icon: <Globe size={15} />,  desc: 'Wikipedia, educational site', color: 'text-sky-600',  needsInput: true, inputPlaceholder: 'Paste website URL…' },
];

type Step = 'topic' | 'visuals' | 'settings' | 'objectives' | 'generating';

const QUESTION_TYPE_OPTIONS = [
  { type: 'multiple_choice' as QuestionType, label: 'Multiple Choice', icon: <CheckSquare size={15} />, color: 'border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100' },
  { type: 'short_answer' as QuestionType, label: 'Short Answer', icon: <AlignLeft size={15} />, color: 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { type: 'fill_blank' as QuestionType, label: 'Fill in the Blank', icon: <Minus size={15} />, color: 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100' },
  { type: 'matching' as QuestionType, label: 'Matching', icon: <Link size={15} />, color: 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100' },
  { type: 'ordering' as QuestionType, label: 'Ordering', icon: <List size={15} />, color: 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100' },
  { type: 'true_false' as QuestionType, label: 'True / False', icon: <ToggleLeft size={15} />, color: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { type: 'image_question' as QuestionType, label: 'Image Based', icon: <Image size={15} />, color: 'border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100' },
  { type: 'checkbox' as QuestionType, label: 'Mixed Format', icon: <Grid size={15} />, color: 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100' },
];

const STEPS: Step[] = ['topic', 'visuals', 'settings', 'objectives'];
const STEP_LABELS = ['Topic', 'Visuals', 'Settings', 'Objectives'];

export function AIGenerate() {
  const { setCurrentView, setActiveWorksheet, createWorksheet, seedChatFromGeneration, clearChat } = useWorksheetStore();
  const [step, setStep] = useState<Step>('topic');
  const [settings, setSettings] = useState<AIGenerationSettings>({
    source: 'manual',
    topic: '',
    subject: '',
    gradeLevel: '3rd Grade',
    abilityLevel: 'Developing',
    questionTypes: ['multiple_choice', 'short_answer'],
    includeImages: false,
    questionCount: 8,
    difficulty: 'intermediate',
    theme: 'playful',
  });
  const [objectives, setObjectives] = useState<string[]>([]);
  const [generatingObjectives, setGeneratingObjectives] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [attachedSources, setAttachedSources] = useState<AttachedSource[]>([]);
  const [contextToggles, setContextToggles] = useState<Record<ContextKey, boolean>>({ session_notes: false, progress_data: false, goal_mastery: false });
  const [urlInput, setUrlInput] = useState('');
  const [pendingSource, setPendingSource] = useState<SourceType | null>(null);
  const [attachedGoalId, setAttachedGoalId] = useState<string | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(20);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!sourcesRef.current?.contains(target)) {
        setSourcesOpen(false);
        setPendingSource(null);
        setUrlInput('');
      }
      if (!contextRef.current?.contains(target)) {
        setContextOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addSource = (type: SourceType, value?: string) => {
    const opt = SOURCE_OPTIONS.find((o) => o.type === type)!;
    if (attachedSources.find((s) => s.type === type)) return;
    if (type === 'upload') {
      setSourcesOpen(false);
      fileInputRef.current?.click();
      return;
    }
    setAttachedSources((p) => [...p, { type, label: opt.label, value }]);
    setSourcesOpen(false);
    setPendingSource(null);
    setUrlInput('');
    textareaRef.current?.focus();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedSources((p) => [...p, { type: 'upload', label: file.name, value: file.name }]);
    textareaRef.current?.focus();
    e.target.value = '';
  };

  const removeSource = (type: SourceType) => {
    setAttachedSources((p) => p.filter((s) => s.type !== type));
    if (type === 'iep_goals') {
      setContextToggles({ session_notes: false, progress_data: false, goal_mastery: false });
      setContextOpen(false);
    }
  };

  const toggleContext = (key: ContextKey) =>
    setContextToggles((p) => ({ ...p, [key]: !p[key] }));

  const activeContextCount = Object.values(contextToggles).filter(Boolean).length;

  const stepIndex = STEPS.indexOf(step);
  const next = async () => {
    if (step === 'settings') {
      setStep('objectives');
      setGeneratingObjectives(true);
      const objs = await generateObjectives(settings.topic || '', settings.gradeLevel || '', settings.abilityLevel);
      setObjectives(objs);
      setGeneratingObjectives(false);
    } else if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]);
    }
  };
  const back = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
    else setCurrentView('create_method');
  };

  const toggleType = (type: QuestionType) => {
    const cur = settings.questionTypes || [];
    setSettings((s) => ({ ...s, questionTypes: cur.includes(type) ? cur.filter((t) => t !== type) : [...cur, type] }));
  };

  const handleGenerate = async () => {
    setStep('generating');
    setGenerationPhase(0);
    setGenerationError(null);
    try {
      // Phase 1: "Reading your objectives" — brief visual beat
      setGenerationPhase(1);
      await new Promise((r) => setTimeout(r, 650));

      // Phase 2: "Generating questions" — the actual API call happens here
      setGenerationPhase(2);
      const questions = await generateQuestions(settings);

      // Phase 3: "Building your worksheet" — brief visual beat before navigating
      setGenerationPhase(3);
      const ws = createWorksheet({
        title: `${settings.topic || 'New'} – ${settings.gradeLevel}`,
        subject: settings.subject || 'Other',
        gradeLevel: settings.gradeLevel || '3rd Grade',
        abilityLevel: settings.abilityLevel,
        theme: settings.theme || 'playful',
        sections: [{ id: nanoid(), title: 'Questions', questions }],
        questionCount: questions.length,
        status: 'draft',
        attachedGoalId: attachedGoalId ?? undefined,
        timerEnabled,
        timeLimit: timerEnabled ? timerMinutes : undefined,
      });
      await new Promise((r) => setTimeout(r, 700));

      setActiveWorksheet(ws);
      clearChat();
      seedChatFromGeneration(settings.topic || 'this topic', objectives);
      setCurrentView('editor');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setGenerationError(msg);
      setStep('settings');
    }
  };

  const canNext = step === 'topic' ? (settings.topic || '').trim().length > 0
    : step === 'settings' ? (settings.questionTypes || []).length > 0
    : true;

  if (step === 'generating') {
    const phases = [
      { label: 'Reading your objectives', detail: `Aligning to ${objectives.length} learning goals` },
      { label: 'Generating questions', detail: `Creating ${settings.questionCount} questions for ${settings.gradeLevel}` },
      { label: 'Building your worksheet', detail: 'Formatting and adding answer keys' },
    ];

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-sm space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 rounded-2xl bg-gray-500 flex items-center justify-center shadow-lg shadow-gray-200">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl border-2 border-gray-200 animate-ping opacity-30" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">Building your worksheet</h2>
            <p className="text-sm text-gray-400">
              {settings.questionCount} questions · {settings.gradeLevel} · {settings.abilityLevel || 'Developing'}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {phases.map((phase, i) => {
              const done = generationPhase > i + 1;
              const active = generationPhase === i + 1;
              return (
                <div key={i} className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300',
                  done ? 'bg-gray-50 border-gray-100' :
                  active ? 'bg-white border-gray-300 shadow-sm shadow-gray-200' :
                  'bg-gray-50 border-gray-100'
                )}>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                    done ? 'bg-gray-500' : active ? 'bg-white border-2 border-[#1A8917]' : 'bg-gray-200'
                  )}>
                    {done
                      ? <Check size={14} className="text-white" />
                      : active
                      ? <Loader2 size={14} className="text-gray-900 animate-spin" />
                      : <div className="w-2 h-2 rounded-full bg-gray-400" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium', done ? 'text-gray-900' : active ? 'text-gray-900' : 'text-gray-400')}>
                      {phase.label}
                    </p>
                    <p className={cn('text-xs mt-0.5', done ? 'text-gray-900' : active ? 'text-gray-500' : 'text-gray-300')}>
                      {phase.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Topic pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A8917] animate-pulse" />
              {settings.topic}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
    <div className="max-w-xl mx-auto px-6 py-10 animate-fade-in">
      <Button variant="ghost" size="sm" onClick={back} className="mb-7 -ml-1 text-gray-500">
        <ArrowLeft size={15} /> {stepIndex === 0 ? 'Back to Methods' : 'Back'}
      </Button>

      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5 flex-1">
            <div className={cn('h-1 flex-1 rounded-full transition-all duration-500', i <= stepIndex ? 'bg-gray-500' : 'bg-gray-200')} />
          </div>
        ))}
        <span className="text-xs text-gray-400 shrink-0 ml-1">{STEP_LABELS[stepIndex]}</span>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {/* STEP: Topic */}
          {step === 'topic' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Describe your worksheet</h2>
                <p className="text-sm text-gray-500">Tell AI what to create — or attach a source below</p>
              </div>

              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={handleFileSelected} />

              {/* Prompt box */}
              <div className="rounded-2xl border-2 border-gray-200 focus-within:border-[#1A8917] transition-colors bg-white shadow-sm">
                {/* Attached chips */}
                {attachedSources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-3.5 pt-3 pb-0">
                    {attachedSources.map((src) => {
                      const opt = SOURCE_OPTIONS.find((o) => o.type === src.type)!;
                      return (
                        <span key={src.type} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-900 border border-gray-200">
                          <span className={opt.color}>{opt.icon}</span>
                          <span className="max-w-[120px] truncate">{src.value && src.type === 'upload' ? src.value : src.label}</span>
                          <button onClick={() => removeSource(src.type)} className="rounded-full hover:bg-gray-200 p-0.5 transition-colors ml-0.5">
                            <X size={10} className="text-gray-900" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  autoFocus
                  rows={5}
                  value={settings.topic}
                  onChange={(e) => setSettings((s) => ({ ...s, topic: e.target.value }))}
                  placeholder="e.g. Create a multiplication worksheet for 3rd graders with visual supports and word problems…"
                  className="w-full px-4 pt-3.5 pb-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none bg-transparent leading-relaxed"
                />

                {/* Toolbar */}
                <div className="flex items-center gap-1.5 px-3 pb-3 pt-1 border-t border-gray-100 mt-1 relative">

                  {/* Sources popover */}
                  <div className="relative" ref={sourcesRef}>
                    <button
                      onClick={() => { setSourcesOpen(!sourcesOpen); setContextOpen(false); setPendingSource(null); setUrlInput(''); }}
                      className={cn(
                        'flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all',
                        sourcesOpen || attachedSources.length > 0
                          ? 'bg-gray-50 text-gray-900 ring-1 ring-gray-200'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      )}
                    >
                      <Paperclip size={13} />
                      Sources
                      {attachedSources.length > 0 && (
                        <span className="w-4 h-4 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                          {attachedSources.length}
                        </span>
                      )}
                    </button>

                    {/* Sources dropdown — opens upward */}
                    {sourcesOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        {pendingSource === null ? (
                          <>
                            <div className="px-4 pt-3.5 pb-2.5">
                              <p className="text-sm font-semibold text-gray-900">Add a source</p>
                              <p className="text-xs text-gray-400 mt-0.5">AI will use this to personalize your worksheet</p>
                            </div>
                            <div className="px-2 pb-2 space-y-0.5">
                              {SOURCE_OPTIONS.map((opt) => {
                                const already = attachedSources.some((s) => s.type === opt.type);
                                return (
                                  <button
                                    key={opt.type}
                                    disabled={already}
                                    onClick={() => opt.needsInput ? setPendingSource(opt.type) : addSource(opt.type)}
                                    className={cn(
                                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group',
                                      already ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                                    )}
                                  >
                                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 group-hover:bg-white transition-colors', already && 'bg-gray-50')}>
                                      <span className={opt.color}>{opt.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 leading-none mb-0.5">{opt.label}</p>
                                      <p className="text-xs text-gray-400">{opt.desc}</p>
                                    </div>
                                    {already
                                      ? <Check size={13} className="text-gray-900 shrink-0" />
                                      : <ArrowRight size={13} className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    }
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="p-4 space-y-3">
                            <button onClick={() => { setPendingSource(null); setUrlInput(''); }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                              <ArrowLeft size={12} /> Back
                            </button>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-1.5">
                                {SOURCE_OPTIONS.find((o) => o.type === pendingSource)?.label}
                              </p>
                              <input
                                autoFocus
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder={SOURCE_OPTIONS.find((o) => o.type === pendingSource)?.inputPlaceholder}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1A8917] focus:ring-2 focus:ring-gray-100 placeholder:text-gray-300"
                                onKeyDown={(e) => { if (e.key === 'Enter' && urlInput.trim()) addSource(pendingSource, urlInput.trim()); }}
                              />
                            </div>
                            <Button size="sm" className="w-full" disabled={!urlInput.trim()} onClick={() => addSource(pendingSource, urlInput.trim())}>
                              Attach source
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Context popover — only when IEP Goals attached */}
                  {attachedSources.some((s) => s.type === 'iep_goals') && (
                    <div className="relative" ref={contextRef}>
                      <button
                        onClick={() => { setContextOpen(!contextOpen); setSourcesOpen(false); }}
                        className={cn(
                          'flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all',
                          contextOpen || activeContextCount > 0
                            ? 'bg-gray-50 text-gray-900 ring-1 ring-gray-200'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        )}
                      >
                        <Sparkles size={13} />
                        Context
                        {activeContextCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                            {activeContextCount}
                          </span>
                        )}
                      </button>

                      {/* Context dropdown — opens upward */}
                      {contextOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                          <div className="px-4 pt-3.5 pb-2.5">
                            <p className="text-sm font-semibold text-gray-900">Goal context</p>
                            <p className="text-xs text-gray-400 mt-0.5">Include additional student data</p>
                          </div>
                          <div className="px-2 pb-2 space-y-0.5">
                            {CONTEXT_OPTIONS.map(({ key, label, desc }) => (
                              <button
                                key={key}
                                onClick={() => toggleContext(key)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 leading-none mb-0.5">{label}</p>
                                  <p className="text-xs text-gray-400">{desc}</p>
                                </div>
                                <div className={cn('w-9 h-5 rounded-full transition-all relative shrink-0 flex-shrink-0', contextToggles[key] ? 'bg-gray-500' : 'bg-gray-200')}>
                                  <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150', contextToggles[key] ? 'left-4' : 'left-0.5')} />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Subject + Grade + Ability inline */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Select value={settings.subject || ''} onValueChange={(v) => setSettings((s) => ({ ...s, subject: v }))}>
                    <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                    <SelectContent>{SUBJECTS.map((sub) => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Grade Level</Label>
                  <Select value={settings.gradeLevel} onValueChange={(v) => setSettings((s) => ({ ...s, gradeLevel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{GRADE_LEVELS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Ability Level</Label>
                  <Select value={settings.abilityLevel} onValueChange={(v) => setSettings((s) => ({ ...s, abilityLevel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ABILITY_LEVELS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* STEP: Visuals */}
          {step === 'visuals' && (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Visual questions?</h2>
                  <p className="text-sm text-gray-500">AI can generate educational illustrations</p>
                </div>
                <button
                  onClick={() => { setSettings((s) => ({ ...s, includeImages: undefined })); next(); }}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors shrink-0 mt-1 underline underline-offset-2"
                >
                  Skip
                </button>
              </div>
              <div className="space-y-2">
                {[
                  {
                    value: false as boolean | 'mixed',
                    label: 'Text only',
                    desc: 'Clean, no images',
                    icon: (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <AlignLeft size={20} className="text-gray-400" />
                      </div>
                    ),
                  },
                  {
                    value: true as boolean | 'mixed',
                    label: 'Yes – include AI images',
                    desc: 'Real photos for every question',
                    icon: (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Image size={20} className="text-gray-900" />
                      </div>
                    ),
                  },
                  {
                    value: 'mixed' as boolean | 'mixed',
                    label: 'Mixed',
                    desc: 'Some with photos, some text only',
                    icon: (
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                        <Grid size={20} className="text-sky-500" />
                      </div>
                    ),
                  },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setSettings((s) => ({ ...s, includeImages: opt.value }))}
                    className={cn(
                      'w-full flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all',
                      settings.includeImages === opt.value
                        ? 'border-[#1A8917] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    )}
                  >
                    {opt.icon}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                      settings.includeImages === opt.value ? 'bg-gray-500 border-gray-1000' : 'border-gray-300'
                    )}>
                      {settings.includeImages === opt.value && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Error banner */}
          {generationError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <strong>Generation failed:</strong> {generationError}
            </div>
          )}

          {/* STEP: Settings + Question Types */}
          {step === 'settings' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Worksheet settings</h2>
                <p className="text-sm text-gray-500">Choose question types and fine-tune your worksheet</p>
              </div>

              <div className="space-y-2">
                <Label>Question types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTION_TYPE_OPTIONS.map((opt) => {
                    const sel = (settings.questionTypes || []).includes(opt.type);
                    return (
                      <button
                        key={opt.label}
                        onClick={() => toggleType(opt.type)}
                        className={cn(
                          'flex items-center gap-2.5 p-3 rounded-lg border-2 text-sm font-medium text-left transition-all',
                          sel ? opt.color : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        )}
                      >
                        {opt.icon}
                        <span className="flex-1">{opt.label}</span>
                        {sel && <Check size={13} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Number of questions</Label>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={settings.questionCount}
                    onChange={(e) => {
                      const v = Math.min(20, Math.max(3, Number(e.target.value) || 3));
                      setSettings((s) => ({ ...s, questionCount: v }));
                    }}
                    className="w-16 text-center text-sm font-semibold tabular-nums rounded-lg border border-gray-200 py-1 focus:outline-none focus:border-[#1A8917] focus:ring-2 focus:ring-gray-100 text-gray-900 bg-gray-50"
                  />
                </div>
                <input type="range" min="3" max="20" value={settings.questionCount}
                  onChange={(e) => setSettings((s) => ({ ...s, questionCount: Number(e.target.value) }))}
                  className="w-full accent-[#1A8917]" />
              </div>

              <Separator />

              {/* Goal attachment */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flag size={13} className="text-[#1A8917]" />
                  <Label>Attach to IEP Goal <span className="text-gray-400 font-normal">(optional)</span></Label>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setAttachedGoalId(null)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm',
                      attachedGoalId === null
                        ? 'border-[#1A8917] bg-green-50 text-[#1A8917] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    )}
                  >
                    <span className="text-base">—</span>
                    <span>No goal attachment</span>
                    {attachedGoalId === null && <Check size={13} className="ml-auto shrink-0" />}
                  </button>
                  {MOCK_GOALS.map((goal) => {
                    const st = GOAL_STATUS_CONFIG[goal.status];
                    const isSelected = attachedGoalId === goal.id;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setAttachedGoalId(isSelected ? null : goal.id)}
                        className={cn(
                          'w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                          isSelected
                            ? 'border-[#1A8917] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium truncate', isSelected ? 'text-[#1A8917]' : 'text-gray-800')}>{goal.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{goal.type} · {goal.tags.join(', ')}</p>
                        </div>
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5', st.bg, st.color)}>
                          {st.label}
                        </span>
                        {isSelected && <Check size={13} className="text-[#1A8917] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Timer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer size={13} className="text-gray-500" />
                    <Label>Timed worksheet</Label>
                  </div>
                  <button
                    onClick={() => setTimerEnabled((v) => !v)}
                    className={cn('w-10 h-5.5 rounded-full transition-all relative shrink-0', timerEnabled ? 'bg-[#1A8917]' : 'bg-gray-200')}
                    style={{ height: '22px', width: '40px' }}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150', timerEnabled ? 'left-5' : 'left-0.5')} />
                  </button>
                </div>
                {timerEnabled && (
                  <div className="flex items-center gap-3 pl-5">
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(Number(e.target.value))}
                      className="flex-1 accent-[#1A8917]"
                    />
                    <div className="flex items-center gap-1.5 w-24 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(Math.min(120, Math.max(1, Number(e.target.value) || 1)))}
                        className="w-14 text-center text-sm font-semibold tabular-nums rounded-lg border border-gray-200 py-1 focus:outline-none focus:border-[#1A8917] text-gray-900 bg-gray-50"
                      />
                      <span className="text-xs text-gray-400">min</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP: Objectives */}
          {step === 'objectives' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Learning objectives</h2>
                <p className="text-sm text-gray-500">Review and edit before generating your worksheet</p>
              </div>

              {generatingObjectives ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3 animate-pulse">
                  {[80, 95, 70, 88, 75].map((w, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-2" />
                      <div className="h-3.5 bg-gray-200 rounded" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-[#1A8917] focus-within:ring-2 focus-within:ring-gray-100 transition-all">
                  <textarea
                    autoFocus
                    rows={objectives.length + 2}
                    value={objectives.map((o) => `• ${o}`).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value
                        .split('\n')
                        .map((l) => l.replace(/^[•\-]\s*/, '').trim())
                        .filter((l) => l.length > 0);
                      setObjectives(lines);
                    }}
                    className="w-full px-4 py-3.5 text-sm text-gray-800 bg-transparent resize-none focus:outline-none leading-7 font-[inherit]"
                  />
                  <div className="px-4 py-2 border-t border-gray-100 bg-white">
                    <p className="text-xs text-gray-400">Each line is one objective · Edit freely</p>
                  </div>
                </div>
              )}
            </>
          )}

          <Separator />

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-1">
            <Button variant="outline" size="sm" onClick={back}>
              <ArrowLeft size={14} /> Back
            </Button>
            {step === 'objectives' ? (
              <Button variant="gradient" onClick={handleGenerate} disabled={objectives.length === 0 || generatingObjectives}>
                <Sparkles size={15} /> Generate Worksheet
              </Button>
            ) : step === 'settings' ? (
              <Button onClick={next} disabled={!canNext}>
                <Sparkles size={14} /> Generate Learning Objectives
              </Button>
            ) : (
              <Button size="sm" onClick={next} disabled={!canNext}>
                Continue <ArrowRight size={14} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
