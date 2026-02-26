import { type ButtonHTMLAttributes, type ReactNode } from 'react';

// TODO: this is just an example button component, you can customize it as needed

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700 border-transparent',
  outline:
    'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
};

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`rounded-lg border px-5 py-2.5 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
