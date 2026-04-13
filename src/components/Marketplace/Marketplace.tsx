import { useState } from 'react';
import { Search, TrendingUp, Star, Sparkles, Heart, Copy, Clock, HelpCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorksheetStore } from '../../store/worksheetStore';
import { PUBLIC_WORKSHEETS, THEMES } from '../../data/mockData';
import type { Worksheet } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cardGridVariants, cardItemVariants, bannerVariants } from '@/lib/motion';

export function Marketplace() {
  const { myWorksheets, duplicateWorksheet, toggleLike, likedWorksheetIds } = useWorksheetStore();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const allPublic = [...PUBLIC_WORKSHEETS, ...myWorksheets.filter((w) => w.isPublic)];
  const filtered = allPublic.filter((w) => {
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase()) || w.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || w.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const SUBJECT_COLORS: Record<string, string> = {
    Math: 'bg-blue-100 text-blue-600', Reading: 'bg-purple-100 text-purple-600',
    Science: 'bg-green-100 text-green-600', 'Social-Emotional': 'bg-pink-100 text-pink-600',
    Communication: 'bg-teal-100 text-teal-600', 'Life Skills': 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shrink-0 shadow-sm shadow-orange-200">
            <Sparkles size={14} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Worksheet Marketplace</h1>
        </div>
        <p className="text-sm text-gray-400">Browse community worksheets. Duplicate and customise for your students.</p>
      </div>

      {/* Featured banner */}
      <motion.div className="mb-7 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-5" variants={bannerVariants} initial="hidden" animate="show">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={14} className="text-gray-900" />
              <span className="text-gray-900 text-xs font-medium">Most Used This Week</span>
            </div>
            <h2 className="font-semibold text-lg text-gray-900 mb-0.5">AAC Core Words Practice</h2>
            <p className="text-gray-500 text-sm">Core vocabulary with picture symbols for AAC users · 203 providers</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {[['203', 'Assigned'], ['4.9', 'Rating']].map(([val, lbl]) => (
              <div key={lbl} className="text-center px-3.5 py-2.5 bg-white rounded-xl border border-gray-100">
                <p className="text-xl font-bold leading-none text-gray-900">{val}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-0.5">
                  {lbl === 'Rating' && <Star size={9} fill="currentColor" className="text-amber-400" />} {lbl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input placeholder="Search marketplace…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Math', 'Reading', 'Life Skills', 'Social-Emotional', 'Communication', 'Science'].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSubjectFilter(cat === 'All' ? '' : cat)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
              (cat === 'All' && !subjectFilter) || subjectFilter === cat
                ? 'bg-[#1A8917] text-white border-[#1A8917] shadow-sm shadow-green-100'
                : 'bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-gray-300 hover:text-[#242424] hover:bg-[#F2F2F2]'
            )}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="font-medium text-gray-700">No worksheets found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variants={cardGridVariants} initial="hidden" animate="show">
          {filtered.map((ws) => (
            <PublicCard
              key={ws.id}
              worksheet={ws}
              subjectColor={SUBJECT_COLORS[ws.subject] || 'bg-gray-100 text-gray-500'}
              isLiked={likedWorksheetIds.has(ws.id)}
              onLike={() => toggleLike(ws.id)}
              onUse={() => duplicateWorksheet(ws.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
    </div>
  );
}

function PublicCard({ worksheet: ws, subjectColor, isLiked, onLike, onUse }: {
  worksheet: Worksheet;
  subjectColor: string;
  isLiked: boolean;
  onLike: () => void;
  onUse: () => void;
}) {
  const theme = THEMES[ws.theme];
  return (
    <motion.div variants={cardItemVariants} whileHover={{ y: -3, transition: { duration: 0.15 } }}>
    <Card className="hover:shadow-md hover:shadow-gray-200 transition-all duration-200 overflow-hidden flex flex-col border-gray-100">
      <div className={`h-1 ${theme.colors}`} />
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mb-1.5', subjectColor)}>
              {ws.subject}
            </span>
            <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{ws.title}</h3>
          </div>
        </div>

        {ws.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{ws.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap mt-auto">
          <span className="flex items-center gap-1"><HelpCircle size={11} /> {ws.questionCount}</span>
          <span>·</span>
          <span>{ws.gradeLevel}</span>
          {ws.assignedCount !== undefined && (
            <><span>·</span><span className="flex items-center gap-1"><Users size={11} /> {ws.assignedCount}</span></>
          )}
        </div>

        <Separator className="bg-gray-50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            {new Date(ws.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {ws.authorName && <span className="ml-1">· {ws.authorName}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={onLike} className={cn('h-7 w-7', isLiked ? 'text-rose-500' : 'text-gray-400')}>
              <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
            </Button>
            <Button variant="outline" size="sm" onClick={onUse} className="h-7 text-xs px-2.5">
              <Copy size={11} /> Use
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
