import { useEffect, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';

import { USER_ROLE_EDIT_OPTIONS } from '@/constants/adminUsers';
import type {
  AdminUserDetails,
  UserFormData,
  UserRoleValue,
} from '@/types/admin-user.types';

import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { Input } from '../Input';

const userFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.length >= 8,
      'Password must be at least 8 characters',
    ),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER']),
  imagePreview: z.string().nullable(),
  imageFile: z.instanceof(File).optional(),
});

type UserFormMode = 'create' | 'edit';

interface UserFormProps {
  mode: UserFormMode;
  initialData?: AdminUserDetails;
  onSubmit: (data: UserFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  serverError?: string | null;
}

const baseInputStyles =
  '!box-border !h-11 !rounded-lg !border !border-[#b1b5c3] !bg-white !px-[14px] !py-[10px] !text-base !leading-6 !font-normal !text-[#141718] !shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] placeholder:!text-[#667085] focus:!border-[#38cb89]';

const readOnlyInputStyles =
  '!bg-[#f9fafb] !text-[#667085] !cursor-not-allowed hover:!bg-[#f9fafb]';

const buttonBaseClasses =
  '!inline-flex !h-9 !items-center !justify-center !rounded-lg !px-[14px] !py-2 !text-sm !font-medium !leading-5 !shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]';

const getDefaultValues = (initialData?: AdminUserDetails): UserFormData => ({
  name: [initialData?.firstName, initialData?.lastName]
    .filter(Boolean)
    .join(' '),
  email: initialData?.email ?? '',
  password: '',
  role:
    (String(initialData?.role ?? 'CUSTOMER').toUpperCase() as UserRoleValue) ||
    'CUSTOMER',
  imagePreview: initialData?.avatarUrl ?? null,
  imageFile: undefined,
});

export const UserForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  serverError,
}: UserFormProps) => {
  const isEditMode = mode === 'edit';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: getDefaultValues(initialData),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const imagePreview = useWatch({ control, name: 'imagePreview' });

  useEffect(() => {
    register('imagePreview');
    register('imageFile');
  }, [register]);

  useEffect(() => {
    reset(getDefaultValues(initialData));
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setValue('imageFile', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setValue('imageFile', file, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('imagePreview', previewUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const isDisabled = isLoading || isSubmitting;

  return (
    <div className="mx-auto w-full max-w-[1064px] rounded-lg border border-black/10 bg-[#f5f5f5] px-4 py-[26px] shadow-[0px_4px_8px_0px_rgba(16,24,40,0.05),0px_2px_4px_0px_rgba(16,24,40,0.05)]">
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
        })}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col items-center gap-4 px-2">
          <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[5px] bg-[#e2e6ec]">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="User avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-[#98a2b3]" />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />

          <Button
            type="button"
            disabled={isDisabled}
            onClick={() => fileInputRef.current?.click()}
            className="!inline-flex !h-9 !items-center !justify-center !rounded-[5px] !border !border-[#38cb89] !bg-transparent !px-5 !py-2.5 !text-base !leading-[22px] !font-medium !text-[#38cb89] hover:!border-[#2fb377] hover:!bg-[#ecfdf3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose File
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-[550px] flex-col gap-2">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Name"
                placeholder="Name"
                {...field}
                value={field.value ?? ''}
                className="gap-2"
                state={errors.name ? 'error' : 'default'}
                helperText={errors.name?.message}
                labelClassName="text-base font-normal leading-6 text-[#141718]"
                helperTextClassName="ml-0 mt-0 text-sm leading-5"
                inputClassName={baseInputStyles}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Email"
                {...field}
                value={field.value ?? ''}
                readOnly={isEditMode}
                className="gap-2"
                state={errors.email ? 'error' : 'default'}
                helperText={errors.email?.message}
                labelClassName="text-base font-normal leading-6 text-[#141718]"
                helperTextClassName="ml-0 mt-0 text-sm leading-5"
                inputClassName={`${baseInputStyles} ${
                  isEditMode ? readOnlyInputStyles : ''
                }`}
              />
            )}
          />

          {!isEditMode && (
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  label="Password"
                  type="password"
                  placeholder="Password"
                  {...field}
                  value={field.value ?? ''}
                  className="gap-2"
                  state={errors.password ? 'error' : 'default'}
                  helperText={errors.password?.message}
                  labelClassName="text-base font-normal leading-6 text-[#141718]"
                  helperTextClassName="ml-0 mt-0 text-sm leading-5"
                  inputClassName={baseInputStyles}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div>
                <Dropdown
                  label="Role"
                  labelClassName="!text-base !font-normal !normal-case !leading-[26px] !text-[#141718]"
                  options={[...USER_ROLE_EDIT_OPTIONS]}
                  selectedValues={field.value ? [field.value] : []}
                  onChange={(selected) => {
                    const nextValue = selected[0]?.value;

                    if (nextValue) {
                      field.onChange(nextValue as UserRoleValue);
                    }
                  }}
                  placeholder="Role"
                  multiple={false}
                  selectClassName="!grid !h-11 !grid-cols-[1fr_auto] !items-center !rounded-lg !border !border-[#b1b5c3] !bg-white !px-4 !py-2 !text-left !text-base !font-normal !leading-[26px] !text-[#141718] !shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:!bg-white data-[popup-open]:!bg-white"
                />
              </div>
            )}
          />
        </div>

        {serverError && (
          <div
            role="alert"
            className="mx-auto w-full max-w-[550px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={isDisabled}
            className={`${buttonBaseClasses} bg-[#38cb89] text-white hover:!bg-[#2fb377] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isDisabled ? 'Saving...' : 'Save'}
          </Button>

          <Button
            type="button"
            disabled={isDisabled}
            onClick={onCancel}
            className={`${buttonBaseClasses} border border-[#d0d5dd] bg-white text-[#344054] hover:!bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
