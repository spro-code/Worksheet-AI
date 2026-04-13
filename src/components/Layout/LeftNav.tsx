import { BookOpen, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorksheetStore } from '../../store/worksheetStore';
import type { AppView } from '../../types';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { view: AppView; label: string; icon: React.ReactNode }[] = [
  { view: 'library',     label: 'My Worksheets', icon: <BookOpen size={16} /> },
  { view: 'caseload',    label: 'Caseload',       icon: <Users size={16} /> },
  { view: 'marketplace', label: 'Marketplace',    icon: <Globe size={16} /> },
];

export function LeftNav() {
  const { currentView, setCurrentView } = useWorksheetStore();

  return (
    <motion.aside
      className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col h-full"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Logo — h-14 matches every page's top bar */}
      <div className="h-14 shrink-0 px-5 flex items-center border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-gray-900 tracking-tight">AbleSpace</p>
            <p className="text-[11px] text-gray-400 font-medium">Worksheets</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ view, label, icon }) => {
          const active = currentView === view;
          return (
            <motion.button
              key={view}
              onClick={() => setCurrentView(view)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left',
                active
                  ? 'bg-[#1A8917] text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span>{icon}</span>
              {label}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom user stub */}
      <div className="px-3 py-3 border-t border-gray-100">
        <motion.div
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Teacher</p>
            <p className="text-[11px] text-gray-400 truncate">Special Ed</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
