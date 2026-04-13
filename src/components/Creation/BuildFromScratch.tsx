import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PenLine, Check, Flag, Timer } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import type { WorksheetTheme } from '../../types';
import { THEMES, GRADE_LEVELS, SUBJECTS, MOCK_GOALS, GOAL_STATUS_CONFIG } from '../../data/mockData';
import { nanoid } from '../../utils/nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { listVariants, itemVariants } from '@/lib/motion';

export function BuildFromScratch() {
  const { setCurrentView, createWorksheet, setActiveWorksheet } = useWorksheetStore();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [grade, setGrade] = useState('3rd Grade');
  const [theme, setTheme] = useState<WorksheetTheme>('playful');
  const [description, setDescription] = useState('');
  const [attachedGoalId, setAttachedGoalId] = useState<string | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(20);

  const handleStart = () => {
    const ws = createWorksheet({
      title: title || 'Untitled Worksheet',
      subject, gradeLevel: grade, theme, description,
      sections: [{ id: nanoid(), title: 'Section 1', questions: [] }],
      questionCount: 0, status: 'draft',
      attachedGoalId: attachedGoalId ?? undefined,
      timerEnabled,
      timeLimit: timerEnabled ? timerMinutes : undefined,
    });
    setActiveWorksheet(ws);
    setCurrentView('editor');
  };

  return (
    <div className="h-full overflow-y-auto">
    <div className="max-w-lg mx-auto px-6 py-10">
      <Button variant="ghost" size="sm" onClick={() => setCurrentView('create_method')} className="mb-7 -ml-1 text-gray-500">
        <ArrowLeft size={15} /> Back to Methods
      </Button>

      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <PenLine size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Build from Scratch</h1>
          <p className="text-sm text-gray-500">Start with a blank worksheet</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut', delay: 0.05 }}>
      <Card>
        <CardContent className="p-6">
          <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-1.5">
            <Label htmlFor="title">Worksheet Title</Label>
            <Input id="title" autoFocus placeholder="e.g. Multiplication Practice – Week 3" value={title} onChange={(e) => setTitle(e.target.value)} />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <Label htmlFor="desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Textarea id="desc" rows={2} placeholder="Brief description…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Grade Level</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADE_LEVELS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}><Separator /></motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(THEMES) as [WorksheetTheme, typeof THEMES[WorksheetTheme]][]).map(([key, t]) => (
                <motion.button key={key} onClick={() => setTheme(key)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.92 }}
                  className={cn('relative p-2 rounded-lg border-2 text-center transition-all',
                    theme === key ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  )}>
                  <div className={`h-4 rounded ${t.colors} mb-1`} />
                  <span className="text-xs text-gray-700 block leading-tight">{t.label}</span>
                  <span className="text-sm">{t.emoji}</span>
                  {theme === key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <Check size={9} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}><Separator /></motion.div>

          {/* Goal attachment */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-2">
              <Flag size={13} className="text-[#1A8917]" />
              <Label>Attach to IEP Goal <span className="text-gray-400 font-normal">(optional)</span></Label>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => setAttachedGoalId(null)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all text-sm',
                  attachedGoalId === null
                    ? 'border-[#1A8917] bg-green-50 text-[#1A8917] font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-500'
                )}
              >
                <span>—</span>
                <span>No goal attachment</span>
                {attachedGoalId === null && <Check size={12} className="ml-auto shrink-0" />}
              </button>
              {MOCK_GOALS.map((goal) => {
                const st = GOAL_STATUS_CONFIG[goal.status];
                const isSelected = attachedGoalId === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setAttachedGoalId(isSelected ? null : goal.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'border-[#1A8917] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', isSelected ? 'text-[#1A8917]' : 'text-gray-800')}>{goal.title}</p>
                      <p className="text-xs text-gray-400 truncate">{goal.type}</p>
                    </div>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', st.bg, st.color)}>
                      {st.label}
                    </span>
                    {isSelected && <Check size={12} className="text-[#1A8917] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}><Separator /></motion.div>

          {/* Timer */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={13} className="text-gray-500" />
                <Label>Timed worksheet</Label>
              </div>
              <button
                onClick={() => setTimerEnabled((v) => !v)}
                style={{ height: '22px', width: '40px' }}
                className={cn('rounded-full transition-all relative shrink-0', timerEnabled ? 'bg-[#1A8917]' : 'bg-gray-200')}
              >
                <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150', timerEnabled ? 'left-5' : 'left-0.5')} />
              </button>
            </div>
            {timerEnabled && (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number(e.target.value))}
                  className="flex-1 accent-[#1A8917]"
                />
                <div className="flex items-center gap-1.5 shrink-0">
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
          </motion.div>

          <motion.div variants={itemVariants} whileTap={{ scale: 0.98 }}>
            <Button className="w-full" onClick={handleStart}>
              <PenLine size={15} /> Start Building
            </Button>
          </motion.div>
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
    </div>
  );
}
