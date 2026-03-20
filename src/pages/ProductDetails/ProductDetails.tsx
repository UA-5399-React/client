import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Image as ImageIcon, Minus, Plus } from 'lucide-react';

import { productService } from '@/services/productService';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return <div className="p-10 text-center text-xl">Loading product...</div>;
  if (isError || !product)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading product!
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-lg bg-gray-200">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-24 w-24 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-4xl font-bold">{product.title}</h1>
          <p className="mb-6 text-gray-600">
            {product.description || 'No info available'}
          </p>
          <div className="mb-8 text-2xl font-bold">${product.price}</div>
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex h-[52px] gap-4">
              <div className="flex w-[120px] items-center justify-between rounded-lg bg-[#F3F5F7] px-2">
                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-gray-500 transition-colors outline-none hover:bg-gray-200 hover:text-black">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-semibold text-black">1</span>
                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-gray-500 transition-colors outline-none hover:bg-gray-200 hover:text-black">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white font-medium text-black transition-all outline-none hover:border-black">
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </button>
            </div>
            <button className="h-[52px] w-full cursor-pointer rounded-lg border-none bg-[#141718] font-medium text-white transition-all outline-none hover:bg-black">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
