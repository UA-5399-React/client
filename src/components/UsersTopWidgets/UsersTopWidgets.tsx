import clsx from 'clsx';

interface UsersTopWidgetsProps {
  totalUsers: number;
  activeAdmins: number;
  blockedUsers: number;
}

const widgetItems = [
  { id: 'total-users', label: 'Total Users', valueKey: 'totalUsers' },
  { id: 'active-admins', label: 'Active Admins', valueKey: 'activeAdmins' },
  {
    id: 'blocked-accounts',
    label: 'Blocked Accounts',
    valueKey: 'blockedUsers',
  },
] as const;

export function UsersTopWidgets({
  totalUsers,
  activeAdmins,
  blockedUsers,
}: UsersTopWidgetsProps) {
  const values = {
    totalUsers,
    activeAdmins,
    blockedUsers,
  };

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3">
      {widgetItems.map((item, index) => (
        <div
          key={item.id}
          className={clsx(
            'flex flex-col items-center justify-center py-6',
            index !== widgetItems.length - 1 &&
              'md:border-r md:border-[#D9D9D9]',
          )}
        >
          <p className="m-0 text-6xl font-medium text-[#2C2C2C]">
            {values[item.valueKey]}
          </p>
          <p className="text-sm font-medium text-[#BDBDBD]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
