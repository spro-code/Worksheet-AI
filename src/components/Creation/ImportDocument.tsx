import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { useWorksheetStore } from '../../store/worksheetStore';
import { nanoid } from '../../utils/nanoid';
import { generateQuestions } from '../../utils/aiMock';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ImportDocument() {
  const { setCurrentView, createWorksheet, setActiveWorksheet } = useWorksheetStore();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<'upload' | 'processing' | 'done'>('upload');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPhase('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) { clearInterval(interval); setPhase('done'); }
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    const questions = await generateQuestions({ source: 'document', topic: file?.name.replace(/\.[^/.]+$/, '') || 'Imported', questionCount: 8 });
    const ws = createWorksheet({
      title: `Imported: ${file?.name.replace(/\.[^/.]+$/, '') || 'Document'}`,
      subject: 'Other', gradeLevel: '3rd Grade', theme: 'minimal',
      sections: [{ id: nanoid(), title: 'Imported Questions', questions }],
      questionCount: questions.length, status: 'draft',
    });
    setActiveWorksheet(ws);
    setCurrentView('editor');
  };

  return (
    <div className="h-full overflow-y-auto">
    <div className="max-w-lg mx-auto px-6 py-10 animate-fade-in">
      <Button variant="ghost" size="sm" onClick={() => setCurrentView('create_method')} className="mb-7 -ml-1 text-gray-500">
        <ArrowLeft size={15} /> Back to Methods
      </Button>

      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Upload size={20} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Import a Document</h1>
          <p className="text-sm text-gray-500">Upload and convert to an editable worksheet</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Supported formats */}
          <div className="flex gap-2">
            {[['PDF', '📄', 'text-red-600 bg-red-50'], ['DOCX', '📝', 'text-blue-600 bg-blue-50'], ['TXT', '📃', 'text-gray-600 bg-gray-50'], ['IMAGE', '🖼️', 'text-purple-600 bg-purple-50']].map(([ext, icon, cls]) => (
              <div key={ext} className={cn('flex-1 flex flex-col items-center gap-1 p-2.5 rounded-lg text-center text-xs font-semibold', cls)}>
                <span className="text-lg">{icon}</span>
                {ext}
              </div>
            ))}
          </div>

          {phase === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              )}
            >
              <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <Upload size={30} className={cn('mx-auto mb-3', dragOver ? 'text-emerald-500' : 'text-gray-400')} />
              <p className="font-medium text-gray-700 text-sm mb-0.5">Drop your file here</p>
              <p className="text-xs text-gray-400">or click to browse · up to 20 MB</p>
            </div>
          )}

          {phase === 'processing' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file?.name}</p>
                  <p className="text-xs text-gray-400">{file ? (file.size / 1024).toFixed(0) : 0} KB</p>
                </div>
                <Loader2 size={15} className="text-emerald-500 animate-spin shrink-0" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Processing…</span><span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="space-y-1.5">
                {([['Reading document', 20], ['Extracting questions', 50], ['Converting to worksheet', 75], ['Adding answer keys', 100]] as [string, number][]).map(([label, threshold]) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                    {progress >= threshold
                      ? <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                      : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0" />}
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-2 gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Document Converted!</p>
                  <p className="text-xs text-gray-500 mt-0.5">8 questions extracted, ready to edit</p>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3.5 space-y-1.5">
                {['5 Multiple choice extracted', '2 Short answer extracted', '1 True/False extracted', 'Answer keys generated'].map((l) => (
                  <div key={l} className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle size={12} /> {l}
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5">
                <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} /> AI can improve this worksheet
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Simplify language', 'Add visual hints', 'Adapt difficulty', 'Add explanations'].map((opt) => (
                    <Badge key={opt} variant="outline" className="cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors">{opt}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleImport}>
                <CheckCircle size={15} /> Open in Editor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
