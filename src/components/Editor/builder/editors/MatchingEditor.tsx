import { Plus, X } from 'lucide-react';
import type { MatchingPair } from '../../../../types';
import { nanoid } from '../../../../utils/nanoid';

interface Props {
  pairs: MatchingPair[];
  onChange: (pairs: MatchingPair[]) => void;
}

export function MatchingEditor({ pairs, onChange }: Props) {
  const updateLeft  = (id: string, val: string) => onChange(pairs.map((p) => p.id === id ? { ...p, left:  val } : p));
  const updateRight = (id: string, val: string) => onChange(pairs.map((p) => p.id === id ? { ...p, right: val } : p));
  const removePair  = (id: string) => onChange(pairs.filter((p) => p.id !== id));
  const addPair     = () => onChange([...pairs, { id: nanoid(), left: '', right: '' }]);

  return (
    <div className="py-2 space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Prompt</p>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Match</p>
      </div>

      {pairs.map((pair, i) => (
        <div key={pair.id} className="grid grid-cols-2 gap-4 group/pair">
          {/* Left */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}.</span>
            <input
              type="text"
              value={pair.left}
              onChange={(e) => updateLeft(pair.id, e.target.value)}
              placeholder={`Prompt ${i + 1}`}
              className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pair.right}
              onChange={(e) => updateRight(pair.id, e.target.value)}
              placeholder={`Match ${i + 1}`}
              className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
            />
            <button
              onClick={() => removePair(pair.id)}
              className="opacity-0 group-hover/pair:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0"
              title="Remove row"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addPair}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors pl-7 pt-1"
      >
        <Plus size={13} /> Add row
      </button>
    </div>
  );
}
