import React from 'react';
import { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Check,
  GripVertical,
  Loader2,
  PackageSearch,
  Plus,
} from 'lucide-react';
import { Pencil, Trash } from 'lucide-react';

import { AdminPageHeader, SearchInput } from '@/components';
import { ActionMenu } from '@/components';
import { NEW_ARRIVALS_LIMIT, ROUTES } from '@/constants';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { apiClient } from '@/services/api';
import type { Product } from '@/types/product.types';

type FeaturedProductItem = Pick<Product, 'title' | 'price' | 'imageUrl'> & {
  _id: string;
};

interface FeaturedResponse {
  productId: FeaturedProductItem | string;
  type: string;
  position: number;
}

interface SortableItemProps {
  product: FeaturedProductItem;
  children: React.ReactNode;
  onClick?: () => void;
}

function SortableItem({ product, children, onClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: isDragging ? 'relative' : undefined,
    zIndex: isDragging ? 50 : 1,
  };

  const childrenArray = React.Children.toArray(children);
  const content = childrenArray[0];
  const actionMenu = childrenArray[1];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`hover:bg-backgroundSec/50 bg-background flex cursor-pointer items-center justify-between px-6 py-4 transition-colors ${
        isDragging ? 'z-50 opacity-80 shadow-2xl ring-2 ring-blue-500/20' : ''
      }`}
    >
      <div className="flex flex-1 flex-grow items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-muted hover:text-text cursor-grab p-1 transition-colors active:cursor-grabbing"
        >
          <GripVertical size={20} aria-label="Drag handle" />
        </div>

        {content}
      </div>
      <div onClick={(e) => e.stopPropagation()}>{actionMenu}</div>
    </div>
  );
}

