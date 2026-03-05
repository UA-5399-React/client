import { Button as BaseButton } from '@base-ui/react/button';

import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'outline';

export type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  variant?: Variant;
};

export function Button({ children, className, ...props }: ButtonProps) {
  const buttonClass = className
    ? `${styles.button} ${className}`
    : styles.button;

  return (
    <BaseButton className={buttonClass} {...props}>
      {children}
    </BaseButton>
  );
}
