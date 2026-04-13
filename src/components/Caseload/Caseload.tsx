import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreVertical, ChevronRight, ChevronDown, FileText, Send, Users, Pencil, UserPlus, Download, Settings, ClipboardList, CheckSquare, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { AssignModal } from '../Library/AssignModal';
import { TakeTestModal } from '../Editor/TakeTestModal';
import { cn } from '@/lib/utils';
import type { Worksheet } from '../../types';
import { MOCK_GOALS, GOAL_STATUS_CONFIG, MOCK_PROGRAMS } from '../../data/mockData';
import type { GoalStatus, IEPGoal, IEPProgram } from '../../data/mockData';
import { tabVariants } from '@/lib/motion';

type ProfileTab = 'Profile' | 'Goals' | 'Worksheets';

const PROFILE_TABS: ProfileTab[] = ['Profile', 'Goals', 'Worksheets'];

const STUDENTS = [
  {
    id: '1', name: 'Alex Johnson',   avatar: 'AJ', color: 'bg-gray-100 text-gray-900',
    school: 'Lincoln Elementary', grade: '3rd', dob: '05/12/2016', disability: 'Autism Spectrum',
    iepDue: '08/15/2026', evalDue: '11/20/2026', iepServiceTime: 120,
    serviceTime: [{ label: 'Speech', value: '45/week' }, { label: 'OT', value: '30/week' }],
    collaborators: ['SB', 'TK'], goals: 4, worksheetsCount: 3, archived: false,
    assigned: 8, completed: 5, lastActive: '2026-04-08',
  },
  {
    id: '2', name: 'Maya Patel',     avatar: 'MP', color: 'bg-sky-100 text-sky-700',
    school: 'Lincoln Elementary', grade: '4th', dob: '03/22/2015', disability: 'ADHD',
    iepDue: '06/17/2026', evalDue: '12/08/2026', iepServiceTime: 0,
    serviceTime: [{ label: 'Counseling', value: '30/week' }],
    collaborators: ['SB'], goals: 3, worksheetsCount: 5, archived: false,
    assigned: 12, completed: 11, lastActive: '2026-04-10',
  },
  {
    id: '3', name: 'Ethan Williams', avatar: 'EW', color: 'bg-emerald-100 text-emerald-700',
    school: 'Riverside Academy', grade: '2nd', dob: '09/04/2017', disability: 'Dyslexia',
    iepDue: '09/10/2026', evalDue: '01/15/2027', iepServiceTime: 90,
    serviceTime: [{ label: 'Reading', value: '60/week' }],
    collaborators: ['TK'], goals: 5, worksheetsCount: 2, archived: false,
    assigned: 6, completed: 3, lastActive: '2026-04-05',
  },
  {
    id: '4', name: 'Sofia Garcia',   avatar: 'SG', color: 'bg-pink-100 text-pink-700',
    school: 'Maple Street School', grade: '5th', dob: '07/30/2014', disability: 'Down Syndrome',
    iepDue: '07/01/2026', evalDue: '10/22/2026', iepServiceTime: 180,
    serviceTime: [{ label: 'OT', value: '45/week' }, { label: 'PT', value: '30/week' }, { label: 'Speech', value: '30/week' }],
    collaborators: ['SB', 'TK', 'MR'], goals: 6, worksheetsCount: 4, archived: false,
    assigned: 10, completed: 9, lastActive: '2026-04-09',
  },
  {
    id: '5', name: 'Liam Chen',      avatar: 'LC', color: 'bg-orange-100 text-orange-700',
    school: 'Lincoln Elementary', grade: '1st', dob: '11/18/2018', disability: 'Developmental Delay',
    iepDue: '05/20/2026', evalDue: '09/05/2026', iepServiceTime: 60,
    serviceTime: [{ label: 'Speech', value: '30/week' }],
    collaborators: ['MR'], goals: 3, worksheetsCount: 1, archived: false,
    assigned: 4, completed: 1, lastActive: '2026-03-28',
  },
  {
    id: '6', name: 'Ava Thompson',   avatar: 'AT', color: 'bg-indigo-100 text-indigo-700',
    school: 'Riverside Academy', grade: '3rd', dob: '02/14/2016', disability: 'Cerebral Palsy',
    iepDue: '10/08/2026', evalDue: '03/11/2027', iepServiceTime: 240,
    serviceTime: [{ label: 'PT', value: '60/week' }, { label: 'OT', value: '45/week' }],
    collaborators: ['SB'], goals: 4, worksheetsCount: 6, archived: false,
    assigned: 14, completed: 14, lastActive: '2026-04-11',
  },
  {
    id: '7', name: 'Noah Martinez',  avatar: 'NM', color: 'bg-teal-100 text-teal-700',
    school: 'Maple Street School', grade: '4th', dob: '06/09/2015', disability: 'Speech/Language Delay',
    iepDue: '11/30/2026', evalDue: '04/20/2027', iepServiceTime: 90,
    serviceTime: [{ label: 'Speech', value: '45/week' }],
    collaborators: ['TK'], goals: 2, worksheetsCount: 3, archived: false,
    assigned: 7, completed: 4, lastActive: '2026-04-07',
  },
  {
    id: '8', name: 'Isabella Lee',   avatar: 'IL', color: 'bg-fuchsia-100 text-fuchsia-700',
    school: 'Lincoln Elementary', grade: '2nd', dob: '04/27/2017', disability: 'Emotional Disturbance',
    iepDue: '12/15/2026', evalDue: '05/30/2027', iepServiceTime: 120,
    serviceTime: [{ label: 'Counseling', value: '60/week' }, { label: 'Social Skills', value: '30/week' }],
    collaborators: ['MR', 'SB'], goals: 5, worksheetsCount: 2, archived: false,
    assigned: 9, completed: 6, lastActive: '2026-04-03',
  },
];


