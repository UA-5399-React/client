interface ThresholdRangeProps {
  redThreshold: number;
  greenThreshold: number;
  leftMin: number;
  trackMin: number;
  trackMax: number;
  colorMin: number;
  colorRange: number;
  step: number;
  onRedThresholdChange: (value: number) => void;
  onGreenThresholdChange: (value: number) => void;
}

export function ThresholdRange({
  redThreshold,
  greenThreshold,
  leftMin,
  trackMin,
  trackMax,
  colorMin,
  colorRange,
  step,
  onRedThresholdChange,
  onGreenThresholdChange,
}: ThresholdRangeProps) {
  const trackPercent = (value: number) =>
    ((value - colorMin) / colorRange) * 100;
  const redZoneEndPercent = trackPercent(redThreshold);
  const greenZoneStartPercent = trackPercent(greenThreshold);
  const trackGradient = `linear-gradient(to right, #DB162D 0%, #DB162D ${redZoneEndPercent}%, #F59E0B ${redZoneEndPercent}%, #F59E0B ${greenZoneStartPercent}%, #38CB89 ${greenZoneStartPercent}%, #38CB89 100%)`;

  return (
    <div className="w-full max-w-[360px]">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-gray-600">
        <span>Left: {redThreshold}%</span>
        <span>Right: {greenThreshold}%</span>
      </div>

      <div className="relative h-8">
        <div className="absolute top-1/2 h-6 w-full -translate-y-1/2 overflow-hidden rounded-full">
          <div
            className="h-full w-full"
            style={{ background: trackGradient }}
          />
        </div>

        <input
          type="range"
          min={leftMin}
          max={trackMax}
          step={step}
          value={redThreshold}
          onChange={(event) => onRedThresholdChange(Number(event.target.value))}
          className="pointer-events-none absolute top-1/2 z-10 h-8 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-1.5 [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-gray-500"
          aria-label="Red threshold"
        />
        <input
          type="range"
          min={trackMin}
          max={trackMax}
          step={step}
          value={greenThreshold}
          onChange={(event) =>
            onGreenThresholdChange(Number(event.target.value))
          }
          className="pointer-events-none absolute top-1/2 z-20 h-8 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-1.5 [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:bg-gray-500"
          aria-label="Green threshold"
        />
      </div>
    </div>
  );
}
