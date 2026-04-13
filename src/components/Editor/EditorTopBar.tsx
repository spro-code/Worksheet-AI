import { ArrowLeft, Save, Check, Palette, CheckSquare, Send, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { THEMES } from '../../data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { WorksheetTheme } from '../../types';
import { cn } from '@/lib/utils';

interface EditorTopBarProps {
  onFinalize: () => void;
  onAssign: () => void;
  onPreview: () => void;
}

export function EditorTopBar({ onFinalize, onAssign, onPreview }: EditorTopBarProps) {
  const { activeWorksheet, setCurrentView, updateWorksheet, editorContext, setEditorContext, setCaseloadReturnTab } = useWorksheetStore();
  const [saved, setSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal] = useState(activeWorksheet?.title || '');
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!activeWorksheet) return null;

  const isPublished = activeWorksheet.status === 'published' || activeWorksheet.status === 'assigned';
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (titleVal.trim()) updateWorksheet(activeWorksheet.id, { title: titleVal.trim() });
  };

  const themeColors = THEMES[activeWorksheet.theme];

  return (
    <div className="bg-white/90 backdrop-blur border-b border-gray-100 px-4 h-12 flex items-center gap-3 shrink-0 z-30">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (editorContext === 'caseload') {
            setCaseloadReturnTab('Worksheets');
            setEditorContext('default');
            setCurrentView('caseload');
          } else {
            setEditorContext('default');
            setCurrentView('library');
          }
        }}
        className="text-gray-500 shrink-0"
      >
        <ArrowLeft size={15} /> {editorContext === 'caseload' ? 'Caseload' : 'Library'}
      </Button>

      <Separator orientation="vertical" className="h-5" />

      {/* Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full ${themeColors.colors} shrink-0`} />
        {editingTitle ? (
          <input
            autoFocus
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            className="text-sm font-medium text-gray-900 focus:outline-none border-b border-[#1A8917] bg-transparent min-w-0 flex-1"
          />
        ) : (
          <button
            className="text-sm font-medium text-gray-900 truncate hover:text-gray-900 transition-colors text-left"
            onClick={() => { setEditingTitle(true); setTitleVal(activeWorksheet.title); }}
          >
            {activeWorksheet.title}
          </button>
        )}
        <Badge variant="secondary" className="capitalize shrink-0 text-xs">{activeWorksheet.status}</Badge>
      </div>

      <span className="text-xs text-gray-400 shrink-0 hidden md:block">
        {activeWorksheet.questionCount} questions
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Theme picker */}
        <div className="relative" ref={themeRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setThemeOpen((o) => !o)}
            className="gap-1.5"
          >
            <div className={`w-3 h-3 rounded-full ${themeColors.colors} shrink-0`} />
            <Palette size={13} />
            <span className="hidden sm:inline">Theme</span>
          </Button>

          {themeOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-lg p-2 z-50 w-52">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pb-1.5">Theme</p>
              {(Object.entries(THEMES) as [WorksheetTheme, typeof THEMES[WorksheetTheme]][]).map(([key, t]) => {
                const isActive = activeWorksheet.theme === key;
                return (
                  <button
                    key={key}
                    onClick={() => { updateWorksheet(activeWorksheet.id, { theme: key }); setThemeOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all text-left',
                      isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className={`w-4 h-4 rounded-full ${t.colors} shrink-0`} />
                    {t.label}
                    {isActive && <Check size={12} className="ml-auto text-gray-900" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isPublished ? (
          <Button variant="outline" size="sm" onClick={onPreview} className="gap-1.5">
            <Eye size={14} /> Preview
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className={saved ? 'border-emerald-300 text-emerald-600 bg-emerald-50' : ''}
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </Button>
        )}

        {isPublished ? (
          <Button size="sm" onClick={onAssign} className="bg-[#1A8917] hover:bg-[#0F730C] text-white gap-1.5">
            <Send size={14} /> Assign
          </Button>
        ) : (
          <Button size="sm" onClick={onFinalize} className="bg-[#1A8917] hover:bg-[#0F730C] text-white gap-1.5">
            <CheckSquare size={14} /> Finalize
          </Button>
        )}
      </div>
    </div>
  );
}
