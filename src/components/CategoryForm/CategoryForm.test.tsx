import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { CategoryForm } from './CategoryForm';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
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

const mockCategories = [
  {
    id: 'cat-1',
    title: 'Electronics',
    depth: 1 as const,
    description: 'Electronic items',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'cat-2',
    title: 'Clothing',
    depth: 1 as const,
    description: 'Clothing items',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockInitialData = {
  id: 'cat-3',
  title: 'Laptops',
  description: 'Laptop computers',
  depth: 2 as const,
  parent: 'cat-1',
  imageUrl: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  products: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UI Component: CategoryForm — Add Mode', () => {
  it('should render the Add Category heading', () => {
    render(<CategoryForm mode="add" />);

    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('should render all required fields in add mode', () => {
    render(<CategoryForm mode="add" />);

    expect(screen.getByPlaceholderText('Category title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Short description'),
    ).toBeInTheDocument();
    expect(screen.getByText('Parent Category')).toBeInTheDocument();
  });

  it('should render Save Category submit button', () => {
    render(<CategoryForm mode="add" />);

    expect(
      screen.getByRole('button', { name: 'Save Category' }),
    ).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('should not call createCategory when form is invalid', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).not.toHaveBeenCalled();
    });
  });

  it('should call createCategory with correct payload on valid submit', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockResolvedValueOnce({});
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.type(
      screen.getByPlaceholderText('Category title'),
      'New Category',
    );
    await user.type(
      screen.getByPlaceholderText('Short description'),
      'A description',
    );
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith({
        title: 'New Category',
        description: 'A description',
        parent: undefined,
        imageUrl: undefined,
        depth: 1,
      });
    });
  });

  it('should navigate to admin categories after successful creation', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockResolvedValueOnce({});
    render(<CategoryForm mode="add" />);

    await user.type(
      screen.getByPlaceholderText('Category title'),
      'New Category',
    );
    await user.type(
      screen.getByPlaceholderText('Short description'),
      'A description',
    );
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('categories'),
      );
    });
  });

  it('should show server error message when createCategory fails', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockRejectedValueOnce(new Error('Server error'));
    render(<CategoryForm mode="add" />);

    await user.type(
      screen.getByPlaceholderText('Category title'),
      'New Category',
    );
    await user.type(
      screen.getByPlaceholderText('Short description'),
      'A description',
    );
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to save category. Please try again later.'),
      ).toBeInTheDocument();
    });
  });

  it('should navigate back when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate back when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find((btn) => btn.querySelector('svg'));
    await user.click(xButton!);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

describe('UI Component: CategoryForm — Parent Category Dropdown', () => {
  it('should open dropdown when Level field is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.click(screen.getByText('Parent Category'));

    expect(screen.getByText('None (Top Level)')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
  });

  it('should select a parent category from the dropdown', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.click(screen.getByText('Parent Category'));
    await user.click(screen.getByText('Electronics'));

    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.queryByText('None (Top Level)')).not.toBeInTheDocument();
  });

  it('should set depth to 2 when a parent is selected', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockResolvedValueOnce({});
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.click(screen.getByText('Parent Category'));
    await user.click(screen.getByText('Electronics'));
    await user.type(screen.getByPlaceholderText('Category title'), 'Phones');
    await user.type(
      screen.getByPlaceholderText('Short description'),
      'Mobile phones',
    );
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith(
        expect.objectContaining({ depth: 2, parent: 'cat-1' }),
      );
    });
  });

  it('should reset parent to null when None (Top Level) is selected', async () => {
    const user = userEvent.setup();
    mockCreateCategory.mockResolvedValueOnce({});
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.click(screen.getByText('Parent Category'));
    await user.click(screen.getByText('Electronics'));
    await user.click(screen.getByText('Electronics'));
    await user.click(screen.getByText('None (Top Level)'));

    await user.type(
      screen.getByPlaceholderText('Category title'),
      'Top Level Cat',
    );
    await user.type(
      screen.getByPlaceholderText('Short description'),
      'A description',
    );
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith(
        expect.objectContaining({ depth: 1, parent: undefined }),
      );
    });
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" items={mockCategories} />);

    await user.click(screen.getByText('Parent Category'));
    expect(screen.getByText('None (Top Level)')).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText('None (Top Level)')).not.toBeInTheDocument();
    });
  });
});

