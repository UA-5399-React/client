import clsx from 'clsx';
import { Check } from 'lucide-react';

type ProcessStepState = 'completed' | 'current' | 'upcoming';

interface ProcessStepConfig {
  title: string;
  number: string;
  state: ProcessStepState;
}

const desktopSteps: ProcessStepConfig[] = [
  {
    title: 'Shopping cart',
    number: '1',
    state: 'completed',
  },
  {
    title: 'Checkout details',
    number: '2',
    state: 'current',
  },
  {
    title: 'Order complete',
    number: '3',
    state: 'upcoming',
  },
];

const mobileSteps: ProcessStepConfig[] = [
  {
    title: 'Checkout details',
    number: '2',
    state: 'current',
  },
  {
    title: 'Order complete',
    number: '3',
    state: 'upcoming',
  },
];

const processContainerStyles: Record<
  ProcessStepState,
  { light: string; dark: string }
> = {
  completed: {
    light: 'border-primary text-primary',
    dark: 'border-primary text-primary',
  },
  current: {
    light: 'border-[#141718] text-[#23262F]',
    dark: 'border-white text-white',
  },
  upcoming: {
    light: 'border-[#E8ECEF] text-[#B1B5C3]',
    dark: 'border-gray-700 text-gray-500',
  },
};

const processBadgeStyles: Record<
  ProcessStepState,
  { light: string; dark: string }
> = {
  completed: {
    light: 'bg-primary text-white',
    dark: 'bg-primary text-white',
  },
  current: {
    light: 'bg-[#23262F] text-white',
    dark: 'bg-white text-[#141718]',
  },
  upcoming: {
    light: 'bg-[#B1B5C3] text-white',
    dark: 'bg-gray-700 text-white',
  },
};

const getProcessTone = (isDark: boolean) => (isDark ? 'dark' : 'light');

const ProcessStep = ({
  title,
  number,
  state,
  isDark,
}: ProcessStepConfig & { isDark: boolean }) => {
  const tone = getProcessTone(isDark);

  return (
    <div
      className={clsx('border-b-2 pb-6', processContainerStyles[state][tone])}
    >
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold',
            processBadgeStyles[state][tone],
          )}
        >
          {state === 'completed' ? <Check className="h-5 w-5" /> : number}
        </div>
        <span className="text-base font-semibold">{title}</span>
      </div>
    </div>
  );
};

export const DesktopProcess = ({ isDark }: { isDark: boolean }) => (
  <div className="mx-auto mt-10 hidden max-w-[832px] items-start justify-between md:flex">
    {desktopSteps.map((step) => (
      <ProcessStep key={step.number} {...step} isDark={isDark} />
    ))}
  </div>
);

export const MobileProcess = ({ isDark }: { isDark: boolean }) => (
  <div className="mt-6 flex overflow-hidden md:hidden">
    {mobileSteps.map((step, index) => (
      <div
        key={step.number}
        className={clsx('min-w-[256px]', index > 0 && 'ml-8')}
      >
        <ProcessStep {...step} isDark={isDark} />
      </div>
    ))}
  </div>
);
