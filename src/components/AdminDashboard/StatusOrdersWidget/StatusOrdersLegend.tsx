import type { OrderStatusSegment } from '@/types';

import { LEFT_COL, RIGHT_COL, STATUS_COLORS, STATUS_LABELS } from './constants';

interface Props {
  statuses: OrderStatusSegment[];
}

export const StatusOrdersLegend = ({ statuses }: Props) => {
  const statusMap = Object.fromEntries(statuses.map((s) => [s.status, s]));

  const renderItem = (key: string) => {
    if (!statusMap[key]) return null;
    return (
      <div key={key} className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[key] }}
        />
        <span className="text-text text-sm">{STATUS_LABELS[key]}</span>
      </div>
    );
  };

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-2">{LEFT_COL.map(renderItem)}</div>
      <div className="flex flex-col gap-2">{RIGHT_COL.map(renderItem)}</div>
    </div>
  );
};
