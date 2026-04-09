import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';

import { exportService } from '../../services/exportService';
import { Button } from '../Button/Button';

interface ExportButtonProps {
  type: 'products' | 'orders';
}

export function ExportButton({ type }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const fileName =
        type === 'products' ? 'products_export' : 'orders_export';
      const onExport =
        type === 'products'
          ? exportService.exportProducts
          : exportService.exportOrders;

      const blob = await onExport();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${type} successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className="ml-3 flex items-center gap-2 border border-gray-300 bg-transparent text-[rgb(var(--color-text))] hover:border-blue-500 hover:text-blue-500"
    >
      {isLoading ? (
        <span className="animate-spin">◌</span>
      ) : (
        <Download size={18} />
      )}
      {isLoading
        ? 'Exporting...'
        : `Export ${type === 'products' ? 'Products' : 'Orders'}`}
    </Button>
  );
}
