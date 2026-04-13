export function ParagraphEditor() {
  return (
    <div className="py-2 space-y-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-dotted border-gray-200 py-1" />
      ))}
      <span className="text-xs text-gray-400 italic">Long answer text</span>
    </div>
  );
}
