import { clamp } from "@/lib/utils/time";

interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}

export function NumberStepper({ value, min, max, step = 1, onChange, label }: NumberStepperProps) {
  const set = (next: number) => onChange(clamp(Math.round(next), min, max));
  return (
    <div className="flex items-center gap-2" aria-label={label}>
      <button
        type="button"
        aria-label={`${label} minus`}
        onClick={() => set(value - step)}
        className="h-8 w-8 rounded-lg bg-white/15 text-lg leading-none text-white hover:bg-white/25"
      >
        −
      </button>
      <input
        type="number"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => set(Number(e.target.value))}
        className="tabular w-14 rounded-lg bg-white/15 py-1.5 text-center text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`${label} plus`}
        onClick={() => set(value + step)}
        className="h-8 w-8 rounded-lg bg-white/15 text-lg leading-none text-white hover:bg-white/25"
      >
        +
      </button>
    </div>
  );
}
