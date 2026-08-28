import * as React from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      outline: 'border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800',
      ghost: 'text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-white dark:hover:bg-slate-800',
      link: 'text-slate-900 underline-offset-4 hover:underline focus-visible:ring-slate-900 dark:text-white',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-base',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
