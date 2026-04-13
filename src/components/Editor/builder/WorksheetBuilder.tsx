/**
 * WorksheetBuilder
 * Root component for the worksheet editing canvas.
 * Renders: WorksheetHeader → QuestionList → AddQuestionButton
 *
 * The AI sidebar in WorksheetEditor.tsx is NOT touched here.
 */
import { useWorksheetStore } from '../../../store/worksheetStore';
import { THEMES }            from '../../../data/mockData';
import { WorksheetHeader }   from './WorksheetHeader';
import { QuestionList }      from './QuestionList';
import { AddQuestionButton } from './AddQuestionButton';
import { nanoid }            from '../../../utils/nanoid';
import type { QuestionType } from '../../../types';

export function WorksheetBuilder() {
  const { activeWorksheet, addQuestion } = useWorksheetStore();

  if (!activeWorksheet) return null;

  const theme = THEMES[activeWorksheet.theme];
  const allQuestions = activeWorksheet.sections.flatMap((s) => s.questions);

  const handleAdd = (type: QuestionType) => {
    // Guarantee at least one section exists before adding
    const sectionId = activeWorksheet.sections[0]?.id;
    addQuestion(sectionId, type);
  };

  return (
    <div className="py-8 px-4">
      {/* Two-column layout: content column + sticky right toolbar (matches Google Forms) */}
      <div className="flex gap-4 justify-center">

        {/* ── Main content column ── */}
        <div className="w-full max-w-[640px] shrink-0 space-y-3">

          {/* Worksheet title + instructions */}
          <WorksheetHeader />

          {/* All question cards */}
          {activeWorksheet.sections.length > 0 && (
            <QuestionList
              sections={activeWorksheet.sections}
              themeClasses={{ colors: theme.colors, sectionText: theme.sectionText }}
            />
          )}

          {/* Empty state */}
          {allQuestions.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 py-20 text-center shadow-sm">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-medium text-gray-600 mb-1">No questions yet</p>
              <p className="text-sm text-gray-400">
                Click <strong>Add question</strong> below to get started
              </p>
            </div>
          )}

          {/* Add question button */}
          <AddQuestionButton onAdd={handleAdd} />
        </div>
      </div>
    </div>
  );
}
