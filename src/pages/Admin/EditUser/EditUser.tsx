import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';
import { useGetAdminUser } from '@/hooks/useGetAdminUser';
import { useUpdateAdminUser } from '@/hooks/useUpdateAdminUser';
import { useUploadProductImage } from '@/hooks/useUploadProductImage';
import type { UserFormData } from '@/types/admin-user.types';
import { splitFullName } from '@/utils/string.utils';

import { UserForm } from '../../../components/UserForm/UserForm';

export const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: isFetchingUser, error } = useGetAdminUser(id);
  const { updateUser, isUpdating } = useUpdateAdminUser();
  const { uploadImage, loading: isUploading } = useUploadProductImage();
  const [serverError, setServerError] = useState<string | null>(null);

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_USERS} replace />;
  }

  const handleUpdateUser = async (data: UserFormData) => {
    try {
      setServerError(null);

      let avatarUrl: string | undefined;

      if (data.imageFile) {
        const uploadedImage = await uploadImage(data.imageFile);
        avatarUrl = uploadedImage.imageUrl;
      }

      const { firstName, lastName } = splitFullName(data.name);

      await updateUser({
        id,
        role: data.role,
        firstName,
        lastName,
        ...(avatarUrl ? { avatarUrl } : {}),
      });

      navigate(ROUTES.ADMIN_USERS, {
        state: { successMessage: 'User updated successfully.' },
      });
    } catch (updateError) {
      setServerError(
        updateError instanceof Error
          ? updateError.message
          : 'Failed to update user',
      );
    }
  };

  if (isFetchingUser) {
    return (
      <section className="bg-background flex min-h-screen items-center justify-center px-6 py-10">
        <div className="rounded-lg border border-[#d0d5dd] bg-white px-6 py-4 text-sm text-[#667085] shadow-[0px_4px_8px_0px_rgba(16,24,40,0.05),0px_2px_4px_0px_rgba(16,24,40,0.05)]">
          Loading user...
        </div>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="bg-background min-h-screen px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-white p-6 shadow-[0px_4px_8px_0px_rgba(16,24,40,0.05),0px_2px_4px_0px_rgba(16,24,40,0.05)]">
          <p className="text-sm font-semibold tracking-[0.08em] text-red-600 uppercase">
            Unable to load user
          </p>
          <p className="mt-2 text-sm text-[#667085]">
            {error?.message ?? 'The selected user could not be found.'}
          </p>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
              className="h-10 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-medium text-[#344054] hover:!bg-[#f9fafb]"
            >
              Back to Users
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background min-h-screen px-6 py-10">
      <UserForm
        mode="edit"
        initialData={user}
        onSubmit={handleUpdateUser}
        onCancel={() => navigate(ROUTES.ADMIN_USERS)}
        isLoading={isUpdating || isUploading}
        serverError={serverError}
      />
    </section>
  );
};
