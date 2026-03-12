import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Checkbox, Input } from '@/components';
import { AUTH_ROLES, MOCK_AUTH, ROUTES } from '@/constants';

const getMockExpirationTime = () => {
  return (Date.now() + 24 * 60 * 60 * 1000).toString();
};

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Privacy Policy and Terms of Use',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = () => {
    const expirationTime = getMockExpirationTime();

    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, MOCK_AUTH.MOCK_TOKEN);
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expirationTime);
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);

    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-medium text-gray-900">Sign Up</h2>
        <p className="mt-2 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium hover:opacity-80">
            <span className="text-green-500">Sign In</span>
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Input
          {...register('email')}
          type="email"
          variant="underlined"
          placeholder="Your email address"
          state={errors.email ? 'error' : 'default'}
          helperText={errors.email?.message}
          className="pb-2"
        />

        <div className="relative">
          <Input
            {...register('password')}
            type="password"
            variant="underlined"
            placeholder="Password"
            state={errors.password ? 'error' : 'default'}
            helperText={errors.password?.message}
            className="pr-10 pb-2"
          />
        </div>

        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type="password"
            variant="underlined"
            placeholder="Confirm password"
            state={errors.confirmPassword ? 'error' : 'default'}
            helperText={errors.confirmPassword?.message}
            className="pr-10 pb-2"
          />
        </div>

        <div className="pt-2">
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <Checkbox
                label={
                  <span className="text-sm text-gray-500">
                    I agree with{' '}
                    <a
                      href="#"
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Terms of Use
                    </a>
                  </span>
                }
                checked={field.value}
                onCheckedChange={field.onChange}
                state={errors.terms ? 'error' : 'default'}
                checkboxClassName="h-5 w-5 rounded border-gray-300"
              />
            )}
          />
          {errors.terms && (
            <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-black focus:ring-4 focus:ring-gray-300 focus:outline-none"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
