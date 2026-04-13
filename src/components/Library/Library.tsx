import { useState } from 'react';
import { Search, Filter, BookOpen, Heart, Send, SortAsc, Edit3, Copy, Trash2, MoreHorizontal, HelpCircle, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorksheetStore } from '../../store/worksheetStore';
import { AssignModal } from './AssignModal';
import { THEMES } from '../../data/mockData';
import type { Worksheet } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { listVariants, itemVariants, tabVariants } from '@/lib/motion';

type Tab = 'mine' | 'liked' | 'assigned';

const STATUS_STYLES: Record<string, 'secondary' | 'success' | 'info'> = {
  draft: 'secondary',
  published: 'success',
  assigned: 'info',
};

const SUBJECT_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 text-blue-600',
  Reading: 'bg-purple-100 text-purple-600',
  Writing: 'bg-indigo-100 text-indigo-600',
  Science: 'bg-green-100 text-green-600',
  'Social Studies': 'bg-amber-100 text-amber-600',
  'Life Skills': 'bg-orange-100 text-orange-600',
  'Social-Emotional': 'bg-pink-100 text-pink-600',
  Communication: 'bg-teal-100 text-teal-600',
};

export function Library() {
  const { myWorksheets, likedWorksheetIds, setCurrentView } = useWorksheetStore();
  const [tab, setTab] = useState<Tab>('mine');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [assignTarget, setAssignTarget] = useState<Worksheet | null>(null);

  const likedWorksheets = myWorksheets.filter((w) => likedWorksheetIds.has(w.id));
  const assignedWorksheets = myWorksheets.filter((w) => w.status === 'assigned');

  const getDisplayWorksheets = () => {
    let list = tab === 'mine' ? myWorksheets : tab === 'liked' ? likedWorksheets : assignedWorksheets;
    if (search) {
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(search.toLowerCase()) ||
          w.subject.toLowerCase().includes(search.toLowerCase()) ||
          w.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (subjectFilter) list = list.filter((w) => w.subject === subjectFilter);
    return list;
  };

  const worksheets = getDisplayWorksheets();
  const subjects = [...new Set(myWorksheets.map((w) => w.subject))];

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Worksheet Library</h1>
          <p className="text-sm text-gray-400">Create, manage and assign worksheets for your students</p>
        </div>
        <Button variant="gradient" size="sm" asChild className="shrink-0">
          <motion.button onClick={() => setCurrentView('create_method')} whileTap={{ scale: 0.98 }}>
            <Plus size={15} strokeWidth={2.5} /> New Worksheet
          </motion.button>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mb-5">
        <TabsList>
          <TabsTrigger value="mine">
            <BookOpen size={14} />
            My Worksheets
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-900 font-semibold">
              {myWorksheets.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="liked">
            <Heart size={14} />
            Liked
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              {likedWorksheets.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            <Send size={14} />
            Assigned
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
              {assignedWorksheets.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div key={tab} variants={tabVariants} initial="initial" animate="animate" exit="exit">
          {/* Filters row */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="relative max-w-xs flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search worksheets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="h-9 pl-8 pr-3 rounded-lg border border-[#E6E6E6] bg-white text-sm text-[#242424] focus:outline-none focus:ring-2 focus:ring-[#1A8917]/20 focus:border-[#1A8917] appearance-none cursor-pointer"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Button variant="outline" size="sm">
              <SortAsc size={14} />
              Sort
            </Button>
          </div>

          {/* List */}
          {worksheets.length === 0 ? (
            <EmptyState tab={tab} onCreateNew={() => setCurrentView('create_method')} />
          ) : (
            <motion.div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" variants={listVariants} initial="hidden" animate="show">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_120px_110px_90px_100px_44px] gap-4 px-5 py-2.5 border-b border-gray-100 bg-gray-50">
                {['Title', 'Subject', 'Grade', 'Questions', 'Status', ''].map((h) => (
                  <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
                ))}
              </div>
              {worksheets.map((ws, i) => (
                <WorksheetRow
                  key={ws.id}
                  worksheet={ws}
                  isLast={i === worksheets.length - 1}
                  onAssign={() => setAssignTarget(ws)}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {assignTarget && (
        <AssignModal worksheet={assignTarget} onClose={() => setAssignTarget(null)} />
      )}
    </div>
    </div>
  );
}

function WorksheetRow({ worksheet: ws, isLast, onAssign }: { worksheet: Worksheet; isLast: boolean; onAssign: () => void }) {
  const { setActiveWorksheet, setCurrentView, deleteWorksheet, duplicateWorksheet, toggleLike, likedWorksheetIds } = useWorksheetStore();
  const isLiked = likedWorksheetIds.has(ws.id);
  const theme = THEMES[ws.theme];
  const subjectColor = SUBJECT_COLORS[ws.subject] || 'bg-gray-100 text-gray-500';

  const handleEdit = () => {
    setActiveWorksheet(ws);
    setCurrentView('editor');
  };

  return (
    <motion.div variants={itemVariants} className={`group grid grid-cols-[1fr_120px_110px_90px_100px_44px] gap-4 items-center px-5 py-3 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-0.5 h-8 rounded-full ${theme.colors} shrink-0`} />
        <div className="min-w-0">
          <button
            onClick={handleEdit}
            className="font-medium text-gray-900 text-sm hover:text-gray-900 transition-colors truncate block text-left max-w-xs"
          >
            {ws.title}
          </button>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <span>{theme.emoji} {theme.label}</span>
            {ws.assignedCount !== undefined && (
              <span className="flex items-center gap-0.5">· <Users size={10} /> {ws.assignedCount}</span>
            )}
          </div>
        </div>
      </div>

      {/* Subject */}
      <div>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${subjectColor}`}>
          {ws.subject}
        </span>
      </div>

      {/* Grade */}
      <span className="text-sm text-gray-500 truncate">{ws.gradeLevel}</span>

      {/* Questions */}
      <span className="text-sm text-gray-500 flex items-center gap-1.5">
        <HelpCircle size={13} className="text-gray-300" />
        {ws.questionCount}
      </span>

      {/* Status */}
      <Badge variant={STATUS_STYLES[ws.status] ?? 'secondary'} className="w-fit capitalize">
        {ws.status}
      </Badge>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
          >
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit3 size={13} /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateWorksheet(ws.id)}>
            <Copy size={13} /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAssign}>
            <Send size={13} /> Assign
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleLike(ws.id)}>
            <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-rose-500' : ''} />
            {isLiked ? 'Unlike' : 'Like'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => deleteWorksheet(ws.id)}
            className="text-red-500 focus:text-red-500 focus:bg-red-50"
          >
            <Trash2 size={13} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

function EmptyState({ tab, onCreateNew }: { tab: Tab; onCreateNew: () => void }) {
  const messages: Record<Tab, { emoji: string; title: string; desc: string }> = {
    mine: { emoji: '📋', title: 'No worksheets yet', desc: 'Create your first AI-powered worksheet in under 30 seconds!' },
    liked: { emoji: '💜', title: 'No liked worksheets', desc: 'Browse the Marketplace and like worksheets to save them here.' },
    assigned: { emoji: '📤', title: 'No assigned worksheets', desc: 'Assign worksheets to students from your library.' },
  };
  const { emoji, title, desc } = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <span className="text-5xl">{emoji}</span>
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{desc}</p>
      </div>
      {tab === 'mine' && (
        <Button onClick={onCreateNew} className="mt-1">
          <Plus size={14} /> Create Worksheet
        </Button>
      )}
    </div>
  );
}
