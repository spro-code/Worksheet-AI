import { useState } from 'react';
import { User, Users, Globe, Calendar, RotateCcw, Shuffle, CheckCircle } from 'lucide-react';
import type { Worksheet } from '../../types';
import { useWorksheetStore } from '../../store/worksheetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface AssignModalProps {
  worksheet: Worksheet;
  onClose: () => void;
}

const MOCK_STUDENTS = [
  { id: 's1', name: 'Alex Johnson', grade: '3rd Grade' },
  { id: 's2', name: 'Maya Patel', grade: '3rd Grade' },
  { id: 's3', name: 'Lucas Kim', grade: '3rd Grade' },
  { id: 's4', name: 'Sofia Rodriguez', grade: '2nd Grade' },
  { id: 's5', name: 'Noah Williams', grade: '3rd Grade' },
];

export function AssignModal({ worksheet, onClose }: AssignModalProps) {
  const [assignTo, setAssignTo] = useState<'individual' | 'group' | 'caseload'>('individual');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [retry, setRetry] = useState('3');
  const [shuffle, setShuffle] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { updateWorksheet } = useWorksheetStore();

  const toggleStudent = (id: string) =>
    setSelectedStudents((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const handleAssign = () => {
    updateWorksheet(worksheet.id, { status: 'assigned', assignedCount: selectedStudents.length || 5 });
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Worksheet Assigned!</p>
              <p className="text-sm text-gray-500 mt-0.5">Students have been notified.</p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Assign Worksheet</DialogTitle>
              <DialogDescription className="truncate">{worksheet.title}</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {/* Assign to */}
              <div className="space-y-2">
                <Label>Assign to</Label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'individual', label: 'Individual', sub: '1 student', icon: <User size={16} /> },
                    { id: 'group', label: 'Therapy Group', sub: 'Pre-set group', icon: <Users size={16} /> },
                    { id: 'caseload', label: 'My Caseload', sub: 'All students', icon: <Globe size={16} /> },
                  ] as const).map(({ id, label, sub, icon }) => (
                    <button
                      key={id}
                      onClick={() => setAssignTo(id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        assignTo === id
                          ? 'border-gray-1000 bg-gray-50 text-gray-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                      <span className="text-xs font-medium mt-0.5">{label}</span>
                      <span className={`text-xs ${assignTo === id ? 'text-gray-900' : 'text-gray-400'}`}>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group picker */}
              {assignTo === 'group' && (
                <div className="space-y-2">
                  <Label>Select therapy group</Label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'g1', name: 'Morning Speech Group', count: 4, color: 'bg-gray-100 text-gray-900' },
                      { id: 'g2', name: 'Reading Intervention – Block A', count: 6, color: 'bg-blue-100 text-blue-700' },
                      { id: 'g3', name: 'Social Skills Wednesday', count: 5, color: 'bg-pink-100 text-pink-700' },
                    ].map((g) => (
                      <label key={g.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="group" className="w-4 h-4 accent-gray-900" />
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${g.color}`}>
                          <Users size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{g.name}</p>
                          <p className="text-xs text-gray-400">{g.count} students</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual students */}
              {assignTo === 'individual' && (
                <div className="space-y-2">
                  <Label>Select students</Label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {MOCK_STUDENTS.map((s) => (
                      <label key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(s.id)}
                          onChange={() => toggleStudent(s.id)}
                          className="w-4 h-4 rounded accent-gray-900"
                        />
                        <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.grade}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="due" className="flex items-center gap-1.5">
                    <Calendar size={13} /> Due Date
                  </Label>
                  <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="retry" className="flex items-center gap-1.5">
                    <RotateCcw size={13} /> Retry Attempts
                  </Label>
                  <Select value={retry} onValueChange={setRetry}>
                    <SelectTrigger id="retry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="2">2 attempts</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <Shuffle size={14} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Shuffle questions</p>
                    <p className="text-xs text-gray-400">Randomize question order</p>
                  </div>
                </div>
                <Switch checked={shuffle} onCheckedChange={setShuffle} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleAssign}
                disabled={assignTo === 'individual' && selectedStudents.length === 0}
              >
                Assign Worksheet
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
