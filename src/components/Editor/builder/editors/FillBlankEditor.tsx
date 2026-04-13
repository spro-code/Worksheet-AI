import { ACCENT } from '../constants';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function FillBlankEditor({ value, onChange }: Props) {
  return (
    <div className="py-2 space-y-2">
      <p className="text-xs text-gray-400">Correct answer</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type the answer…"
        className="w-3/5 text-sm text-gray-700 border-b-2 border-gray-300 bg-transparent focus:outline-none py-1.5 placeholder:text-gray-400 transition-colors"
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = ACCENT)}
        onBlur={(e)  => (e.currentTarget.style.borderBottomColor = '')}
      />
    </div>
  );
}
