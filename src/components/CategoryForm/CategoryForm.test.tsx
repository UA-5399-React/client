import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';

import { CategoryForm } from './CategoryForm';

const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();
const mockNavigate = vi.fn();
let mockIsDark = false;

vi.mock('@/hooks/useCreateAdminCategory', () => ({
  useCreateAdminCategory: () => ({ createCategory: mockCreateCategory }),
}));

vi.mock('@/hooks/useUpdateAdminCategory', () => ({
  useUpdateAdminCategory: () => ({ updateCategory: mockUpdateCategory }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: mockIsDark }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDates = {
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('Component: CategoryForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    mockIsDark = false;
  });

  it('should render correctly in ADD mode', () => {
    render(<CategoryForm mode="add" />);
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('should render initial data in EDIT mode', () => {
    const initialData = {
      id: 'cat-123',
      title: 'Electronics',
      description: 'Gadgets',
      imageUrl: 'https://example.com/image.png',
      depth: 1 as const,
      ...mockDates,
    };
    render(<CategoryForm mode="edit" initialData={initialData} />);
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
  });

  it('should cover branch where isDark is true', () => {
    mockIsDark = true;
    render(<CategoryForm mode="add" />);
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('should handle branch with empty products list in edit mode', () => {
    const initialData = {
      id: 'cat-1',
      title: 'Empty Tech',
      description: 'No products here',
      depth: 1 as const,
      products: [],
      ...mockDates,
    };
    render(
      <CategoryForm
        mode="edit"
        initialData={initialData as unknown as undefined}
      />,
    );
    expect(screen.queryByText('MacBook')).not.toBeInTheDocument();
  });

  it('should cover branch where items is not provided', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);
    await user.click(screen.getByText(/Parent Category/i));
    expect(screen.getByText(/None/i)).toBeInTheDocument();
  });

  it('should handle branch when initialData imageUrl is missing', () => {
    const initialData = {
      id: 'cat-1',
      title: 'No Image',
      description: 'Desc',
      depth: 1 as const,
      ...mockDates,
    };
    render(<CategoryForm mode="edit" initialData={initialData} />);
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('should show validation errors for required fields on submit', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);
    const submitButton = screen.getByRole('button', { name: /Save|Category/i });
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Category name is required/i),
      ).toBeInTheDocument();
    });
  });

  it('should handle server error and display error message', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockRejectedValue(new Error('API Crash'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<CategoryForm mode="add" />);
    await user.type(
      screen.getByRole('textbox', { name: /Category Name/i }),
      'Error Case',
    );
    await user.type(
      screen.getByPlaceholderText(/Short description/i),
      'Some description',
    );
    await user.click(screen.getByRole('button', { name: /Save Category/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/Failed to save category/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    consoleSpy.mockRestore();
  });

  it('should call createCategory and navigate on successful submission', async () => {
    mockCreateCategory.mockResolvedValue({
      data: { createCategory: { id: '1' } },
    });
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);
    await user.type(
      screen.getByRole('textbox', { name: /Category Name/i }),
      'New Tech',
    );
    await user.type(screen.getByPlaceholderText(/Short description/i), 'Desc');
    await user.click(screen.getByRole('button', { name: /Save Category/i }));

    await waitFor(() => expect(mockCreateCategory).toHaveBeenCalled());
    expect(mockNavigate).toHaveBeenCalledWith('/admin/categories');
  });

  it('should cover dropdown item selection and filtering', async () => {
    const user = userEvent.setup();
    const items = [
      {
        id: 'cat-1',
        title: 'C1',
        description: 'D1',
        depth: 1 as const,
        ...mockDates,
      },
      {
        id: 'cat-2',
        title: 'C2',
        description: 'D2',
        depth: 1 as const,
        ...mockDates,
      },
    ];
    render(<CategoryForm mode="edit" initialData={items[0]} items={items} />);
    await user.click(screen.getByText(/Parent Category/i));
    await user.click(screen.getByText('C2'));
    expect(screen.getByText('C2')).toBeInTheDocument();
  });

  it('should cover edit mode features: description validation and products list', async () => {
    const user = userEvent.setup();
    const initialData = {
      id: 'cat-1',
      title: 'T',
      description: 'D',
      depth: 1 as const,
      products: [
        {
          id: 'p1',
          title: 'MacBook',
          images: ['i.png'],
          price: 10,
          status: 'PUBLISHED' as unknown as undefined,
          ...mockDates,
        },
      ],
      ...mockDates,
    };
    render(
      <CategoryForm
        mode="edit"
        initialData={initialData as unknown as undefined}
      />,
    );
    const descInput = screen.getByPlaceholderText(/Short description/i);
    await user.clear(descInput);
    await user.click(screen.getByRole('button', { name: /Update Category/i }));
    await waitFor(() =>
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument(),
    );
    expect(screen.getByText('MacBook')).toBeInTheDocument();
  });

  it('should navigate back when clicking the close (X) icon', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);
    await user.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should trigger file input when clicking the upload zone', async () => {
    const user = userEvent.setup();
    const { container } = render(<CategoryForm mode="add" />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    await user.click(screen.getByText(/Upload/i).closest('div')!);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should reset parent category to null when selecting None', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    const trigger =
      screen.getByRole('combobox') || screen.getByText(/Parent Category/i);
    await user.click(trigger);

    const noneOption = screen.getByText(/None/i);
    await user.click(noneOption);
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('should handle image upload and preview', async () => {
    const spy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:preview');
    const { container } = render(<CategoryForm mode="add" />);
    const file = new File(['img'], 'c.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'blob:preview',
    );
    spy.mockRestore();
  });

  it('should remove image preview when delete button is clicked', async () => {
    const user = userEvent.setup();
    const data = {
      id: '1',
      title: 'C',
      description: 'D',
      imageUrl: 'i.png',
      depth: 1 as const,
      ...mockDates,
    };
    const { container } = render(
      <CategoryForm mode="edit" initialData={data} />,
    );
    await user.click(container.querySelector('button.absolute')!);
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('should call navigate(-1) when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
