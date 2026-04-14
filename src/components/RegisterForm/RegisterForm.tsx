import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import googleIcon from '@/assets/icons/google-icon.webp';
import { Button, Checkbox, Input } from '@/components';
import { ROUTES } from '@/constants';
import { useRegister } from '@/hooks';
import { AuthApiError, authService } from '@/services/authService';

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(50, 'First name must be at most 50 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(
        8,
        'Password must be at least 8 characters, include uppercase, lowercase, number and symbol',
      )
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must include at least one special character',
      ),
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
  const { mutateAsync: registerMutation, isPending } = useRegister();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null,
  );
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(
    null,
  );
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    message: string;
    status: 'success' | 'error';
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await registerMutation({
        firstName: data.firstName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.confirmPassword,
      });

      setRegisteredEmail(data.email);
      setRegistrationStatus(response.status);
      setRegistrationMessage(response.message);
      setResendFeedback(null);
      reset();
      clearErrors('root');
    } catch (error) {
      if (
        error instanceof AuthApiError &&
        error.code === 'EMAIL_NOT_CONFIRMED'
      ) {
        setRegisteredEmail(data.email);
        setRegistrationStatus('pending_verification');
        setRegistrationMessage(error.message);
        setResendFeedback(null);
        reset();
        clearErrors('root');
        return;
      }

      setError('root', {
        type: 'server',
        message:
          error instanceof Error ? error.message : 'Failed to create account',
      });
    }
  };

  const handleGoogleAuth = () => {
    authService.startGoogleAuth();
  };

  const handleResendConfirmation = async () => {
    if (!registeredEmail) {
      return;
    }

    setIsResendingConfirmation(true);
    setResendFeedback(null);

    try {
      const response = await authService.resendConfirmation(registeredEmail);
      setResendFeedback({
        message: response.message,
        status: 'success',
      });
    } catch (error) {
      setResendFeedback({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to resend confirmation email.',
        status: 'error',
      });
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const shouldShowPendingState = registrationStatus === 'pending_verification';
  const registrationDescription = shouldShowPendingState
    ? `Your account for ${registeredEmail} is waiting for email verification. Request a new confirmation email below to continue.`
    : `We sent a confirmation email to ${registeredEmail}. Please check your inbox to finish registration.`;
  const registrationAlertClassName = shouldShowPendingState
    ? 'rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-200'
    : 'rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300';

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-text text-4xl font-medium">
          {registeredEmail ? 'Check your email' : 'Sign Up'}
        </h2>
        {registeredEmail ? (
          <p className="text-text mt-2 text-sm">
            {shouldShowPendingState ? (
              registrationDescription
            ) : (
              <>
                We sent a confirmation email to{' '}
                <span className="text-text font-bold">{registeredEmail}</span>.
                Please check your inbox to finish registration.
              </>
            )}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium hover:opacity-80">
              <span className="text-green-500">Sign In</span>
            </Link>
          </p>
        )}
      </div>

      {registeredEmail ? (
        <div className="space-y-6">
          <div className={registrationAlertClassName}>
            {registrationMessage ??
              'Your account was created successfully. A confirmation email has been sent, so you can test the next step when you are ready.'}
          </div>
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleResendConfirmation}
              disabled={isResendingConfirmation}
              className="box-border inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3.5 text-center text-sm font-medium text-gray-900 transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isResendingConfirmation
                ? 'Sending confirmation email...'
                : 'Resend confirmation email'}
            </Button>
            {resendFeedback && (
              <p
                className={`text-center text-sm font-medium ${
                  resendFeedback.status === 'success'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {resendFeedback.message}
              </p>
            )}
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="box-border inline-flex w-full items-center justify-center rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white! transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => clearErrors('root')}
          className="space-y-6"
          noValidate
        >
          <Button
            type="button"
            onClick={handleGoogleAuth}
            className="bg-primary hover:bg-primary/85 focus:ring-primary/30 box-border inline-flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:outline-none"
          >
            <span className="flex items-center gap-3">
              <img
                src={googleIcon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 rounded-sm bg-white/90 p-0.5"
              />
              <span>Continue with Google</span>
            </span>
          </Button>

          <div className="flex items-center gap-4">
            <span className="bg-fieldBorder/80 h-px flex-1" />
            <span className="text-muted shrink-0 text-xs font-medium tracking-[0.2em] uppercase">
              or
            </span>
            <span className="bg-fieldBorder/80 h-px flex-1" />
          </div>

          <Input
            {...register('firstName')}
            type="text"
            variant="underlined"
            placeholder="First name"
            autoComplete="given-name"
            state={errors.firstName ? 'error' : 'default'}
            helperText={errors.firstName?.message}
            className="pb-2"
          />

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
              <p className="mt-1 text-sm text-red-500">
                {errors.terms.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-center text-sm font-medium text-red-500">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="bg-bgSecInverted mt-6 w-full cursor-pointer rounded-lg px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none dark:text-black"
          >
            {isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      )}
    </div>
  );
};
