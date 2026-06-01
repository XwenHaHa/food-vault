'use client';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function Slider({ value, onChange, label }: SliderProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-medium">{label}</p>
        <span className="text-xs text-gray-400">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );
}