// ─── Worksheet row ────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  draft:     { label: 'Draft',     bg: 'bg-gray-100',     text: 'text-gray-500'    },
  published: { label: 'Published', bg: 'bg-emerald-50',   text: 'text-emerald-700' },
  assigned:  { label: 'Assigned',  bg: 'bg-[#1A8917]/10', text: 'text-[#1A8917]'   },
};

// Mock test scores per student per worksheet: studentId -> worksheetId -> { score, total }
const MOCK_SCORES: Record<string, Record<string, { score: number; total: number }>> = {
  '1': { 'w1': { score: 7, total: 10 }, 'w4': { score: 9, total: 12 } },
  '2': { 'w1': { score: 9, total: 10 }, 'w2': { score: 12, total: 15 }, 'w4': { score: 10, total: 12 } },
  '3': { 'w2': { score: 11, total: 15 }, 'w5': { score: 6, total: 10 } },
  '4': { 'w1': { score: 8, total: 10 }, 'w4': { score: 11, total: 12 }, 'w6': { score: 12, total: 14 } },
  '5': { 'w1': { score: 4, total: 10 } },
  '6': { 'w1': { score: 10, total: 10 }, 'w2': { score: 15, total: 15 }, 'w4': { score: 12, total: 12 }, 'w6': { score: 14, total: 14 } },
  '7': { 'w2': { score: 10, total: 15 }, 'w3': { score: 5, total: 8 } },
  '8': { 'w1': { score: 6, total: 10 }, 'w4': { score: 8, total: 12 } },
};

