import styles from './Button.module.css';
import { Button as BaseButton } from '@base-ui/react/button';

type ButtonProps = React.ComponentProps<typeof BaseButton>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <BaseButton className={`${styles.button} ${className}`} {...props}>
      {children}
    </BaseButton>
  );
}
