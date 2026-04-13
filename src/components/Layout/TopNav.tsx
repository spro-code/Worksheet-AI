import { BookOpen, Globe, Plus, Sparkles } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import type { AppView } from '../../types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function TopNav() {
  const { currentView, setCurrentView } = useWorksheetStore();

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'library', label: 'My Worksheets', icon: <BookOpen size={15} /> },
    { view: 'marketplace', label: 'Marketplace', icon: <Globe size={15} /> },
  ];

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            AbleSpace <span className="text-gray-500 font-normal">Worksheets</span>
          </span>
        </div>

        <Separator orientation="vertical" className="h-5" />

        {/* Nav */}
        <nav className="flex items-center gap-0.5 flex-1">
          {navItems.map(({ view, label, icon }) => (
            <Button
              key={view}
              variant={currentView === view ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView(view)}
              className={currentView === view ? 'text-[#1A8917] font-medium' : 'text-gray-500 font-normal'}
            >
              {icon}
              {label}
            </Button>
          ))}
        </nav>

        {/* Create CTA */}
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setCurrentView('create_method')}
          className="shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Worksheet
          <Sparkles size={13} />
        </Button>
      </div>
    </header>
  );
}
