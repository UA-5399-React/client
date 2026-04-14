import { useEffect, useState } from 'react';
import { Check, Loader2, PackageSearch, Plus, Trash2 } from 'lucide-react';

import { AdminPageHeader, Button, SearchInput } from '@/components';
import { NEW_ARRIVALS_LIMIT } from '@/constants';
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
export function FeaturedProducts() {
  const [allProducts, setAllProducts] = useState<FeaturedProductItem[]>([]);
  const [featured, setFeatured] = useState<FeaturedProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setConfirmId(null);
      setDeleteConfirmId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productsRes = await apiClient.get<{
          items: FeaturedProductItem[];
        }>('/products?status=active');

        if (productsRes && 'items' in productsRes) {
          setAllProducts(productsRes.items);
        } else {
          setAllProducts(Array.isArray(productsRes) ? productsRes : []);
        }

        await fetchFeatured();
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      setDeleteConfirmId(null);
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
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      !featured.some((f) => f._id === p._id),
  );

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-800" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminPageHeader />

      <div className="px-4 pt-6 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-text flex items-center gap-2 text-3xl font-bold">
            Manage New Arrivals
          </h2>
          <div
            className={`rounded-full px-3 py-1 text-sm font-bold ${
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
            {isActionLoading && (
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
      .absolute::-webkit-scrollbar { width: 5px; }
      .absolute::-webkit-scrollbar-track { background: transparent; }
      .absolute::-webkit-scrollbar-thumb { 
        background-color: var(--fieldBorder); 
        border-radius: 20px; 
      }
      button { border: none !important; outline: none !important; }
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

        <div className="border-fieldBorder bg-background overflow-hidden rounded-lg border shadow-md">
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
              featured.map((product) => (
                <div
                  key={product._id}
                  className="hover:bg-backgroundSec/50 flex items-center justify-between px-6 py-4 transition-colors"
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
                      <div className="text-text font-bold">{product.title}</div>
                      <div className="text-muted text-sm">${product.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {deleteConfirmId === product._id ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(product._id);
                        }}
                        className="animate-in zoom-in rounded-full border-none bg-red-600 px-4 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 outline-none hover:bg-red-700 focus:ring-0 active:scale-95"
                      >
                        Confirm Delete
                      </button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(product._id);
                        }}
                        className="border-fieldBorder text-muted bg-transparent !p-2 transition-all hover:border-red-600 hover:text-red-600 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
