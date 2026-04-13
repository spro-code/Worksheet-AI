import { Plus, CheckSquare, Type, AlignLeft, Check, Image, Minus, Link2, List, ToggleLeft, FolderPlus, Video, Lightbulb, BookOpen } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import type { QuestionType } from '../../types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const QUESTION_TYPES: { type: QuestionType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'multiple_choice', label: 'Multiple Choice', icon: <CheckSquare size={14} />, color: 'text-gray-900 hover:bg-gray-50' },
  { type: 'short_answer', label: 'Short Answer', icon: <Type size={14} />, color: 'text-blue-700 hover:bg-blue-50' },
  { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft size={14} />, color: 'text-indigo-700 hover:bg-indigo-50' },
  { type: 'checkbox', label: 'Checkbox', icon: <Check size={14} />, color: 'text-emerald-700 hover:bg-emerald-50' },
  { type: 'image_question', label: 'Image Question', icon: <Image size={14} />, color: 'text-pink-700 hover:bg-pink-50' },
  { type: 'fill_blank', label: 'Fill in the Blank', icon: <Minus size={14} />, color: 'text-orange-700 hover:bg-orange-50' },
  { type: 'matching', label: 'Matching', icon: <Link2 size={14} />, color: 'text-teal-700 hover:bg-teal-50' },
  { type: 'ordering', label: 'Ordering', icon: <List size={14} />, color: 'text-sky-700 hover:bg-sky-50' },
  { type: 'true_false', label: 'True / False', icon: <ToggleLeft size={14} />, color: 'text-rose-700 hover:bg-rose-50' },
];

const CONTENT_BLOCKS = [
  { icon: <FolderPlus size={14} />, label: 'Add Section', color: 'text-gray-700 hover:bg-gray-100' },
  { icon: <Image size={14} />, label: 'Add Image', color: 'text-purple-700 hover:bg-purple-50' },
  { icon: <Video size={14} />, label: 'Add Video', color: 'text-red-700 hover:bg-red-50' },
  { icon: <Lightbulb size={14} />, label: 'Hint Block', color: 'text-amber-700 hover:bg-amber-50' },
  { icon: <BookOpen size={14} />, label: 'Answer Key', color: 'text-green-700 hover:bg-green-50' },
];

export function QuestionBuilder() {
  const { addQuestion, activeWorksheet } = useWorksheetStore();

  const handleAddType = (_type: QuestionType) => {
    addQuestion(activeWorksheet?.sections[0]?.id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Add Question</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-0.5">
          {QUESTION_TYPES.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => handleAddType(type)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${color}`}
            >
              <span className="shrink-0 opacity-70">{icon}</span>
              {label}
              <Plus size={12} className="ml-auto opacity-40 shrink-0" />
            </button>
          ))}

          <Separator className="my-3" />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-1">Content</p>
          {CONTENT_BLOCKS.map(({ icon, label, color }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${color}`}
            >
              <span className="shrink-0 opacity-70">{icon}</span>
              {label}
              <Plus size={12} className="ml-auto opacity-40 shrink-0" />
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-100">
        <Button className="w-full" size="sm" onClick={() => addQuestion(activeWorksheet?.sections[0]?.id)}>
          <Plus size={14} /> Add Question
        </Button>
      </div>
    </div>
  );
}
