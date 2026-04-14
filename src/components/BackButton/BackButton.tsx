import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
  label?: string;
  className?: string;
};

export function BackButton({
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`text-muted mt-4 mb-6 flex items-center gap-2 border-none bg-transparent text-[16px] font-medium transition md:hidden ${className}`}
    >
      <ChevronLeft size={20} />
      {label}
    </button>
  );
}
