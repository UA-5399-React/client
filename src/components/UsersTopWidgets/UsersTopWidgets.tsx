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
            'flex flex-col items-center justify-center py-6 transition-colors duration-300',
            index !== widgetItems.length - 1 &&
              'md:border-fieldBorder md:border-r',
          )}
        >
          <p className="text-text m-0 text-6xl font-medium">
            {values[item.valueKey]}
          </p>
          <p className="text-muted text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
