import { useRef } from 'react';
import { ImagePlus, XCircle } from 'lucide-react';

interface Props {
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
}

export function ImageQuestionEditor({ imageUrl, onImageChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="mb-3">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {imageUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group/img">
          <img src={imageUrl} alt="Question" className="w-full max-h-52 object-contain bg-gray-50" />
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100">
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-50"
            >
              Replace
            </button>
            <button
              onClick={() => onImageChange(undefined)}
              className="bg-white text-red-500 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-red-50 flex items-center gap-1.5"
            >
              <XCircle size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all"
        >
          <ImagePlus size={24} />
          <span className="text-sm">Click to upload image</span>
          <span className="text-xs opacity-60">PNG, JPG, WEBP, GIF</span>
        </button>
      )}
    </div>
  );
}
