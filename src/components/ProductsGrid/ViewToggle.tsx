import { Columns, Grid2x2, Grid3x3, List } from 'lucide-react';

import type { ViewType } from './types';

interface ViewToggleProps {
  value: ViewType;
  onChange: (view: ViewType) => void;
  isMobile: boolean;
}

const mobileViews = [
  { type: 'list' as ViewType, icon: <List size={20} /> },
  { type: 'grid-2' as ViewType, icon: <Grid2x2 size={20} /> },
];

const desktopViews = [
  { type: 'grid-4' as ViewType, icon: <Grid3x3 size={20} /> },
  { type: 'grid-2' as ViewType, icon: <Grid2x2 size={20} /> },
  { type: 'grid-1' as ViewType, icon: <Columns size={20} /> },
  { type: 'list' as ViewType, icon: <List size={20} /> },
];

const ViewToggle: React.FC<ViewToggleProps> = ({
  value,
  onChange,
  isMobile,
}) => {

  const views = isMobile ? mobileViews : desktopViews;

  return (
    <div className="bg-color-bg flex w-full items-center justify-end gap-1 rounded-lg py-5">
      {views.map((view) => (
        <div
          key={view.type}
          onClick={() => onChange(view.type)}
          className={`flex items-center justify-center rounded-md p-2 transition-all duration-200 ${
            value === view.type
              ? 'text-color-text bg-color-bg shadow-sm'
              : 'text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-700'
          }`}
          title={view.type}
        >
          {view.icon}
        </div>
      ))}
    </div>
  );
};

export default ViewToggle;
