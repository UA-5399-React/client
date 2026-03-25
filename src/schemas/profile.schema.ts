import { z } from 'zod';

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .refine((value) => value.length > 0, {
        message: 'First name is required',
      })
      .refine((value) => value.length >= 2, {
        message: 'First name must be at least 2 characters',
      }),

    lastName: z
      .string()
      .trim()
      .refine((value) => value.length > 0, {
        message: 'Last name is required',
      })
      .refine((value) => value.length >= 2, {
        message: 'Last name must be at least 2 characters',
      }),

    oldPassword: z.string(),
    newPassword: z.string(),
    repeatPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const oldPassword = data.oldPassword?.trim() ?? '';
    const newPassword = data.newPassword?.trim() ?? '';
    const repeatPassword = data.repeatPassword?.trim() ?? '';

    const hasAnyPasswordValue =
      oldPassword !== '' || newPassword !== '' || repeatPassword !== '';

    if (!hasAnyPasswordValue) return;

    if (!oldPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['oldPassword'],
        message: 'Old password is required',
      });
    }

    if (!newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'New password is required',
      });
    } else if (newPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'New password must be at least 6 characters',
      });
    }

    if (!repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['repeatPassword'],
        message: 'Repeat password is required',
      });
    } else if (repeatPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['repeatPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
