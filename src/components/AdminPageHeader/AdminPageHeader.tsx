import { useAuth } from '@/hooks/useAuth';
import { isSuperAdminRole } from '@/utils/permissions';

export const AdminPageHeader = () => {
  const { role } = useAuth();

  return (
    <div className="border-b border-[#CFCFCF] p-5">
      <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
        Hello, {isSuperAdminRole(role) ? 'Super Admin' : 'Admin'} 👋
      </h1>
    </div>
  );
};
