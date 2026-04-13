import type { WorksheetSection } from '../../../types';
import { QuestionCard } from './QuestionCard';
import { cn } from '@/lib/utils';

interface Props {
  sections:     WorksheetSection[];
  themeClasses: { colors: string; sectionText: string };
}

export function QuestionList({ sections, themeClasses }: Props) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.id} className="space-y-3">
          {/* Section divider — only shown when multiple sections exist */}
          {sections.length > 1 && (
            <div className="flex items-center gap-3">
              <div className={`h-px flex-1 ${themeClasses.colors} opacity-20`} />
              <span className={cn('text-xs font-semibold px-3', themeClasses.sectionText)}>
                {section.title}
              </span>
              <div className={`h-px flex-1 ${themeClasses.colors} opacity-20`} />
            </div>
          )}

          {section.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              sectionId={section.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
