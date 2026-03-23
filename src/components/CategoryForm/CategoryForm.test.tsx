import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';

import { CategoryForm } from './CategoryForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();

vi.mock('@/hooks/useCreateAdminCategory', () => ({
  useCreateAdminCategory: () => ({ createCategory: mockCreateCategory }),
}));

vi.mock('@/hooks/useUpdateAdminCategory', () => ({
  useUpdateAdminCategory: () => ({ updateCategory: mockUpdateCategory }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

vi.mock('@/constants', () => ({
  ROUTES: { ADMIN_CATEGORIES: '/admin/categories' },
}));

const mockItems = [
  {
    id: 'cat-1',
    title: 'Electronics',
    description: 'Electronics desc',
    parent: null,
    imageUrl: null,
    depth: 1 as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    title: 'Phones',
    description: 'Phones desc',
    parent: 'cat-1',
    imageUrl: null,
    depth: 2 as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockInitialData = {
  id: 'cat-1',
  title: 'Electronics',
  description: 'All electronics',
  parent: null,
  imageUrl: null,
  depth: 1 as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  products: [],
};

describe('Component: CategoryForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    mockCreateCategory.mockReset();
    mockUpdateCategory.mockReset();
  });

  it('should render ADD mode with correct title and button', () => {
    render(<CategoryForm mode="add" />);

    expect(screen.getByText('Add Category')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save Category' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Update Category' }),
    ).not.toBeInTheDocument();
  });

  it('should render EDIT mode with correct title and button', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockItems}
      />,
    );

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Update Category' }),
    ).toBeInTheDocument();
  });

  it('should render initial data in EDIT mode', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockItems}
      />,
    );

    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All electronics')).toBeInTheDocument();
  });

  it('should render image preview when imageUrl is provided', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={{
          ...mockInitialData,
          imageUrl: 'https://example.com/img.png',
        }}
        items={mockItems}
      />,
    );

    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'https://example.com/img.png',
    );
  });

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup({ delay: null });
    render(<CategoryForm mode="add" />);

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Description is required'),
    ).toBeInTheDocument();
  });

  it('should call createCategory and navigate on valid ADD submit', async () => {
    mockCreateCategory.mockResolvedValue({});
    const user = userEvent.setup({ delay: null });

    render(<CategoryForm mode="add" items={mockItems} />);

    fireEvent.change(screen.getByPlaceholderText('Category title'), {
      target: { value: 'New Category' },
    });
    fireEvent.change(screen.getByPlaceholderText('Short description'), {
      target: { value: 'Some description' },
    });

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith({
        title: 'New Category',
        description: 'Some description',
        parent: undefined,
        imageUrl: undefined,
        depth: 1,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/categories');
    });
  });

  it('should call createCategory with depth 2 when parent is selected', async () => {
    mockCreateCategory.mockResolvedValue({});
    const user = userEvent.setup({ delay: null });

    render(<CategoryForm mode="add" items={mockItems} />);

    fireEvent.change(screen.getByPlaceholderText('Category title'), {
      target: { value: 'Sub Category' },
    });
    fireEvent.change(screen.getByPlaceholderText('Short description'), {
      target: { value: 'Sub description' },
    });

    await user.click(screen.getByText('Parent Category'));
    await user.click(await screen.findByText('Electronics'));

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith(
        expect.objectContaining({ parent: 'cat-1', depth: 2 }),
      );
    });
  });

  it('should call updateCategory and navigate on valid EDIT submit', async () => {
    mockUpdateCategory.mockResolvedValue({});
    const user = userEvent.setup({ delay: null });

    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockItems}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('Electronics'), {
      target: { value: 'Updated Electronics' },
    });

    await user.click(screen.getByRole('button', { name: 'Update Category' }));

    await waitFor(() => {
      expect(mockUpdateCategory).toHaveBeenCalledWith(
        'cat-1',
        expect.objectContaining({ title: 'Updated Electronics' }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/admin/categories');
    });
  });

  it('should display server error when createCategory throws', async () => {
    mockCreateCategory.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup({ delay: null });

    render(<CategoryForm mode="add" />);

    fireEvent.change(screen.getByPlaceholderText('Category title'), {
      target: { value: 'Bad Category' },
    });
    fireEvent.change(screen.getByPlaceholderText('Short description'), {
      target: { value: 'Some description' },
    });

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    expect(
      await screen.findByText(
        'Failed to save category. Please try again later.',
      ),
    ).toBeInTheDocument();
  });

  it('should navigate back when Cancel is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<CategoryForm mode="add" />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate back when X button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<CategoryForm mode="add" />);

    const closeBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.querySelector('svg'));

    if (closeBtn) await user.click(closeBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should show image preview after file upload', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-url');

    const { container } = render(<CategoryForm mode="add" />);

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(['img'], 'cat.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'blob:fake-url',
    );
  });

  it('should remove image preview when remove button is clicked', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <CategoryForm
        mode="edit"
        initialData={{
          ...mockInitialData,
          imageUrl: 'https://example.com/img.png',
        }}
        items={mockItems}
      />,
    );

    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    const removeBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.classList.contains('absolute'));

    if (removeBtn) await user.click(removeBtn);

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('should open and close dropdown on click', async () => {
    const user = userEvent.setup({ delay: null });
    render(<CategoryForm mode="add" items={mockItems} />);

    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();

    await user.click(screen.getByText('Parent Category'));
    expect(screen.getByText('Electronics')).toBeInTheDocument();

    await user.click(screen.getByText('Parent Category'));
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
  });

  it('should select None (Top Level) from dropdown', async () => {
    const user = userEvent.setup({ delay: null });
    render(<CategoryForm mode="add" items={mockItems} />);

    await user.click(screen.getByText('Parent Category'));
    await user.click(screen.getByText('None (Top Level)'));

    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
  });

  it('should not open dropdown when category has children (edit mode)', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <CategoryForm
        mode="edit"
        initialData={{ ...mockInitialData, id: 'cat-1' }}
        items={mockItems}
      />,
    );

    await user.click(screen.getByText('Parent Category'));

    expect(screen.queryByText('None (Top Level)')).not.toBeInTheDocument();
  });

  it('should render products review in EDIT mode', () => {
    const products = [
      { id: 'p1', title: 'IPhone', price: 999, status: 'active' as const },
      { id: 'p2', title: 'MacBook', price: 2499, status: 'active' as const },
    ];

    render(
      <CategoryForm
        mode="edit"
        initialData={{ ...mockInitialData, products }}
        items={mockItems}
      />,
    );

    expect(screen.getByText('IPhone')).toBeInTheDocument();
    expect(screen.getByText('MacBook')).toBeInTheDocument();
  });

  it('should show "No products linked yet" when products array is empty', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={{ ...mockInitialData, products: [] }}
        items={mockItems}
      />,
    );

    expect(screen.getByText('No products linked yet.')).toBeInTheDocument();
  });

  it('should show "+ N more" button when products exceed 3', () => {
    const products = Array.from({ length: 5 }, (_, i) => ({
      id: `p${i}`,
      title: `Product ${i}`,
      price: 100,
      status: 'active' as const,
    }));

    render(
      <CategoryForm
        mode="edit"
        initialData={{ ...mockInitialData, products }}
        items={mockItems}
      />,
    );

    expect(screen.getByText('+ 2 more')).toBeInTheDocument();
  });
});
