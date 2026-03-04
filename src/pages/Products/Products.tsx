import { useEffect, useState } from 'react';
import { mockProducts } from '../../components/ProductsGrid/mock';
import { ProductsGrid } from '../../components/ProductsGrid/ProductsGrid';
import type { ViewType } from '../../components/ProductsGrid/types';
import ViewToggle from '../../components/ProductsGrid/ViewToggle';
import './Products.css';

export const Products = () => {
  const [viewType, setViewType] = useState<ViewType>('grid-4');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMobile) setViewType('list');
    }, 800);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <>
      <ViewToggle value={viewType} onChange={setViewType} isMobile={isMobile} />
      <ProductsGrid products={mockProducts} viewType={viewType} />
    </>
  );
};
