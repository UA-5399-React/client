import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import type { SalesDynamicsPoint } from '@/hooks/useSalesDynamics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface SalesDynamicsChartProps {
  points: SalesDynamicsPoint[];
  productIds: string[];
  productLabels: Record<string, string>;
  loading?: boolean;
}

const COLORS = [
  { line: '#3b82f6', fill: 'rgba(59,130,246,0.08)' },
  { line: '#f59e0b', fill: 'rgba(245,158,11,0.08)' },
];

export const SalesDynamicsChart: React.FC<SalesDynamicsChartProps> = ({
  points,
  productIds,
  productLabels,
  loading,
}) => {
  if (loading) {
    return (
      <div className="sd-chart__placeholder">
        <div className="sd-chart__spinner" />
        <span>Loading chart data...</span>
      </div>
    );
  }

  if (productIds.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400">
        <span className="text-4xl opacity-50">📊</span>
        <p className="text-[13px] font-medium text-slate-600">
          Select a product to see sales dynamics
        </p>
      </div>
    );
  }
  const dates = [...new Set(points.map((p) => p.date))].sort();

  const isDense = dates.length > 40;

  const datasets = productIds.map((productId, idx) => {
    const color = COLORS[idx] ?? COLORS[0];
    const productPoints = points.filter((p) => p.productId === productId);
    const dataMap = new Map(productPoints.map((p) => [p.date, p.value]));

    return {
      label: productLabels[productId] ?? productId,
      data: dates.map((d) => dataMap.get(d) ?? 0),
      borderColor: color.line,
      backgroundColor: color.fill,
      pointBackgroundColor: color.line,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: isDense ? 0 : idx === 0 ? 5 : 4,
      pointHoverRadius: isDense ? 5 : 7,
      borderWidth: idx === 0 ? 3.5 : 2,
      tension: 0.4,
      fill: productIds.length === 1,
      borderDash: [],
      order: idx > 0 ? 0 : 1,
    };
  });

  const data = { labels: dates, datasets };

  const options: React.ComponentProps<typeof Line>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
        border: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          padding: 8,
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
