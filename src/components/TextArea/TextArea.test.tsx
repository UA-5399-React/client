import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@/utils/test-utils';

import { TextArea } from './TextArea';

describe('UI Component: TextArea', () => {
  it('should render label and helper text', () => {
    render(<TextArea label="Description" helperText="Required field" />);

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();

    render(<TextArea label="Description" onChange={handleChange} />);

    const textAreaElement = screen.getByRole('textbox', {
      name: 'Description',
    });
    fireEvent.change(textAreaElement, { target: { value: 'New value' } });

    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('should apply custom textarea className and pass html attributes', () => {
    render(
      <TextArea
        label="Description"
        textAreaClassName="custom-textarea"
        rows={6}
        required
      />,
    );

    const textAreaElement = screen.getByRole('textbox', {
      name: 'Description',
    });

    expect(textAreaElement).toHaveClass('custom-textarea');
    expect(textAreaElement).toHaveAttribute('rows', '6');
    expect(textAreaElement).toBeRequired();
  });
});
