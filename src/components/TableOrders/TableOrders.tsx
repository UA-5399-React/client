import { useState } from 'react';
import clsx from 'clsx';
import { Pencil, Trash } from 'lucide-react';

import {
  ActionMenu,
  ConfirmModal,
  Dropdown,
  MainTable,
  TableSortControl,
} from '@/components';
import type { OrdersSortField, SortOrder } from '@/hooks/useAdminOrders';
import { useDeleteAdminOrder } from '@/hooks/useDeleteAdminOrder';
import type { Column } from '@/types';
import {
  ORDER_STATUS,
  type OrderItem,
  type OrderStatus,
} from '@/types/tableOrders.types';
import { capitalizeFirst, formatDate } from '@/utils';

interface TableOrdersProps {
  items: OrderItem[];
  loading: boolean;
  error: Error | null | undefined;
  sort: OrdersSortField | null;
  order: SortOrder;
  onSortChange: (field: OrdersSortField) => void;
  onEdit: (item: OrderItem) => void;
  onStatusChange: (
    orderId: string,
    status: OrderItem['status'],
  ) => Promise<void>;
}

const statusOptions = Object.values(ORDER_STATUS).map((status) => ({
  label: capitalizeFirst(status),
  value: status,
}));

export function TableOrders({
  items,
  loading,
  error,
  sort,
  order,
  onSortChange,
  onStatusChange,
  onEdit,
}: TableOrdersProps) {
  const { deleteOrder } = useDeleteAdminOrder();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const columns: Column[] = [
    { key: 'product', label: 'Product Name', className: '!min-w-[55%]' },
    {
      key: 'customer',
      label: (
        <TableSortControl<OrdersSortField>
          label="Customer name"
          field="customerName"
          currentSort={sort as OrdersSortField}
          currentOrder={order}
          onSortChange={onSortChange}
        />
      ),
      className: 'min-w-[5%]',
    },
    {
      key: 'orderId',
      label: (
        <TableSortControl<OrdersSortField>
          label="Order ID"
          field="orderId"
          currentSort={sort as OrdersSortField}
          currentOrder={order}
          onSortChange={onSortChange}
        />
      ),
      className: 'min-w-[6%]',
    },
    {
      key: 'totalPrice',
      label: (
        <TableSortControl<OrdersSortField>
          label="Total Price"
          field="totalPrice"
          currentSort={sort as OrdersSortField}
          currentOrder={order}
          onSortChange={onSortChange}
        />
      ),
      className: 'min-w-[10%]',
    },
    { key: 'status', label: 'Status', className: 'min-w-[10%]' },
    {
      key: 'date',
      label: (
        <TableSortControl<OrdersSortField>
          label="Date"
          field="createdAt"
          currentSort={sort as OrdersSortField}
          currentOrder={order}
          onSortChange={onSortChange}
        />
      ),
      className: 'min-w-[10%]',
    },
    { key: 'phone', label: 'Phone', className: 'min-w-[15%]' },
    { key: 'actions', label: 'Actions', className: '' },
  ];

  const openDeleteModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrderId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedOrderId) return;

    try {
      await deleteOrder(selectedOrderId);
      closeDeleteModal();
    } catch (deleteError) {
      console.error('Failed to delete order:', deleteError);
    }
  };

  const renderProductRow = (item: OrderItem) => {
    const handleStatusSelect = (selected: { value: string }[]) => {
      const nextStatus = selected[0]?.value as OrderStatus;
      const currentStatus = item.status.toLowerCase();

      if (!nextStatus || nextStatus.toLowerCase() === currentStatus) {
        return;
      }

      void onStatusChange(item.orderId, nextStatus);
    };

    const firstProduct = item.items[0];
    const customerName = `${item.user.firstName} ${item.user.lastName}`.trim();
    const selectedStatus = item.status
      ? [String(item.status).toLowerCase()]
      : [];

    return (
      <>
        <td>
          <div className="flex flex-row gap-2">
            {firstProduct?.imageUrl ? (
              <img
                src={firstProduct.imageUrl}
                alt={firstProduct.title}
                className="h-10 w-10 rounded object-cover"
              />
            ) : null}

            <div className="flex flex-col gap-1 text-left">
              <span>{firstProduct?.title ?? 'No items'}</span>
              <span>Items: {item.items.length}</span>
            </div>
          </div>
        </td>

        <td>{customerName}</td>
        <td>#{item.orderId}</td>
        <td>${item.totalPrice.toFixed(2)}</td>

        <td>
          <div className="flex justify-center">
            <Dropdown
              label="Status"
              labelClassName="hidden"
              options={statusOptions}
              selectedValues={selectedStatus}
              onChange={handleStatusSelect}
              multiple={false}
              hasBorder={true}
              placeholder="Status"
              selectClassName={
                ' ' +
                clsx(
                  '!flex !items-center !justify-between',
                  '!h-8 !w-[120px] !rounded-[10px] !border !border-[#8F96A3] !bg-white !px-3 !py-0 !text-xs !font-normal !text-[#2C2C2C] !shadow-none hover:!bg-white',
                  '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-[#2563EB]',
                )
              }
            />
          </div>
        </td>

        <td>{formatDate(new Date(item.createdAt))}</td>
        <td>{item.user.phone}</td>

        <td>
          <ActionMenu
            triggerAriaLabel={`Actions for order ${item.orderId}`}
            className="top-0 left-[-135px]"
            actions={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <Pencil className="h-[20px] w-[20px]" />,
                onClick: () => onEdit(item),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Trash className="h-[20px] w-[20px]" />,
                onClick: () => openDeleteModal(item.orderId),
                variant: 'danger',
              },
            ]}
          />
        </td>
      </>
    );
  };

  return (
    <>
      <MainTable
        columns={columns}
        items={items}
        loading={loading}
        error={error}
        emptyMessage="No orders found"
        renderRow={renderProductRow}
      />

      {isDeleteModalOpen && (
        <ConfirmModal
          title="Delete order"
          description="Are you sure you want to delete this order?"
          confirmText="Delete"
          cancelText="Cancel"
          isCritical={true}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </>
  );
}
