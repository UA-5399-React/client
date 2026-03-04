import { Button as BaseButton } from '@base-ui/react/button';

import styles from './Button.module.css';

export type ButtonProps = React.ComponentProps<typeof BaseButton>;

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
