import { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { Plugin } from 'chart.js';
import { ArcElement, Chart as ChartJS } from 'chart.js';

import type { OrdersStatusStats, OrderStatusSegment } from '@/types';

import { STATUS_COLORS } from './constants';
ChartJS.register(ArcElement);

interface HoverPercentageOptions {
  statuses: OrderStatusSegment[];
  opacityRef: React.MutableRefObject<number>;
  activeIndexRef: React.MutableRefObject<number | null>;
  rafRef: React.MutableRefObject<number | null>;
}
//comment to ignore testing of plugin
/* v8 ignore start */
const hoverPercentagePlugin: Plugin<'doughnut'> = {
  id: 'hoverPercentage',

  afterEvent(chart) {
    const pluginOptions = (chart.options.plugins as Record<string, unknown>)
      ?.hoverPercentage as HoverPercentageOptions;
    if (!pluginOptions) return;

    const { opacityRef, activeIndexRef, rafRef } = pluginOptions;
    const activeElements = chart.getActiveElements();
    const newIndex = activeElements.length ? activeElements[0].index : null;

    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex;
      opacityRef.current = 0;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (newIndex !== null) {
        const fadeIn = () => {
          opacityRef.current = Math.min(1, opacityRef.current + 0.07);
          chart.draw();
          if (opacityRef.current < 1) {
            rafRef.current = requestAnimationFrame(fadeIn);
          }
        };
        rafRef.current = requestAnimationFrame(fadeIn);
      }
    }
  },

  afterDraw(chart) {
    const pluginOptions = (chart.options.plugins as Record<string, unknown>)
      ?.hoverPercentage as HoverPercentageOptions;
    if (!pluginOptions) return;

    const { statuses, opacityRef, activeIndexRef } = pluginOptions;
    const index = activeIndexRef.current;
    if (index === null || opacityRef.current <= 0) return;

    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const arc = meta.data[index] as unknown as {
      startAngle: number;
      endAngle: number;
      outerRadius: number;
      x: number;
      y: number;
    };

    const midAngle = (arc.startAngle + arc.endAngle) / 2;
    const labelRadius = arc.outerRadius + 18;
    const x = arc.x + labelRadius * Math.cos(midAngle);
    const y = arc.y + labelRadius * Math.sin(midAngle);

    const segment = statuses[index];
    if (!segment) return;

    const color = (chart.data.datasets[0].backgroundColor as string[])[index];

    ctx.save();
    ctx.globalAlpha = opacityRef.current;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${segment.percentage}%`, x, y);
    ctx.restore();
  },
};
/* v8 ignore stop */
ChartJS.register(hoverPercentagePlugin);

interface Props {
  data: OrdersStatusStats;
}

export const StatusOrdersChart = ({ data }: Props) => {
  const opacityRef = useRef<number>(0);
  const activeIndexRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const chartData = {
    datasets: [
      {
        data: data.statuses.map((s) => s.count),
        backgroundColor: data.statuses.map((s) => STATUS_COLORS[s.status]),
        borderWidth: 0,
        hoverOffset: 14,
      },
    ],
  };

  const options = {
    cutout: '75%',
    layout: { padding: 30 },
    plugins: {
      tooltip: { enabled: false },
      hoverPercentage: {
        statuses: data.statuses,
        opacityRef,
        activeIndexRef,
        rafRef,
      },
    },
    animation: {
      duration: 600,
      easing: 'easeInOutQuart' as const,
    },
    transitions: {
      active: {
        animation: {
          duration: 300,
          easing: 'easeOutCubic' as const,
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      <Doughnut data={chartData} options={options} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 700,
          pointerEvents: 'none',
        }}
      >
        {data.total}
      </div>
    </div>
  );
};
