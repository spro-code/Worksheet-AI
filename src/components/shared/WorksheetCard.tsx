import { Heart, Copy, Edit3, Trash2, Send, MoreHorizontal, Clock, HelpCircle, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Worksheet } from '../../types';
import { THEMES } from '../../data/mockData';
import { useWorksheetStore } from '../../store/worksheetStore';

interface WorksheetCardProps {
  worksheet: Worksheet;
  variant?: 'my' | 'public';
  onEdit?: () => void;
  onAssign?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  published: 'bg-emerald-100 text-emerald-700',
  assigned: 'bg-gray-100 text-gray-900',
};

export function WorksheetCard({ worksheet, variant = 'my', onEdit, onAssign }: WorksheetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toggleLike, likedWorksheetIds, deleteWorksheet, duplicateWorksheet, setCurrentView, setActiveWorksheet } = useWorksheetStore();
  const isLiked = likedWorksheetIds.has(worksheet.id);
  const theme = THEMES[worksheet.theme];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEdit = () => {
    setActiveWorksheet(worksheet);
    setCurrentView('editor');
    onEdit?.();
  };

  const handleAssign = () => {
    onAssign?.();
  };

  const subjectColors: Record<string, string> = {
    Math: 'bg-blue-100 text-blue-600',
    Reading: 'bg-purple-100 text-purple-600',
    Writing: 'bg-indigo-100 text-indigo-600',
    Science: 'bg-green-100 text-green-600',
    'Social Studies': 'bg-amber-100 text-amber-600',
    'Life Skills': 'bg-orange-100 text-orange-600',
    'Social-Emotional': 'bg-pink-100 text-pink-600',
    Communication: 'bg-teal-100 text-teal-600',
    default: 'bg-gray-100 text-gray-500',
  };
  const subjectColor = subjectColors[worksheet.subject] || subjectColors.default;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:shadow-gray-200 transition-all duration-200 overflow-hidden group animate-fade-in flex flex-col">
      {/* Color strip header */}
      <div className={`h-1 ${theme.colors}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectColor}`}>
                {worksheet.subject}
              </span>
              {variant === 'my' && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[worksheet.status]}`}>
                  {worksheet.status}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 cursor-pointer hover:text-gray-900 transition-colors" onClick={handleEdit}>
              {worksheet.title}
            </h3>
          </div>

          {variant === 'my' && (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-lg shadow-gray-200 border border-gray-100 py-1 z-20 animate-slide-up">
                  <button onClick={() => { handleEdit(); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => { duplicateWorksheet(worksheet.id); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                    <Copy size={14} /> Duplicate
                  </button>
                  <button onClick={() => { handleAssign(); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                    <Send size={14} /> Assign
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button onClick={() => { deleteWorksheet(worksheet.id); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {worksheet.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{worksheet.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <HelpCircle size={12} />
            {worksheet.questionCount} questions
          </span>
          <span>•</span>
          <span>{worksheet.gradeLevel}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span>{theme.emoji}</span>
            {theme.label}
          </span>
          {worksheet.assignedCount !== undefined && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {worksheet.assignedCount} assigned
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {worksheet.tags && worksheet.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {worksheet.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-900 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {new Date(worksheet.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {worksheet.authorName && variant === 'public' && (
              <span className="ml-1 text-gray-500">· {worksheet.authorName}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {variant === 'public' && (
              <button
                onClick={() => duplicateWorksheet(worksheet.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                <Copy size={12} />
                Use
              </button>
            )}
            <button
              onClick={() => toggleLike(worksheet.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isLiked
                  ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            {variant === 'my' && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A8917] hover:bg-[#0F730C] rounded-lg transition-all"
              >
                <Edit3 size={12} />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
