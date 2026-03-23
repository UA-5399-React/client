import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { OrderProgressBar } from './OrderProgressBar';

describe('UI Component: OrderProgressBar', () => {
  it('should render all three step labels', () => {
    render(<OrderProgressBar currentStep="processed" />);

    expect(screen.getByText('Processed')).toBeInTheDocument();
    expect(screen.getByText('En Route')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should mark only first step as done when currentStep is processed', () => {
    render(<OrderProgressBar currentStep="processed" />);

    expect(screen.getAllByTestId('step-done')).toHaveLength(1);
    expect(screen.getAllByTestId('step-pending')).toHaveLength(2);
  });

  it('should mark first two steps as done when currentStep is shipped', () => {
    render(<OrderProgressBar currentStep="shipped" />);

    expect(screen.getAllByTestId('step-done')).toHaveLength(2);
    expect(screen.getAllByTestId('step-pending')).toHaveLength(1);
  });

  it('should mark all steps as done when currentStep is completed', () => {
    render(<OrderProgressBar currentStep="completed" />);

    expect(screen.getAllByTestId('step-done')).toHaveLength(3);
    expect(screen.queryAllByTestId('step-pending')).toHaveLength(0);
  });

  it('should render active label text for processed step', () => {
    render(<OrderProgressBar currentStep="processed" />);

    expect(screen.getByText('Processed')).toHaveClass(
      'text-[rgb(var(--color-text))]',
    );
    expect(screen.getByText('En Route')).not.toHaveClass(
      'text-[rgb(var(--color-text))]',
    );
  });

  it('should render active label text for shipped step', () => {
    render(<OrderProgressBar currentStep="shipped" />);

    expect(screen.getByText('En Route')).toHaveClass(
      'text-[rgb(var(--color-text))]',
    );
    expect(screen.getByText('Completed')).not.toHaveClass(
      'text-[rgb(var(--color-text))]',
    );
  });
});
