import type * as ReactRouterDom from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as useCreateAdminCategoryHook from '@/hooks/useCreateAdminCategory';
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
  const actual =
    await vi.importActual<typeof ReactRouterDom>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

vi.mock('@/hooks/useCreateAdminCategory', () => ({
  useCreateAdminCategory: () => ({
    createCategory: vi.fn().mockResolvedValue({}),
    data: undefined,
    loading: false,
    error: undefined,
  }),
}));

vi.mock('@/hooks/useUpdateAdminCategory', () => ({
  useUpdateAdminCategory: () => ({
    updateCategory: vi.fn().mockResolvedValue({}),
    data: undefined,
    loading: false,
    error: undefined,
  }),
}));

describe('Component: CategoryForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  it('should render correctly in ADD mode', () => {
    render(<CategoryForm mode="add" items={[]} />);

    expect(screen.getByPlaceholderText('Category title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Short description'),
    ).toBeInTheDocument();
    expect(screen.getByText('Parent Category')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save Category' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should render initial data in EDIT mode', () => {
    render(
      <CategoryForm
        mode="edit"
        initialData={{
          id: 'cat1',
          title: 'Electronics',
          description: 'All electronic devices',
          imageUrl: 'https://example.com/img.png',
          depth: 1,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
          parent: null,
          products: [
            {
              id: 'p1',
              title: 'Phone',
              price: 100,
              status: 'active',
              createdAt: '',
              updatedAt: '',
            },
          ],
        }}
        items={[]}
      />,
    );

    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('All electronic devices'),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'https://example.com/img.png',
    );
    expect(screen.getByText('Products Review')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('should show validation errors on submit', async () => {
    const user = userEvent.setup();
    render(<CategoryForm mode="add" items={[]} />);

    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Description is required'),
    ).toBeInTheDocument();
  });

  it('should submit valid form data in ADD mode', async () => {
    const user = userEvent.setup();
    const createCategoryMock = vi.fn().mockResolvedValue({});
    vi.spyOn(
      useCreateAdminCategoryHook,
      'useCreateAdminCategory',
    ).mockReturnValue({
      createCategory: createCategoryMock,
      data: undefined,
      loading: false,
      error: undefined,
    });

    render(<CategoryForm mode="add" items={[]} />);

    const titleInput = screen.getByPlaceholderText('Category title');
    const descriptionInput = screen.getByPlaceholderText('Short description');

    await user.type(titleInput, 'New Category');
    await user.type(descriptionInput, 'Description text');
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(createCategoryMock).toHaveBeenCalledWith({
        title: 'New Category',
        description: 'Description text',
        parent: undefined,
        imageUrl: undefined,
        depth: 1,
      });
    });
  });

  it('should open file picker, show preview, and remove image', async () => {
    const user = userEvent.setup();
    const createObjectURLMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:preview');

    const { container } = render(<CategoryForm mode="add" items={[]} />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');

    await user.click(screen.getByText('Upload'));
    expect(clickSpy).toHaveBeenCalledOnce();

    const file = new File(['img'], 'img.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(createObjectURLMock).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'blob:preview',
    );

    // remove image — find the remove button inside the same image container
    const preview = screen.getByAltText('Preview');
    const removeButton = preview
      .closest('div')!
      .querySelector('button') as HTMLElement;
    await user.click(removeButton);
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('should select parent category from dropdown', async () => {
    const user = userEvent.setup();

    render(
      <CategoryForm
        mode="add"
        items={[
          {
            id: 'cat1',
            title: 'Electronics',
            depth: 1,
            createdAt: '',
            updatedAt: '',
          },
          {
            id: 'cat2',
            title: 'Phones',
            depth: 2,
            createdAt: '',
            updatedAt: '',
          },
        ]}
      />,
    );

    const dropdown = screen.getByText('Parent Category');
    await user.click(dropdown);
    await user.click(screen.getByText('Electronics'));

    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should call navigate on Cancel button click', async () => {
    const user = userEvent.setup();

    render(<CategoryForm mode="add" items={[]} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should show server error if createCategory fails', async () => {
    const user = userEvent.setup();
    const createCategoryMock = vi.fn().mockRejectedValue(new Error('Failed'));
    vi.spyOn(
      useCreateAdminCategoryHook,
      'useCreateAdminCategory',
    ).mockReturnValue({
      createCategory: createCategoryMock,
      data: undefined,
      loading: false,
      error: undefined,
    });

    render(<CategoryForm mode="add" items={[]} />);

    await user.type(screen.getByPlaceholderText('Category title'), 'Title');
    await user.type(screen.getByPlaceholderText('Short description'), 'Desc');
    await user.click(screen.getByRole('button', { name: 'Save Category' }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to save category/i)).toBeInTheDocument();
    });
  });
});
