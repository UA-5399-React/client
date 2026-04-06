import type { ProfileFormValues } from '@/schemas/profile.schema';
import type { User } from '@/types/user';

export const EMPTY_FORM_VALUES: ProfileFormValues = {
  firstName: '',
  lastName: '',
  oldPassword: '',
  newPassword: '',
  repeatPassword: '',
};

export const getFormValuesFromUser = (
  user?: User | null,
): ProfileFormValues => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  oldPassword: '',
  newPassword: '',
  repeatPassword: '',
});
