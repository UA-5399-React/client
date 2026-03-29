import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';
import { useCreateAdminUser } from '@/hooks/useCreateAdminUser';
import { useUploadProductImage } from '@/hooks/useUploadProductImage';
import type { CreateUserPayload, UserFormData } from '@/types/admin-user.types';
import { splitFullName } from '@/utils/string.utils';

import { UserForm } from '../../../components/UserForm/UserForm';

type CreatedUserState = {
  email: string;
  fullName: string;
  result: CreateUserPayload;
};

export const CreateUser = () => {
  const navigate = useNavigate();
  const { createUser, loading: isCreating } = useCreateAdminUser();
  const { uploadImage, loading: isUploading } = useUploadProductImage();
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<CreatedUserState | null>(null);

  const isLoading = isCreating || isUploading;

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setServerError(null);

      let avatarUrl: string | undefined;

      if (data.imageFile) {
        const uploadedImage = await uploadImage(data.imageFile);
        avatarUrl = uploadedImage.imageUrl;
      }

      const { firstName, lastName } = splitFullName(data.name);

      const result = await createUser({
        email: data.email,
        password: data.password || undefined,
        role: data.role,
        firstName,
        lastName,
        avatarUrl,
      });

      if (!result) {
        throw new Error('Failed to create user');
      }

      setCreatedUser({
        email: data.email,
        fullName: data.name,
        result,
      });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Failed to create user',
      );
    }
  };

  const credentialsMessage = useMemo(() => {
    if (!createdUser?.result.tempPassword) {
      return 'This user was created with the password you entered.';
    }

    return 'Store these temporary credentials securely before leaving this page.';
  }, [createdUser]);

  if (createdUser) {
    return (
      <section className="bg-background min-h-screen px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#d0d5dd] bg-white p-8 shadow-[0px_4px_8px_0px_rgba(16,24,40,0.05),0px_2px_4px_0px_rgba(16,24,40,0.05)]">
          <div className="mb-6">
            <p className="text-sm font-semibold tracking-[0.08em] text-[#38cb89] uppercase">
              User created
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#141718]">
              {createdUser.fullName || createdUser.email}
            </h1>
            <p className="mt-2 text-sm text-[#667085]">{credentialsMessage}</p>
          </div>

          <div className="space-y-4 rounded-lg border border-[#d0d5dd] bg-[#f9fafb] p-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] text-[#667085] uppercase">
                Email
              </p>
              <p className="mt-1 text-base font-medium text-[#141718]">
                {createdUser.email}
              </p>
            </div>

            {createdUser.result.tempPassword && (
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[#667085] uppercase">
                  Temporary password
                </p>
                <p className="mt-1 rounded-md border border-[#d0d5dd] bg-white px-3 py-2 font-mono text-base break-all text-[#141718]">
                  {createdUser.result.tempPassword}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={() =>
                navigate(ROUTES.ADMIN_USERS, {
                  state: { successMessage: 'User created successfully.' },
                })
              }
              className="h-10 rounded-lg bg-[#38cb89] px-4 text-sm font-medium text-white hover:!bg-[#2fb377]"
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
        mode="create"
        onSubmit={handleCreateUser}
        onCancel={() => navigate(ROUTES.ADMIN_USERS)}
        isLoading={isLoading}
        serverError={serverError}
      />
    </section>
  );
};
