import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  type Plugin,
  Tooltip,
} from 'chart.js';

import { Button, Input } from '@/components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const CHART_BLUE = 'rgb(55, 125, 255)';
const BAR_GREY = 'rgb(242, 244, 246)';
const DASH_GREY = 'rgb(177, 181, 195)';

function zeroBaselineDashPlugin(): Plugin<'bar'> {
  return {
    id: 'zeroBaselineDash',
    afterDatasetsDraw(chart) {
      const dataset = chart.data.datasets[0];
      const raw = dataset.data as number[];
      const meta = chart.getDatasetMeta(0);
      const y = chart.scales.y.getPixelForValue(0);
      const xScale = chart.scales.x;
      const { ctx } = chart;
      ctx.save();
      ctx.strokeStyle = DASH_GREY;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i < raw.length; i++) {
        if (raw[i] !== 0) continue;
        const el = meta.data[i];
        let x: number;
        let w: number;
        if (el && typeof el.x === 'number') {
          x = el.x;
          w = Math.max((el as { width?: number }).width ?? 0, 8);
        } else {
          x = xScale.getPixelForTick(i);
          const next =
            i < raw.length - 1
              ? xScale.getPixelForTick(i + 1)
              : x + (x - xScale.getPixelForTick(i - 1));
          w = Math.abs(next - x) * 0.5;
        }
        ctx.beginPath();
        ctx.moveTo(x - w / 2, y);
        ctx.lineTo(x + w / 2, y);
        ctx.stroke();
      }
      ctx.restore();
    },
  };
}

interface RegisteredUsersChartProps {
  registrationsThisMonth: number;
  dailyCounts: number[];
  dateLabel: string;
  highlightBarIndex?: number;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  loading?: boolean;
  error?: Error | null;
  onShowAll?: () => void;
}

export function UsersChart({
  registrationsThisMonth,
  dailyCounts,
  dateLabel,
  highlightBarIndex,
  selectedPeriod,
  onPeriodChange,
  loading = false,
  error = null,
  onShowAll,
}: RegisteredUsersChartProps) {
  const counts = dailyCounts;

  const plugin = useMemo(() => zeroBaselineDashPlugin(), []);

  const data = useMemo(
    () => ({
      labels: counts.map((_, i) => String(i + 1)),
      datasets: [
        {
          data: counts,
          backgroundColor: counts.map((v, i) => {
            if (v === 0) return 'transparent';
            if (highlightBarIndex !== undefined && i === highlightBarIndex)
              return CHART_BLUE;
            return BAR_GREY;
          }),
          borderWidth: 0,
          borderRadius: {
            topLeft: 3,
            topRight: 3,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          barPercentage: 0.62,
          categoryPercentage: 0.92,
        },
      ],
    }),
    [counts, highlightBarIndex],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const n = ctx.raw as number;
              return n === 0 ? 'No registrations' : `${n} registrations`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <section className="bg-background rounded-2xl border border-gray-300 p-4 shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-text text-base font-bold tracking-[0.08em] uppercase">
          Number of clients
        </h2>
        <div className="flex items-center gap-2">
          <Input
            id="users-chart-period"
            type="month"
            label="Period"
            value={selectedPeriod}
            onChange={(event) => onPeriodChange(event.target.value)}
            inputClassName="w-56 text-gray-700"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-2 py-2">
        {error ? (
          <p className="text-center text-sm text-red-600" role="alert">
            {error.message}
          </p>
        ) : null}

        <div className="flex flex-col items-center text-center">
          <p className="text-muted mb-1 text-xs font-semibold tracking-[0.06em] uppercase">
            Registrations this month
          </p>
          <p
            className={`text-5xl font-bold text-blue-500 tabular-nums ${loading ? 'opacity-50' : ''}`}
            aria-label={`Registrations this month: ${registrationsThisMonth}`}
          >
            {loading ? '…' : registrationsThisMonth.toLocaleString('en-GB')}
          </p>
        </div>

        <div className="border-muted/40 relative h-36 w-full max-w-md border-b">
          <Bar data={data} options={options} plugins={[plugin]} />
        </div>

        <p className="text-muted text-center text-sm">{dateLabel}</p>

        {onShowAll && (
          <Button
            onClick={onShowAll}
            className="rounded-full border! border-blue-500! bg-transparent p-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
          >
            Show all
          </Button>
        )}
      </div>
    </section>
  );
}
