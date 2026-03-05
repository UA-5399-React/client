interface PriceRangeFilterProps {
  min: string;
  max: string;
  onChange: (min: string, max: string) => void;
}

export function PriceRangeFilter({
  min,
  max,
  onChange,
}: PriceRangeFilterProps) {
  return (
    <div>
      <span>Price</span>
      <div>
        <div>
          <span>$</span>
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={min}
            onChange={(e) => onChange(e.target.value, max)}
          />
        </div>
        <span>—</span>
        <div>
          <span>$</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={max}
            onChange={(e) => onChange(min, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