describe('UI Component: CategoryForm — Edit Mode', () => {
  it('should render the Edit Category heading', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
  });

  it('should pre-populate fields with initial data', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    expect(screen.getByDisplayValue('Laptops')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Laptop computers')).toBeInTheDocument();
  });

  it('should render Update Category submit button', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Update Category' }),
    ).toBeInTheDocument();
  });

  it('should call updateCategory with the correct id and payload', async () => {
    const user = userEvent.setup();
    mockUpdateCategory.mockResolvedValueOnce({});
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    await user.clear(screen.getByDisplayValue('Laptops'));
    await user.type(
      screen.getByPlaceholderText('Category title'),
      'Gaming Laptops',
    );
    await user.click(screen.getByRole('button', { name: 'Update Category' }));

    await waitFor(() => {
      expect(mockUpdateCategory).toHaveBeenCalledWith(
        'cat-3',
        expect.objectContaining({ title: 'Gaming Laptops' }),
      );
    });
  });

  it('should not call updateCategory when form has validation errors', async () => {
    const user = userEvent.setup();
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    await user.clear(screen.getByDisplayValue('Laptops'));
    await user.click(screen.getByRole('button', { name: 'Update Category' }));

    await waitFor(() => {
      expect(mockUpdateCategory).not.toHaveBeenCalled();
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('should show Products Review section in edit mode', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    expect(screen.getByText('Products Review')).toBeInTheDocument();
  });

  it('should display "No products linked yet" when products array is empty', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={mockCategories}
      />,
    );

    expect(screen.getByText('No products linked yet.')).toBeInTheDocument();
  });

  it('should display products when initialData has products', () => {
    const dataWithProducts = {
      ...mockInitialData,
      products: [
        {
          id: 'p1',
          title: 'ThinkPad X1',
          price: 999,
          imageUrl: undefined,
          status: 'active' as const,
        },
        {
          id: 'p2',
          title: 'MacBook Pro',
          price: 1999,
          imageUrl: undefined,
          status: 'active' as const,
        },
      ],
    };
    render(
      <CategoryForm
        mode="edit"
        initialData={dataWithProducts}
        items={mockCategories}
      />,
    );

    expect(screen.getByText('THINKPAD X1')).toBeInTheDocument();
    expect(screen.getByText('MACBOOK PRO')).toBeInTheDocument();
  });

  it('should show "+ N more" button when there are more than 3 products', () => {
    const dataWithProducts = {
      ...mockInitialData,
      products: Array.from({ length: 5 }, (_, i) => ({
        id: `p${i}`,
        title: `Product ${i}`,
        price: 100,
        status: 'active' as const,
      })),
    };
    render(
      <CategoryForm
        mode="edit"
        initialData={dataWithProducts}
        items={mockCategories}
      />,
    );

    expect(screen.getByText('+ 2 more')).toBeInTheDocument();
  });

  it('should exclude the current category from the parent dropdown options', async () => {
    const user = userEvent.setup();
    const itemsIncludingSelf = [
      ...mockCategories,
      { ...mockInitialData, products: undefined },
    ];
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={itemsIncludingSelf}
      />,
    );

    await user.click(screen.getByText('Electronics'));

    const dropdownItems = screen.getAllByText('Laptops');
    expect(dropdownItems).toHaveLength(1);
  });

  it('should disable the Level dropdown when the category has children', async () => {
    const user = userEvent.setup();
    const itemsWithChild = [
      ...mockCategories,
      {
        id: 'cat-4',
        title: 'Child Cat',
        depth: 2 as const,
        parent: 'cat-3',
        description: 'child',
        createdAt: '',
        updatedAt: '',
      },
    ];
    render(
      <CategoryForm
        mode="edit"
        initialData={mockInitialData}
        items={itemsWithChild}
      />,
    );

    const levelDropdown = screen
      .getByText('Electronics')
      .closest('div[class*="cursor"]');
    await user.click(levelDropdown!);

    expect(screen.queryByText('None (Top Level)')).not.toBeInTheDocument();
  });
});

describe('UI Component: CategoryForm — Image Upload', () => {
  it('should render the image upload area', () => {
    render(<CategoryForm mode="add" />);

    expect(screen.getByText('Category Image')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('should show image preview after file selection', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Preview' })).toBeInTheDocument();
    });
  });

  it('should remove image preview when X button on image is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" />);

    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Preview' })).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button');
    const removeImageBtn = removeButtons.find(
      (btn) =>
        btn.classList.contains('text-[#F25F5F]') || btn.closest('.-top-3'),
    );
    await user.click(removeImageBtn!);

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: 'Preview' }),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });
  });

  it('should render existing imageUrl as preview in edit mode', () => {
    const dataWithImage = {
      ...mockInitialData,
      imageUrl: 'https://example.com/img.png',
    };
    render(
      <CategoryForm
        mode="edit"
        initialData={dataWithImage}
        items={mockCategories}
      />,
    );

    const img = screen.getByRole('img', { name: 'Preview' });
    expect(img).toHaveAttribute('src', 'https://example.com/img.png');
  });
});