export function FeaturedProducts() {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<FeaturedProductItem[]>([]);
  const [featured, setFeatured] = useState<FeaturedProductItem[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchFeatured = async () => {
    try {
      const featuredRes = await apiClient.get<FeaturedResponse[]>(
        '/featured-products/new-arrivals',
      );

      const extractedProducts = (featuredRes || [])
        .map((item) =>
          typeof item.productId === 'object' ? item.productId : null,
        )
        .filter((p): p is FeaturedProductItem => p !== null);

      setFeatured(extractedProducts);
    } catch (error) {
      console.error('Fetch featured error:', error);
    }
  };

  const fetchProductsForSearch = async (searchQuery: string) => {
    try {
      let url = '/products?limit=10';

      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const productsRes = await apiClient.get<{
        items: FeaturedProductItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(url);

      if (productsRes && 'items' in productsRes) {
        setAllProducts(productsRes.items);
      } else {
        setAllProducts(Array.isArray(productsRes) ? productsRes : []);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      await Promise.all([fetchFeatured(), fetchProductsForSearch('')]);

      setLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      fetchProductsForSearch('');
      return;
    }

    const handleSearch = async () => {
      setIsSearching(true);
      await fetchProductsForSearch(debouncedSearch);
      setIsSearching(false);
    };

    handleSearch();
  }, [debouncedSearch]);

  const handleAddProduct = async (product: FeaturedProductItem) => {
    if (featured.length >= NEW_ARRIVALS_LIMIT) return;
    try {
      setIsActionLoading(true);
      await apiClient.post('/featured-products', {
        productId: product._id,
        type: 'new_arrival',
        position: 0,
      });

      await fetchFeatured();
      setSearch('');
      setSelectedProductId(null);
    } catch (error) {
      console.error('Add error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      setIsActionLoading(true);
      await apiClient.delete(
        `/featured-products/${productId}?type=new_arrival`,
      );

      await fetchFeatured();
    } catch (error) {
      console.error('Remove error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const dropdownResults = (
    Array.isArray(allProducts) ? allProducts : []
  ).filter(
    (p) =>
      p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      !featured.some((f) => f._id === p._id),
  );

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-800" />
      </div>
    );
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = featured.findIndex((p) => p._id === active.id);
    const newIndex = featured.findIndex((p) => p._id === over.id);

    const newOrder = arrayMove(featured, oldIndex, newIndex);
    setFeatured(newOrder);

    const payload = newOrder.map((p, index) => ({
      productId: p._id,
      position: index,
    }));

    try {
      await apiClient.patch('/featured-products/reorder', payload);
    } catch (error) {
      console.error('Failed to save order:', error);
      fetchFeatured();
    }
  };

  return (
    <div className="pb-10">
      <AdminPageHeader />

      <div className="px-4 pt-6 md:px-8">
        <div className="mb-8 flex items-center justify-start gap-4">
          <h2 className="text-text flex items-center text-3xl leading-none font-bold">
            Manage New Arrivals
          </h2>
          <div
            className={`mt-1 inline-flex self-center rounded-full px-3 py-1 text-sm font-bold ${
              featured.length >= NEW_ARRIVALS_LIMIT
                ? 'bg-red-600/10 text-red-600'
                : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {featured.length} / {NEW_ARRIVALS_LIMIT} Items
          </div>
        </div>

        <div className="border-fieldBorder bg-background relative mb-8 rounded-lg border shadow-md">
          <div className="border-fieldBorder bg-backgroundSec flex items-center justify-between rounded-t-lg border-b px-6 py-4">
            <span className="text-muted text-sm font-bold tracking-wider uppercase">
              Add Product to Homepage
            </span>
            {(isActionLoading || isSearching) && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            )}
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <SearchInput
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setSelectedProductId(null);
                  setConfirmId(null);
                }}
                className={`[&_input]:bg-backgroundSec [&_input]:text-text [&_input]:border-fieldBorder [&_button]:hover:!bg-background/50 [&_button]:right-3 [&_button]:!border-none [&_button]:!bg-transparent [&_button]:!shadow-none ${
                  featured.length >= NEW_ARRIVALS_LIMIT
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={featured.length >= NEW_ARRIVALS_LIMIT}
              />
            </div>

            {search && featured.length < NEW_ARRIVALS_LIMIT && (
              <div className="border-fieldBorder bg-background absolute left-0 z-50 mt-1 max-h-60 w-full max-w-md overflow-x-hidden overflow-y-auto rounded-md border shadow-2xl">
                <style>{`
                  .absolute::-webkit-scrollbar { 
                    width: 6px; 
                    display: block !important; 
                  }
                  .absolute::-webkit-scrollbar-track { 
                    background: rgb(var(--color-gray-100)); 
                    border-radius: 10px; 
                  }
                  .absolute::-webkit-scrollbar-thumb { 
                    background-color: rgb(var(--color-gray-300)); 
                    border-radius: 20px;
                    border: 1px solid transparent;
                    background-clip: content-box; 
                  }
                  button { 
                    border: none !important; 
                    outline: none !important; 
                  }
    `}</style>

                {dropdownResults.length > 0 ? (
                  dropdownResults.map((product) => (
                    <div
                      key={product._id}
                      className="border-fieldBorder hover:bg-backgroundSec flex w-full items-center border-b p-3 transition-colors last:border-0"
                    >
                      <div className="min-w-0 flex-1 pr-2 pl-1">
                        <div className="text-text truncate text-left text-sm font-medium">
                          {product.title}
                        </div>
                      </div>

                      <div className="mr-6 flex w-24 flex-shrink-0 items-center justify-end">
                        {selectedProductId === product._id ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : confirmId === product._id ? (
                          <button
                            type="button"
                            aria-label="Confirm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddProduct(product);
                              setSelectedProductId(product._id);
                              setConfirmId(null);
                            }}
                            className="animate-in fade-in inline-flex items-center justify-center rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase transition-all hover:opacity-90 active:scale-95"
                          >
                            Confirm
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Add ${product.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmId(product._id);
                            }}
                            className="flex items-center justify-center rounded-full bg-transparent p-2 text-blue-400 transition-colors hover:text-blue-300 active:scale-90"
                          >
                            <Plus size={22} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted p-4 text-center text-sm italic">
                    No active products found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-fieldBorder bg-background rounded-lg border shadow-md">
          <div className="border-fieldBorder bg-backgroundSec border-b px-6 py-4">
            <span className="text-muted text-sm font-bold tracking-wider uppercase">
              Current Homepage List
            </span>
          </div>

          <div className="divide-fieldBorder divide-y">
            {featured.length === 0 ? (
              <div className="text-muted flex flex-col items-center justify-center py-20">
                <PackageSearch size={48} className="mb-2 opacity-20" />
                <p>
                  The list is empty. Add products to show them on Home page.
                </p>
              </div>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={featured.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {featured.map((product) => (
                    <SortableItem
                      key={product._id}
                      product={product}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="border-fieldBorder bg-backgroundSec h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-muted flex h-full w-full items-center justify-center">
                              <Plus size={16} />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-text font-bold">
                            {product.title}
                          </div>
                          <div className="text-muted text-sm">
                            ${product.price}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        <ActionMenu
                          triggerAriaLabel={`Actions for ${product.title}`}
                          actions={[
                            {
                              id: 'edit',
                              label: 'Edit',
                              icon: <Pencil className="h-4 w-4" />,
                              onClick: () => {
                                navigate(
                                  generatePath(ROUTES.ADMIN_PRODUCT_EDIT, {
                                    id: product._id,
                                  }),
                                );
                              },
                            },
                            {
                              id: 'delete',
                              label: 'Delete',
                              variant: 'danger',
                              icon: <Trash className="h-4 w-4" />,
                              onClick: () => handleRemoveProduct(product._id),
                            },
                          ]}
                        />
                      </div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
