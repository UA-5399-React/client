import type { ProgressStep } from '@/types/order.types';

import { STEP_INDEX, STEPS } from '../constants';

interface OrderProgressBarProps {
  currentStep: ProgressStep;
}

export const OrderProgressBar = ({ currentStep }: OrderProgressBarProps) => {
  const activeIndex = STEP_INDEX[currentStep];
  const progress = activeIndex < 0 ? 0 : activeIndex / (STEPS.length - 1);

  return (
    <div className="relative flex w-full items-start justify-between px-6">
      <div className="absolute top-[18px] right-10 left-10 h-[2px] bg-gray-300" />
      <div
        className="absolute top-[18px] left-10 h-[2px] bg-violet-600 transition-all duration-500"
        style={{
          width: `calc(${progress * 100}% - ${progress * 80}px)`,
        }}
      />

      {STEPS.map(({ key, label, Icon }, index) => {
        const isDone = index <= activeIndex;
        const isActive = activeIndex >= 0 && index === activeIndex;

        return (
          <div
            key={key}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div
              data-testid={isDone ? 'step-done' : 'step-pending'}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300',
                isDone
                  ? 'border-violet-600 bg-violet-600'
                  : 'border-gray300 bg-white',
                isActive ? 'ring-4 ring-violet-600/15' : '',
              ].join(' ')}
            >
              {isDone ? (
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8l3.5 3.5L13 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="h-2 w-2 rounded-full bg-gray-300" />
              )}
            </div>

            <Icon
              className={`h-8 w-8 transition-colors duration-300 ${
                isDone ? 'text-black' : 'text-gray-300'
              }`}
            />

            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isDone ? 'text-black' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
