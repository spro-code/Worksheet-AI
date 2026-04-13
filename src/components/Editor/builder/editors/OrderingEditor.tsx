import { Plus, X } from 'lucide-react';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
}

export function OrderingEditor({ items, onChange }: Props) {
  const updateItem = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const addItem    = () => onChange([...items, '']);

  return (
    <div className="py-2 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 group/item">
          <span className="text-xs text-gray-400 w-5 text-right shrink-0 font-medium">{i + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={`Step ${i + 1}`}
            className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:border-gray-500 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
          />
          <button
            onClick={() => removeItem(i)}
            className="opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0"
            title="Remove item"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors pl-8 pt-1"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}