function WorksheetRow({
  ws,
  score,
  onOpen,
}: {
  ws: import('../../types').Worksheet;
  score?: { score: number; total: number };
  onOpen: () => void;
}) {
  const badge = STATUS_BADGE[ws.status] ?? STATUS_BADGE.draft;
  const pct   = score ? Math.round((score.score / score.total) * 100) : null;

  return (
    <div
      onClick={onOpen}
      className="group flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0"
    >
      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#1A8917] transition-colors">
          {ws.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{ws.subject} · {ws.gradeLevel}</p>
      </div>

      {/* Status badge */}
      <span className={cn(
        'shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
        badge.bg, badge.text
      )}>
        {badge.label}
      </span>

      {/* Score */}
      <div className="w-24 text-right shrink-0">
        {pct !== null ? (
          <span className={cn(
            'text-sm font-semibold tabular-nums',
            pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-500' : 'text-red-500'
          )}>
            {pct}%
            <span className="ml-1.5 text-[11px] font-normal text-gray-400">{score!.score}/{score!.total}</span>
          </span>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </div>

      {/* Questions */}
      <span className="w-8 text-right shrink-0 text-xs text-gray-400 tabular-nums">{ws.questionCount}q</span>

      {/* Arrow */}
      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
    </div>
  );
}

export function Caseload() {
  const { setCurrentView, setActiveWorksheet, setEditorContext, myWorksheets, caseloadReturnTab, setCaseloadReturnTab } = useWorksheetStore();
  const [caseloadView, setCaseloadView] = useState<'list' | 'detail'>('list');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ProfileTab>(() => {
    if (caseloadReturnTab && PROFILE_TABS.includes(caseloadReturnTab as ProfileTab)) {
      setCaseloadReturnTab('');
      return caseloadReturnTab as ProfileTab;
    }
    return 'Profile';
  });
  const [assignTarget, setAssignTarget] = useState<Worksheet | null>(null);
  const [testTarget, setTestTarget] = useState<Worksheet | null>(null);
  const [wsFilter, setWsFilter] = useState<'all' | 'assigned' | 'published' | 'draft'>('all');
  const [archivedGoalsOpen, setArchivedGoalsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<IEPGoal | null>(null);
  // Progress tab navigation
  const [progressProgram, setProgressProgram] = useState<IEPProgram | null>(null);
  const [progressGoal, setProgressGoal] = useState<IEPGoal | null>(null);

  const active = STUDENTS.find((s) => s.id === selectedId);
  const filtered = STUDENTS.filter((s) =>
    !s.archived &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.disability.toLowerCase().includes(search.toLowerCase()))
  );
  const archived = STUDENTS.filter((s) => s.archived);

  const openStudent = (id: string, tab: ProfileTab = 'Profile') => {
    setSelectedId(id);
    setActiveTab(tab);
    setSelectedGoal(null);
    setProgressProgram(null);
    setProgressGoal(null);
    setCaseloadView('detail');
  };

  const backToList = () => {
    setCaseloadView('list');
    setSearch('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between z-10">
        {caseloadView === 'list' ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-sm font-semibold text-gray-900">Caseload</h1>
              <span className="text-xs text-gray-400">{filtered.length} students</span>
            </div>
            {/* Inline search */}
            <div className="relative max-w-xs flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or condition…"
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8917] placeholder:text-gray-400"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={backToList}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium shrink-0"
            >
              <ArrowLeft size={14} /> All Students
            </button>
            <span className="text-gray-200">/</span>
            {active && (
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0', active.color)}>
                  {active.avatar}
                </div>
                <span className="text-sm font-semibold text-gray-900 truncate">{active.name}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#1A8917] rounded-lg hover:bg-[#0F730C] transition-colors font-medium">
            <Plus size={13} /> Add Student
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* ── List / Detail views ───────────────────────────── */}
      <AnimatePresence mode="wait">
      {caseloadView === 'list' ? (
        <motion.div key="caseload-list" className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users size={28} className="text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No students found</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Grade</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Condition</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Assigned</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Completed</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-44">Completion Rate</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Last Active</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const rate = s.assigned > 0 ? Math.round((s.completed / s.assigned) * 100) : 0;
                  const rateColor =
                    rate >= 80 ? 'bg-[#1A8917]' :
                    rate >= 50 ? 'bg-amber-400' : 'bg-red-400';
                  const rateText =
                    rate >= 80 ? 'text-[#1A8917]' :
                    rate >= 50 ? 'text-amber-600' : 'text-red-500';
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.04, ease: 'easeOut' }}
                      onClick={() => openStudent(s.id)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      {/* Student */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0', s.color)}>
                            {s.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                            <p className="text-xs text-gray-400 truncate">{s.school}</p>
                          </div>
                        </div>
                      </td>
                      {/* Grade */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{s.grade}</span>
                      </td>
                      {/* Condition */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{s.disability}</span>
                      </td>
                      {/* Assigned */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-semibold text-gray-900">{s.assigned}</span>
                      </td>
                      {/* Completed */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-semibold text-gray-900">{s.completed}</span>
                      </td>
                      {/* Completion rate */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                              className={cn('h-full rounded-full', rateColor)}
                              initial={{ width: 0 }}
                              animate={{ width: `${rate}%` }}
                              transition={{ duration: 0.7, delay: i * 0.04 + 0.1, ease: 'easeOut' }}
                            />
                          </div>
                          <span className={cn('text-xs font-semibold tabular-nums w-8 text-right shrink-0', rateText)}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                      {/* Last active */}
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <span className="text-xs text-gray-400">{s.lastActive}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); openStudent(s.id, 'Worksheets'); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="View worksheets"
                          >
                            <ClipboardList size={13} />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <MoreVertical size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>
      ) : caseloadView === 'detail' && active ? (
        <motion.div key="caseload-detail" className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}>

          {/* Tab bar */}
          <div className="shrink-0 border-b border-gray-100 bg-white px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'shrink-0 px-3.5 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab
                      ? 'border-[#1A8917] text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  )}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabVariants} initial="initial" animate="animate" exit="exit">

            {/* ── PROFILE TAB ──────────────────────────────── */}
            {activeTab === 'Profile' && (
              <div className="max-w-4xl space-y-4">
                {/* Student header card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0', active.color)}>
                      {active.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900">{active.name}</h2>
                      <p className="text-sm text-gray-400">{active.school}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Take Data
                      </button>
                      <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#1A8917] rounded-lg hover:bg-[#0F730C] transition-colors">
                        View Data
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {/* Collaborators */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Collaborators</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {active.collaborators.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">{c[0]}</div>
                            <span className="text-xs">{c}</span>
                          </div>
                        ))}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-400 transition-colors">
                          <UserPlus size={12} /> Add New
                        </button>
                      </div>
                    </div>

                    {/* Service time */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <p className="text-xs text-gray-400">Service time</p>
                        <button><Pencil size={11} className="text-gray-400 hover:text-gray-600" /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {active.serviceTime.map((st, i) => (
                          <span key={i} className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-700 bg-white">
                            {st.label}: {st.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Basic Details</h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                    {[
                      { label: 'IEP Due Date',     value: active.iepDue },
                      { label: 'Eval Due Date',     value: active.evalDue },
                      { label: 'IEP Service Time',  value: String(active.iepServiceTime) },
                      { label: 'Site',              value: active.school },
                      { label: 'Grade',             value: active.grade },
                      { label: 'DOB',               value: active.dob },
                      { label: 'Disability',        value: active.disability },
                      { label: 'Teacher EE',        value: '—' },
                      { label: 'Room No',           value: '—' },
                      { label: 'Case Manager',      value: '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── GOALS TAB ─────────────────────────────────── */}
            {activeTab === 'Goals' && (() => {
              const activeGoals   = MOCK_GOALS.filter(g => !g.archived).slice(0, active.goals);
              const archivedGoals = MOCK_GOALS.filter(g => g.archived);
              const counts = {
                not_started: activeGoals.filter(g => g.status === 'not_started').length,
                behind:      activeGoals.filter(g => g.status === 'behind').length,
                on_track:    activeGoals.filter(g => g.status === 'on_track').length,
                mastered:    activeGoals.filter(g => g.status === 'mastered').length,
              };

              // ── Goal detail view ──────────────────────────
              if (selectedGoal) {
                const st = GOAL_STATUS_CONFIG[selectedGoal.status];
                const entries = selectedGoal.progressEntries ?? [];
                const latest = entries[entries.length - 1];
                const prev   = entries[entries.length - 2];
                const trend  = latest && prev
                  ? latest.value > prev.value ? 'up' : latest.value < prev.value ? 'down' : 'flat'
                  : null;

                return (
                  <div className="max-w-3xl space-y-4">
                    {/* Back button */}
                    <button
                      onClick={() => setSelectedGoal(null)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
                    >
                      <ArrowLeft size={13} /> Back to Goals
                    </button>

                    {/* Goal header card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', st.bg, st.color)}>{st.label}</span>
                            {selectedGoal.archived && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Archived</span>}
                            <span className="text-xs text-gray-400">{selectedGoal.type}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{selectedGoal.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{selectedGoal.description}</p>
                        </div>
                        {trend && (
                          <div className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold shrink-0',
                            trend === 'up' ? 'bg-green-50 text-green-700' : trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                          )}>
                            {trend === 'up' ? <TrendingUp size={15} /> : trend === 'down' ? <TrendingDown size={15} /> : <Minus size={15} />}
                            {latest.value}{latest.unit.startsWith('/') || latest.unit.startsWith('%') ? '' : ' '}{latest.unit}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                        {selectedGoal.targetDate && <span>Target: <strong className="text-gray-700">{selectedGoal.targetDate}</strong></span>}
                        {selectedGoal.masteryTarget && <span>Mastery: <strong className="text-gray-700">{selectedGoal.masteryTarget}</strong></span>}
                        <span>{entries.length} data point{entries.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Progress entries */}
                    {entries.length === 0 ? (
                      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                        <p className="text-sm font-medium text-gray-500 mb-1">No data collected yet</p>
                        <p className="text-xs text-gray-400">Progress entries will appear here once data is logged.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress Log</span>
                          <span className="text-xs text-gray-400">{entries.length} entries</span>
                        </div>

                        {/* Visual bar chart */}
                        <div className="px-4 py-4 border-b border-gray-100">
                          <div className="flex items-end gap-1.5 h-20">
                            {entries.map((e, i) => {
                              const maxVal = Math.max(...entries.map(x => x.value));
                              const pct = maxVal > 0 ? (e.value / maxVal) * 100 : 0;
                              return (
                                <div key={e.id} className="flex-1 flex flex-col items-center gap-1 group/bar" title={`${e.value}${e.unit} — ${e.date}`}>
                                  <span className="text-[9px] text-gray-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">{e.value}</span>
                                  <div className="w-full rounded-t-sm bg-[#1A8917]/20 relative" style={{ height: '60px' }}>
                                    <div
                                      className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-[#1A8917] transition-all"
                                      style={{ height: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] text-gray-400">{e.date.slice(5)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Entry rows */}
                        {[...entries].reverse().map((entry, i) => (
                          <div key={entry.id} className={cn('flex items-start gap-4 px-4 py-3', i < entries.length - 1 && 'border-b border-gray-50')}>
                            <div className="w-20 shrink-0 text-xs text-gray-400 pt-0.5">{entry.date}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-gray-900">{entry.value}{entry.unit.startsWith('/') || entry.unit.startsWith('%') ? '' : ' '}{entry.unit}</span>
                                {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Latest</span>}
                              </div>
                              {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                              {entry.trialData && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {entry.trialData.map((t, ti) => (
                                    <span key={ti} className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', t.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                                      {t.label} {t.correct ? '✓' : '✗'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // ── Goals list view ───────────────────────────
              return (
                <div className="max-w-3xl space-y-4">
                  {/* Summary stat tiles */}
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">{active.name.split(' ')[0]}'s Goals</h3>
                        <span className="text-xs text-gray-400">{activeGoals.length} active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Take Data</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">View Data</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A8917] rounded-lg hover:bg-[#0F730C] transition-colors">+ Add Goal</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { key: 'not_started', label: 'Not Started', icon: '⏳', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', count: counts.not_started },
                        { key: 'behind',      label: 'Behind',      icon: '⚠️', bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-600',   count: counts.behind      },
                        { key: 'on_track',    label: 'On Track',    icon: '✓',  bg: 'bg-blue-50',  border: 'border-blue-100',  text: 'text-blue-700',  count: counts.on_track    },
                        { key: 'mastered',    label: 'Mastered',    icon: '🏆', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', count: counts.mastered    },
                      ].map(s => (
                        <div key={s.key} className={`flex items-center gap-3 p-3 rounded-xl border ${s.bg} ${s.border}`}>
                          <span className="text-base leading-none shrink-0">{s.icon}</span>
                          <div>
                            <p className={`text-lg font-bold leading-none ${s.text}`}>{s.count}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active goal cards */}
                  {activeGoals.map((goal, i) => {
                    const st = GOAL_STATUS_CONFIG[goal.status];
                    const entryCount = goal.progressEntries?.length ?? 0;
                    const lastEntry  = goal.progressEntries?.[entryCount - 1];
                    return (
                      <div key={goal.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                          <div className="flex items-center gap-2.5">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-gray-900" />
                            <span className="text-xs text-gray-400 font-medium">{goal.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                              <span className="text-[10px]">✦</span> Ask AI
                            </button>
                            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                              <MoreVertical size={13} />
                            </button>
                          </div>
                        </div>
                        <div className="px-4 py-3.5">
                          <div className="flex items-start gap-2.5 mb-2">
                            <span className="text-amber-400 text-base leading-none shrink-0 mt-0.5">◎</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">Goal {i + 1} · {goal.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{goal.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${st.bg} ${st.color} border-transparent`}>
                              <span className="text-[11px]">{st.icon}</span>
                              {st.label}
                              <span className="text-[9px] opacity-50">▾</span>
                            </button>
                            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
                            {goal.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-gray-500 bg-gray-100 border border-gray-200">{tag}</span>
                            ))}
                            {entryCount > 0 && (
                              <>
                                <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
                                <button
                                  onClick={() => setSelectedGoal(goal)}
                                  className="flex items-center gap-1 text-xs text-[#1A8917] hover:underline font-medium"
                                >
                                  ↗ {entryCount} entries · Last {lastEntry?.date.slice(5)}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Archived goals (collapsible) ── */}
                  {archivedGoals.length > 0 && (
                    <div>
                      {/* Toggle header */}
                      <button
                        onClick={() => setArchivedGoalsOpen(v => !v)}
                        className="w-full flex items-center justify-between px-1 py-2 text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-500">Archived Goals</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{archivedGoals.length}</span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={cn('text-gray-400 transition-transform duration-200', archivedGoalsOpen && 'rotate-180')}
                        />
                      </button>

                      {/* Archived list */}
                      {archivedGoalsOpen && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-1 divide-y divide-gray-50">
                          {archivedGoals.map(goal => {
                            const st = GOAL_STATUS_CONFIG[goal.status];
                            const entryCount = goal.progressEntries?.length ?? 0;
                            const lastEntry  = goal.progressEntries?.[entryCount - 1];
                            return (
                              <button
                                key={goal.id}
                                onClick={() => setSelectedGoal(goal)}
                                className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 transition-colors group/archived"
                              >
                                {/* Archive icon */}
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                  <FileText size={14} className="text-gray-400" />
                                </div>

                                {/* Goal info */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">{goal.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400">{goal.type}</span>
                                    {entryCount > 0 && (
                                      <>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">{entryCount} entries</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">Last {lastEntry?.date.slice(0, 7)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Status pill */}
                                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', st.bg, st.color)}>
                                  {st.label}
                                </span>

                                {/* Arrow */}
                                <ChevronRight size={14} className="text-gray-300 group-hover/archived:text-gray-500 transition-colors shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── WORKSHEETS TAB ────────────────────────────── */}
            {activeTab === 'Worksheets' && (() => {
              const studentScores = active ? (MOCK_SCORES[active.id] ?? {}) : {};
              const assigned  = myWorksheets.filter((w) => w.status === 'assigned');
              const published = myWorksheets.filter((w) => w.status === 'published');
              const drafts    = myWorksheets.filter((w) => w.status === 'draft');

              const filterKey = (label: string): 'all' | 'assigned' | 'published' | 'draft' =>
                label === 'Total' ? 'all' : label.toLowerCase() as 'assigned' | 'published' | 'draft';

              const visibleWorksheets = wsFilter === 'all'
                ? myWorksheets
                : myWorksheets.filter((w) => w.status === wsFilter);

              return (
                <div className="max-w-3xl">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Total',     value: myWorksheets.length, icon: <FileText size={13} />,    text: 'text-gray-900'    },
                      { label: 'Assigned',  value: assigned.length,     icon: <Send size={13} />,        text: 'text-gray-900'    },
                      { label: 'Published', value: published.length,    icon: <CheckSquare size={13} />, text: 'text-emerald-700' },
                      { label: 'Drafts',    value: drafts.length,       icon: <FileText size={13} />,    text: 'text-gray-400'    },
                    ].map(s => {
                      const key = filterKey(s.label);
                      const isActive = wsFilter === key;
                      return (
                        <button
                          key={s.label}
                          onClick={() => setWsFilter(isActive && key !== 'all' ? 'all' : key)}
                          className={cn(
                            'rounded-xl border px-4 py-3 flex items-center gap-3 text-left transition-all',
                            isActive ? 'bg-[#1A8917] border-[#1A8917]' : 'bg-white border-gray-100 hover:border-gray-200'
                          )}
                        >
                          <span className={cn('opacity-60', isActive ? 'text-white' : s.text)}>{s.icon}</span>
                          <div>
                            <p className={cn('text-lg font-bold leading-none', isActive ? 'text-white' : s.text)}>{s.value}</p>
                            <p className={cn('text-[11px] mt-0.5', isActive ? 'text-green-200' : 'text-gray-400')}>{s.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-400">
                      {visibleWorksheets.length} worksheet{visibleWorksheets.length !== 1 ? 's' : ''}
                      {wsFilter !== 'all' ? ` · ${wsFilter}` : ''}
                    </p>
                    <button
                      onClick={() => setCurrentView('create_method')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText size={12} /> Generate New
                    </button>
                  </div>

                  {myWorksheets.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <FileText size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">No worksheets yet</p>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-5">
                        Assign an existing worksheet from your library, or generate a new one tailored to this student.
                      </p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentView('create_method')} className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1A8917] rounded-lg hover:bg-[#0F730C] transition-colors">
                          Generate New
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Flat list */
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {/* Column headers */}
                      <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Worksheet</span>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-20 text-center">Status</span>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-24 text-right">Score</span>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-8 text-right">Qs</span>
                        <span className="w-[14px] shrink-0" />
                      </div>

                      {visibleWorksheets.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <p className="text-sm text-gray-400">No {wsFilter} worksheets.</p>
                        </div>
                      ) : (
                        visibleWorksheets.map((ws) => (
                          <WorksheetRow
                            key={ws.id}
                            ws={ws}
                            score={studentScores[ws.id]}
                            onOpen={() => { setActiveWorksheet(ws); setEditorContext('caseload'); setCurrentView('editor'); }}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── PROGRESS TAB (kept as dead code, not reachable via tabs) ── */}
            {false && (() => {
              // ── Accent helpers ──────────────────────────────
              const accentBg: Record<string, string> = {
                blue: 'bg-blue-50', emerald: 'bg-emerald-50', violet: 'bg-violet-50',
                orange: 'bg-orange-50', pink: 'bg-pink-50',
              };
              const accentBorder: Record<string, string> = {
                blue: 'border-blue-200', emerald: 'border-emerald-200', violet: 'border-violet-200',
                orange: 'border-orange-200', pink: 'border-pink-200',
              };
              const accentText: Record<string, string> = {
                blue: 'text-blue-700', emerald: 'text-emerald-700', violet: 'text-violet-700',
                orange: 'text-orange-700', pink: 'text-pink-700',
              };
              const accentBar: Record<string, string> = {
                blue: 'bg-blue-500', emerald: 'bg-emerald-500', violet: 'bg-violet-500',
                orange: 'bg-orange-500', pink: 'bg-pink-500',
              };
              const accentBarLight: Record<string, string> = {
                blue: 'bg-blue-100', emerald: 'bg-emerald-100', violet: 'bg-violet-100',
                orange: 'bg-orange-100', pink: 'bg-pink-100',
              };

              // ── Goal detail view ──────────────────────────
              if (progressGoal) {
                const st = GOAL_STATUS_CONFIG[progressGoal.status];
                const entries = progressGoal.progressEntries ?? [];
                const latest  = entries[entries.length - 1];
                const prev    = entries[entries.length - 2];
                const trend   = latest && prev
                  ? latest.value > prev.value ? 'up' : latest.value < prev.value ? 'down' : 'flat'
                  : null;
                const color   = progressProgram?.accentColor ?? 'blue';

                return (
                  <div className="max-w-3xl space-y-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <button
                        onClick={() => { setProgressGoal(null); }}
                        className="hover:text-gray-700 transition-colors"
                      >
                        Progress
                      </button>
                      <ChevronRight size={12} />
                      <button
                        onClick={() => setProgressGoal(null)}
                        className="hover:text-gray-700 transition-colors"
                      >
                        {progressProgram?.name}
                      </button>
                      <ChevronRight size={12} />
                      <span className="text-gray-700 font-medium truncate">{progressGoal.title}</span>
                    </div>

                    {/* Goal header */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', st.bg, st.color)}>{st.label}</span>
                            {progressGoal.archived && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Archived</span>}
                            <span className="text-xs text-gray-400">{progressGoal.type}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{progressGoal.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{progressGoal.description}</p>
                        </div>
                        {trend && (
                          <div className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold shrink-0',
                            trend === 'up' ? 'bg-green-50 text-green-700' : trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                          )}>
                            {trend === 'up' ? <TrendingUp size={15} /> : trend === 'down' ? <TrendingDown size={15} /> : <Minus size={15} />}
                            {latest.value}{latest.unit.startsWith('/') || latest.unit.startsWith('%') ? '' : ' '}{latest.unit}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                        {progressGoal.targetDate && <span>Target: <strong className="text-gray-700">{progressGoal.targetDate}</strong></span>}
                        {progressGoal.masteryTarget && <span>Mastery: <strong className="text-gray-700">{progressGoal.masteryTarget}</strong></span>}
                        <span>{entries.length} data point{entries.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {entries.length === 0 ? (
                      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                        <p className="text-sm font-medium text-gray-500 mb-1">No data collected yet</p>
                        <p className="text-xs text-gray-400">Progress entries will appear here once data is logged.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-4 py-2.5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress Log</span>
                          <span className="text-xs text-gray-400">{entries.length} entries</span>
                        </div>
                        {/* Bar chart */}
                        <div className="px-4 py-4 border-b border-gray-100">
                          <div className="flex items-end gap-1.5 h-20">
                            {entries.map((e) => {
                              const maxVal = Math.max(...entries.map(x => x.value));
                              const pct = maxVal > 0 ? (e.value / maxVal) * 100 : 0;
                              return (
                                <div key={e.id} className="flex-1 flex flex-col items-center gap-1 group/bar" title={`${e.value}${e.unit} — ${e.date}`}>
                                  <span className="text-[9px] text-gray-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">{e.value}</span>
                                  <div className={cn('w-full rounded-t-sm relative', accentBarLight[color])} style={{ height: '60px' }}>
                                    <div className={cn('absolute bottom-0 left-0 right-0 rounded-t-sm transition-all', accentBar[color])} style={{ height: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9px] text-gray-400">{e.date.slice(5)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {/* Entry rows */}
                        {[...entries].reverse().map((entry, i) => (
                          <div key={entry.id} className={cn('flex items-start gap-4 px-4 py-3', i < entries.length - 1 && 'border-b border-gray-50')}>
                            <div className="w-20 shrink-0 text-xs text-gray-400 pt-0.5">{entry.date}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-gray-900">{entry.value}{entry.unit.startsWith('/') || entry.unit.startsWith('%') ? '' : ' '}{entry.unit}</span>
                                {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Latest</span>}
                              </div>
                              {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                              {entry.trialData && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {entry.trialData.map((t, ti) => (
                                    <span key={ti} className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', t.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                                      {t.label} {t.correct ? '✓' : '✗'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // ── Goals-in-program view ─────────────────────
              if (progressProgram) {
                const programGoals = progressProgram.goalIds
                  .map(id => MOCK_GOALS.find(g => g.id === id))
                  .filter((g): g is IEPGoal => Boolean(g));
                const activeGoals   = programGoals.filter(g => !g.archived);
                const archivedGoals = programGoals.filter(g => g.archived);
                const color = progressProgram.accentColor;

                return (
                  <div className="max-w-3xl space-y-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <button
                        onClick={() => setProgressProgram(null)}
                        className="hover:text-gray-700 transition-colors"
                      >
                        Progress
                      </button>
                      <ChevronRight size={12} />
                      <span className="text-gray-700 font-medium">{progressProgram.name}</span>
                    </div>

                    {/* Program header */}
                    <div className={cn('rounded-xl border p-4 flex items-center gap-4', accentBg[color], accentBorder[color])}>
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0', accentBar[color])}>
                        {progressProgram.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold', accentText[color])}>{progressProgram.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{progressProgram.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn('text-lg font-bold', accentText[color])}>{activeGoals.length}</p>
                        <p className="text-[11px] text-gray-400">active goals</p>
                      </div>
                    </div>

                    {/* Active goals */}
                    {activeGoals.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Goals</p>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                          {activeGoals.map(goal => {
                            const st = GOAL_STATUS_CONFIG[goal.status];
                            const entryCount = goal.progressEntries?.length ?? 0;
                            const lastEntry  = goal.progressEntries?.[entryCount - 1];
                            return (
                              <button
                                key={goal.id}
                                onClick={() => setProgressGoal(goal)}
                                className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors group/goal"
                              >
                                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold', accentBg[color], accentText[color])}>
                                  {goal.type[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{goal.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400">{goal.type}</span>
                                    {entryCount > 0 && (
                                      <>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">{entryCount} entries</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">Last {lastEntry?.date.slice(5)}</span>
                                      </>
                                    )}
                                    {entryCount === 0 && <span className="text-xs text-gray-300">No data yet</span>}
                                  </div>
                                </div>
                                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', st.bg, st.color)}>
                                  {st.label}
                                </span>
                                <ChevronRight size={14} className="text-gray-300 group-hover/goal:text-gray-500 transition-colors shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Archived goals */}
                    {archivedGoals.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Archived Goals</p>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                          {archivedGoals.map(goal => {
                            const st = GOAL_STATUS_CONFIG[goal.status];
                            const entryCount = goal.progressEntries?.length ?? 0;
                            const lastEntry  = goal.progressEntries?.[entryCount - 1];
                            return (
                              <button
                                key={goal.id}
                                onClick={() => setProgressGoal(goal)}
                                className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors group/goal opacity-70 hover:opacity-100"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                  <FileText size={14} className="text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-600 truncate">{goal.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400">{goal.type}</span>
                                    {entryCount > 0 && (
                                      <>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">{entryCount} entries</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">Last {lastEntry?.date.slice(0, 7)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">Archived</span>
                                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', st.bg, st.color)}>{st.label}</span>
                                <ChevronRight size={14} className="text-gray-300 group-hover/goal:text-gray-500 transition-colors shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // ── Programs list view (default) ──────────────
              return (
                <div className="max-w-3xl space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{active.name.split(' ')[0]}'s Programs</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{MOCK_PROGRAMS.length} programs · {MOCK_GOALS.filter(g => !g.archived).length} active goals</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A8917] rounded-lg hover:bg-[#0F730C] transition-colors">
                      + Add Program
                    </button>
                  </div>

                  {/* Program cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {MOCK_PROGRAMS.map(program => {
                      const programGoals = program.goalIds
                        .map(id => MOCK_GOALS.find(g => g.id === id))
                        .filter((g): g is IEPGoal => Boolean(g));
                      const activeGoals   = programGoals.filter(g => !g.archived);
                      const archivedGoals = programGoals.filter(g => g.archived);
                      const statusCounts = {
                        mastered:    activeGoals.filter(g => g.status === 'mastered').length,
                        on_track:    activeGoals.filter(g => g.status === 'on_track').length,
                        behind:      activeGoals.filter(g => g.status === 'behind').length,
                        not_started: activeGoals.filter(g => g.status === 'not_started').length,
                      };
                      const color = program.accentColor;
                      const totalEntries = programGoals.reduce((sum, g) => sum + (g.progressEntries?.length ?? 0), 0);

                      return (
                        <button
                          key={program.id}
                          onClick={() => setProgressProgram(program)}
                          className="w-full bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all text-left group/prog overflow-hidden"
                        >
                          {/* Top accent bar */}
                          <div className={cn('h-1 w-full', accentBar[color])} />

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0', accentBar[color])}>
                                  {program.name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 group-hover/prog:text-gray-700">{program.name}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{program.area}</p>
                                </div>
                              </div>
                              <ChevronRight size={15} className="text-gray-300 group-hover/prog:text-gray-500 transition-colors shrink-0 mt-1" />
                            </div>

                            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{program.description}</p>

                            {/* Stats row */}
                            <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-xs text-gray-400">{activeGoals.length} goal{activeGoals.length !== 1 ? 's' : ''}</span>
                                {archivedGoals.length > 0 && (
                                  <span className="text-xs text-gray-300">{archivedGoals.length} archived</span>
                                )}
                                {totalEntries > 0 && (
                                  <span className="text-xs text-gray-400">{totalEntries} data points</span>
                                )}
                              </div>
                              {/* Status dots */}
                              <div className="flex items-center gap-1.5">
                                {statusCounts.mastered > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">🏆 {statusCounts.mastered}</span>
                                )}
                                {statusCounts.on_track > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-[#1A8917]">✓ {statusCounts.on_track}</span>
                                )}
                                {statusCounts.behind > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">⚠️ {statusCounts.behind}</span>
                                )}
                                {statusCounts.not_started > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">⏳ {statusCounts.not_started}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </motion.div>
          </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
      </AnimatePresence>

      {assignTarget && (
        <AssignModal worksheet={assignTarget} onClose={() => setAssignTarget(null)} />
      )}
      {testTarget && active && (
        <TakeTestModal
          worksheet={testTarget}
          studentName={active.name}
          onClose={() => setTestTarget(null)}
        />
      )}
    </div>
  );
}
