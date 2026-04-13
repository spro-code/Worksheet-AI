import { useState, useRef, useCallback } from 'react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { EditorTopBar } from './EditorTopBar';
import { WorksheetCanvas } from './WorksheetCanvas';
import { AISidebar } from './AISidebar';
import { FinalizeModal } from './FinalizeModal';
import { AssignModal } from '../Library/AssignModal';

const SIDEBAR_MIN = 260;
const SIDEBAR_MAX = 600;
const SIDEBAR_DEFAULT = 320;

export function WorksheetEditor() {
  const { activeWorksheet, editorContext, setEditorContext } = useWorksheetStore();
  const fromCaseload = editorContext === 'caseload';
  const [showFinalize, setShowFinalize] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(SIDEBAR_DEFAULT);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - ev.clientX;
      const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startWidth.current + delta));
      setSidebarWidth(next);
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [sidebarWidth]);

  if (!activeWorksheet) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        No worksheet selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden animate-fade-in">
      <EditorTopBar
        onFinalize={() => setShowFinalize(true)}
        onAssign={() => setShowAssign(true)}
        onPreview={() => setShowFinalize(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F0EBF8] px-6 py-8 min-w-0">
          <WorksheetCanvas />
        </main>

        {/* Drag handle + AI Sidebar — hidden when opened from Caseload */}
        {!fromCaseload && (
          <>
            <div
              onMouseDown={onMouseDown}
              className="w-1 shrink-0 cursor-col-resize bg-gray-200 hover:bg-[#1A8917] transition-colors duration-150 active:bg-gray-500"
              title="Drag to resize"
            />
            <aside
              style={{ width: sidebarWidth }}
              className="shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
            >
              <AISidebar onFinalize={() => setShowFinalize(true)} />
            </aside>
          </>
        )}
      </div>

      {showFinalize && (
        <FinalizeModal onClose={() => setShowFinalize(false)} />
      )}
      {showAssign && activeWorksheet && (
        <AssignModal worksheet={activeWorksheet} onClose={() => setShowAssign(false)} />
      )}
    </div>
  );
}
